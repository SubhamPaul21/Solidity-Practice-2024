//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Faucet {
    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function withdraw(uint256 _amount) public payable {
        // Users can only withdraw 0.1 ETH at a time
        require(_amount <= 0.1 ether);
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Failed to send Ether");
    }

    function withdrawAll() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Failed to withdraw all Ether");
    }

    function destroyFaucet() public onlyOwner {
        selfdestruct(owner);
    }
}
