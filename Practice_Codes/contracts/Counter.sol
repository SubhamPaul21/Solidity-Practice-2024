// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Counter {
    uint public count;

    // Function to get the current value of the count state variable
    function get() external view returns (uint) {
        return count;
    }

    // Function to increment the value of count state variable by 1
    function inc() external {
        count += 1;
    }

    // Function to decrement the value of count state variable by 1
    function dec() external {
        count -= 1;
    }
}
