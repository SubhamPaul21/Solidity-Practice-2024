// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Party {

    // variable to declare the manager of this contract
    address public immutable manager;
    // variable stating the deposit amount to join the part
    uint256 public immutable depositAmount;
    // list of rsvp'ed addresses
    address[] public rsvpList;
    // map of address with their paid status
    mapping(address => bool) public rsvpTracker;

    constructor(uint256 _amount) {
        depositAmount = _amount;
        manager = msg.sender;
    }

    // modifier to check only manager can perform the function
    modifier onlyManager() {
        require(msg.sender == manager, "You are not the manager");
        _;
    }

    // function for users to pay and rsvp their place
    function rsvp() external payable {
        require(msg.value == depositAmount, "Please pay the exact deposit amount to join");
        require(rsvpTracker[msg.sender] == false, "Already Paid");
        rsvpList.push(msg.sender);
        rsvpTracker[msg.sender] = true;
    }

    // function to pay the bill by the manager
    function payBill(address _venue, uint256 _totalBill) external onlyManager {
        uint256 remainingFund = address(this).balance - _totalBill;
        // pay the venue their bill
        (bool sentVenue, ) = payable(_venue).call{value:_totalBill}("");
        require(sentVenue, "Failed to send money to Venue Address");
        // evenly distribute the remaining funds among the members of party
        uint256 refundAmount = remainingFund / (rsvpList.length);
        for(uint256 i = 0; i < rsvpList.length; i++) {
            (bool sentRefund, ) = payable(rsvpList[i]).call{value: refundAmount}("");
            require(sentRefund, "Failed to sent refund evenly");
        }
    }
}