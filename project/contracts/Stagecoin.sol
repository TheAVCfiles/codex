// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Stagecoin - visible reward token with role-gated minting and royalty-on-transfer.
/// @notice Roles: DEFAULT_ADMIN_ROLE, MINTER_ROLE, BURNER_ROLE, ROYALTY_ADMIN_ROLE.
contract Stagecoin is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant ROYALTY_ADMIN_ROLE = keccak256("ROYALTY_ADMIN_ROLE");

    /// @dev public reputation ledger tied to recreation activity.
    mapping(address => uint256) public streetcred;

    /// @dev royalty recipient and royalty expressed in basis points (10000 = 100%).
    address public royaltyRecipient;
    uint256 public royaltyBasisPoints;

    error InvalidRoyaltyBps();
    error InvalidRoyaltyRecipient();

    event RoyaltyRecipientUpdated(address indexed previous, address indexed current);
    event RoyaltyBasisPointsUpdated(uint256 previousBps, uint256 currentBps);
    event RecreationRewardMinted(address indexed recreator, uint256 views, uint256 amount, uint256 streetcredDelta);

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

    /// @notice Mint tokens (only MINTER_ROLE).
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    /// @notice Burn tokens from `from` (only BURNER_ROLE).
    function burn(address from, uint256 amount) external onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }

    /// @notice StagePort/PayGait wrapper for recreation minting and streetcred boost.
    /// @dev Preserves earlier API while still enforcing role-gated mint control.
    function mintOnRecreation(address recreator, uint256 views) external onlyRole(MINTER_ROLE) {
        uint256 perThousandViews = views / 1000;
        uint256 amount = (5 + perThousandViews) * 10 ** decimals();
        uint256 streetcredDelta = perThousandViews * 10;

        _mint(recreator, amount);
        streetcred[recreator] += streetcredDelta;

        emit RecreationRewardMinted(recreator, views, amount, streetcredDelta);
    }

    /// @notice Set royalty recipient (only ROYALTY_ADMIN_ROLE).
    function setRoyaltyRecipient(address recipient_) external onlyRole(ROYALTY_ADMIN_ROLE) {
        if (royaltyBasisPoints > 0 && recipient_ == address(0)) revert InvalidRoyaltyRecipient();
        emit RoyaltyRecipientUpdated(royaltyRecipient, recipient_);
        royaltyRecipient = recipient_;
    }

    /// @notice Set royalty basis points (only ROYALTY_ADMIN_ROLE).
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

    /// @dev Collect royalty on transfer (unless disabled or transfer touches royalty recipient).
    function _transfer(address from, address to, uint256 amount) internal virtual override {
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
}
