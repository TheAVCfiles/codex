// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title SentientCents - royalty token with 2-decimal unit and optional anti-hoarding decay.
contract SentientCents is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant ROYALTY_ADMIN_ROLE = keccak256("ROYALTY_ADMIN_ROLE");

    address public royaltyRecipient;
    uint256 public royaltyBasisPoints;

    /// @dev decay controls (time burn) for inactivity anti-hoarding pilot.
    uint256 public constant DECAY_TAU = 30 days;
    uint256 public constant DECAY_BPS = 200; // 2% per inactivity window.
    mapping(address => uint256) public lastTransfer;

    error InvalidRoyaltyBps();
    error InvalidRoyaltyRecipient();

    event RoyaltyRecipientUpdated(address indexed previous, address indexed current);
    event RoyaltyBasisPointsUpdated(uint256 previousBps, uint256 currentBps);
    event SourceRoyaltyMinted(address indexed source, uint256 views, uint256 amount);
    event InactivityDecayApplied(address indexed account, uint256 amountBurned);

    constructor(
        string memory name_,
        string memory symbol_,
        address admin_,
        address royaltyRecipient_,
        uint256 royaltyBps_
    ) ERC20(name_, symbol_) {
        address actualAdmin = admin_ == address(0) ? _msgSender() : admin_;
        _setupRole(DEFAULT_ADMIN_ROLE, actualAdmin);
        _setupRole(MINTER_ROLE, actualAdmin);
        _setupRole(BURNER_ROLE, actualAdmin);
        _setupRole(ROYALTY_ADMIN_ROLE, actualAdmin);

        _setRoyaltyConfig(royaltyRecipient_, royaltyBps_);
    }

    /// @notice SentientCents uses 2 decimals (cents-like).
    function decimals() public pure override returns (uint8) {
        return 2;
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }

    /// @notice StagePort/PayGait wrapper for source royalties (kept from earlier API).
    function autoPushToSource(address source, uint256 views) external onlyRole(MINTER_ROLE) {
        uint256 perThousandViews = views / 1000;
        uint256 amount = 10 * sqrt(perThousandViews) * 10 ** decimals();

        if (amount > 0) {
            _mint(source, amount);
            emit SourceRoyaltyMinted(source, views, amount);
        }
    }

    function setRoyaltyRecipient(address recipient_) external onlyRole(ROYALTY_ADMIN_ROLE) {
        if (royaltyBasisPoints > 0 && recipient_ == address(0)) revert InvalidRoyaltyRecipient();
        emit RoyaltyRecipientUpdated(royaltyRecipient, recipient_);
        royaltyRecipient = recipient_;
    }

    function setRoyaltyBasisPoints(uint256 bps_) external onlyRole(ROYALTY_ADMIN_ROLE) {
        if (bps_ > 10000) revert InvalidRoyaltyBps();
        if (bps_ > 0 && royaltyRecipient == address(0)) revert InvalidRoyaltyRecipient();
        emit RoyaltyBasisPointsUpdated(royaltyBasisPoints, bps_);
        royaltyBasisPoints = bps_;
    }

    /// @notice Preview royalty fee and net amount for a transfer amount.
    function previewRoyalty(uint256 amount) external view returns (uint256 fee, uint256 net) {
        fee = (amount * royaltyBasisPoints) / 10000;
        net = amount - fee;
    }

    /// @notice Manually apply inactivity decay for anti-hoarding policy windows.
    /// @dev callable by BURNER_ROLE so platform operator can batch decay off-chain.
    function applyInactivityDecay(address account) external onlyRole(BURNER_ROLE) {
        if (block.timestamp - lastTransfer[account] <= DECAY_TAU) return;

        uint256 balance = balanceOf(account);
        if (balance == 0) return;

        uint256 burnAmount = (balance * DECAY_BPS) / 10000;
        if (burnAmount == 0) return;

        _burn(account, burnAmount);
        emit InactivityDecayApplied(account, burnAmount);
    }

    function _transfer(address from, address to, uint256 amount) internal virtual override {
        if (from != address(0)) {
            lastTransfer[from] = block.timestamp;
        }
        if (to != address(0)) {
            lastTransfer[to] = block.timestamp;
        }

        if (
            royaltyRecipient == address(0)
                || royaltyBasisPoints == 0
                || from == royaltyRecipient
                || to == royaltyRecipient
        ) {
            super._transfer(from, to, amount);
            return;
        }

        uint256 fee = (amount * royaltyBasisPoints) / 10000;
        if (fee == 0) {
            super._transfer(from, to, amount);
            return;
        }

        uint256 net = amount - fee;
        super._transfer(from, royaltyRecipient, fee);
        super._transfer(from, to, net);
    }

    function _setRoyaltyConfig(address recipient_, uint256 bps_) internal {
        if (bps_ > 10000) revert InvalidRoyaltyBps();
        if (bps_ > 0 && recipient_ == address(0)) revert InvalidRoyaltyRecipient();

        royaltyRecipient = recipient_;
        royaltyBasisPoints = bps_;
    }

    function sqrt(uint256 x) internal pure returns (uint256 y) {
        if (x == 0) return 0;

        uint256 z = (x + 1) / 2;
        y = x;

        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
