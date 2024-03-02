// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Subham is ERC20 {
    uint8 constant _decimals = 18;
    uint256 constant _initial_supply = 1000 * (10 ** _decimals);

    constructor() ERC20("Subham", "SUB") {
        _mint(msg.sender, _initial_supply);
    }
}