// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Switch {
    // variable to store the owner of the contract
    address internal immutable owner;
    // variable to store the recipient of the fund
    address internal immutable recipient;
    // variable to store the time;
    uint256 internal time;

    constructor(address _recipient) payable {
        recipient = _recipient;
        owner = msg.sender;
        time = block.timestamp;
    }

    // modifier to allow some operations to only be done by owner
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    // function to transfer all the contract funds to the recipient address
    function withdraw() external {
        require(block.timestamp > time + 52 weeks, "Failed to withdraw fund before 52 weeks of inactivity");
        (bool sent, ) = payable(recipient).call{value: address(this).balance}("");
        require(sent, "Failed to sent Fund to Recipient");
    }

    // function to restart the period of inactivity
    function ping() external onlyOwner {
        time = block.timestamp;
    }
}