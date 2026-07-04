// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SentientCents is ERC20, Ownable {
    address public relayer;

    event RelayerUpdated(address indexed previousRelayer, address indexed newRelayer);

    constructor(address initialOwner) ERC20("SentientCents", "SCENT") Ownable(initialOwner) {}

    function decimals() public pure override returns (uint8) {
        return 2;
    }

    modifier onlyRelayer() {
        require(msg.sender == relayer, "SentientCents: caller is not relayer");
        _;
    }

    function setRelayer(address newRelayer) external onlyOwner {
        emit RelayerUpdated(relayer, newRelayer);
        relayer = newRelayer;
    }

    function mint(address to, uint256 amount) external onlyRelayer {
        _mint(to, amount);
    }
}
