//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MyContract {
    address owner;
    bool isHappy;
    int signedInteger = 10;

    constructor(address _owner, bool _isHappy) {
        owner = _owner;
        isHappy = _isHappy;
    }

    function displayOwner() external view returns (address) {
        return owner;
    }
}