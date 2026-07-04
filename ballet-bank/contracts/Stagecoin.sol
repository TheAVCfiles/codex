// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Stagecoin is ERC20, Ownable {
    address public minter;

    event MinterUpdated(address indexed previousMinter, address indexed newMinter);

    constructor(address initialOwner) ERC20("Stagecoin", "STAGE") Ownable(initialOwner) {}

    modifier onlyMinter() {
        require(msg.sender == minter, "Stagecoin: caller is not minter");
        _;
    }

    function setMinter(address newMinter) external onlyOwner {
        emit MinterUpdated(minter, newMinter);
        minter = newMinter;
    }

    function mint(address to, uint256 amount) external onlyMinter {
        _mint(to, amount);
    }
}
