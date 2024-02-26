// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {PriceConverter} from "./PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256;

    // manager of this fund raiser contract
    address public manager;
    // list of funders
    address[] public listOfFunders;
    // mapping of funders to their funded amount
    mapping(address => uint256) public addressToFundedAmount;
    // minimum USD that can be donated
    uint256 public minimumUSD = 5e18;

    constructor() {
        // set the manager to be the address that deployed this contract
        manager = msg.sender;
    }

    // Modifier for checking if the operation is requested by manager or not
    modifier onlyManager() {
        require(
            msg.sender == manager,
            "Only the manager are allowed to call this"
        );
        _;
    }

    // Function to deposit USD to this fund raiser contract
    function fund() public payable {
        require(
            msg.value.getConversionRate() >= minimumUSD,
            "Minimum USD not received"
        );
        listOfFunders.push(msg.sender);
        addressToFundedAmount[msg.sender] += msg.value;
    }

    // Function to only let the manager withdraw all the funds collected in the fund raiser contract
    function withdraw(address fundWithdrawalAddress) public onlyManager {
        (bool sent, ) = payable(fundWithdrawalAddress).call{
            value: address(this).balance
        }("");
        require(sent, "Could not send funds to the withdrawal address");

        // Once fund is withdrawn, reset all the funders funded amount to 0
        for (
            uint256 funderIndex = 0;
            funderIndex < listOfFunders.length;
            funderIndex++
        ) {
            addressToFundedAmount[listOfFunders[funderIndex]] = 0;
        }

        // Reset the list of funders array
        listOfFunders = new address[](0);
    }
}