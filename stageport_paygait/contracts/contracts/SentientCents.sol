// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SentientCents is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant ROYALTY_ADMIN_ROLE = keccak256("ROYALTY_ADMIN_ROLE");

    uint256 public constant DECAY_TAU = 30 days;
    mapping(address => uint256) public lastTransfer;
    address public royaltyRecipient;
    uint256 public royaltyBasisPoints;

    event RoyaltyRecipientUpdated(address indexed previous, address indexed current);
    event RoyaltyBasisPointsUpdated(uint256 previousBps, uint256 currentBps);

    constructor(
        string memory name_,
        string memory symbol_,
        address admin_,
        address royaltyRecipient_,
        uint256 royaltyBps_
    ) ERC20(name_, symbol_) {
        address actualAdmin = admin_ == address(0) ? msg.sender : admin_;
        _setupRole(DEFAULT_ADMIN_ROLE, actualAdmin);
        _setupRole(MINTER_ROLE, actualAdmin);
        _setupRole(BURNER_ROLE, actualAdmin);
        _setupRole(ROYALTY_ADMIN_ROLE, actualAdmin);

        royaltyRecipient = royaltyRecipient_;
        require(royaltyBps_ <= 10000, "SentientCents: bp>10000");
        royaltyBasisPoints = royaltyBps_;
    }

    function decimals() public pure override returns (uint8) {
        return 2;
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }

    function setRoyaltyRecipient(address _recipient) external onlyRole(ROYALTY_ADMIN_ROLE) {
        emit RoyaltyRecipientUpdated(royaltyRecipient, _recipient);
        royaltyRecipient = _recipient;
    }

    function setRoyaltyBasisPoints(uint256 _bps) external onlyRole(ROYALTY_ADMIN_ROLE) {
        require(_bps <= 10000, "SentientCents: bp>10000");
        emit RoyaltyBasisPointsUpdated(royaltyBasisPoints, _bps);
        royaltyBasisPoints = _bps;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        if (from != address(0) && block.timestamp - lastTransfer[from] > DECAY_TAU) {
            uint256 bal = balanceOf(from);
            if (bal > 0) {
                uint256 decay = (bal * sqrt(bal)) / 10;
                if (decay > bal) decay = bal;
                _burn(from, decay);
            }
        }

        if (from != address(0)) {
            lastTransfer[from] = block.timestamp;
        }

        super._beforeTokenTransfer(from, to, amount);
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

    function _transfer(address from, address to, uint256 amount) internal virtual override {
        if (
            royaltyRecipient == address(0) ||
            royaltyBasisPoints == 0 ||
            from == royaltyRecipient ||
            to == royaltyRecipient
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
}
