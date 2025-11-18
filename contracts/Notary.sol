// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Notary {
    event Notarized(bytes32 indexed docHash, address indexed who, uint256 ts, string cid);

    function notarize(bytes32 docHash, string calldata cid) external {
        emit Notarized(docHash, msg.sender, block.timestamp, cid);
    }
}
