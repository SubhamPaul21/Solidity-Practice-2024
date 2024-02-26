// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.24;

contract Owned {
    address owner;
    // Contract constructor to set owner on contact creation transaction
    constructor() {
        owner = msg.sender;
    }
    // Access control modifier
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
}

contract Mortal is Owned {
    // Contract Destuctor
    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
}

contract Faucet is Mortal {
    // Give out ether to anyone who asks
    function withdraw(uint withdraw_amount) public {
        // Limit withdrawal amount
        require(withdraw_amount <= 0.1 ether);
        // Send the amount to the address that requested it.
        msg.sender.transfer(withdraw_amount);
    }
    // Accept any incoming amount
    receive() external payable {}
}