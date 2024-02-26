// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Escrow {
	// Setting these state variables as immutable to declare only once and also reduce gas consumption
	address public immutable arbiter;
	address public immutable beneficiary;
	address public immutable depositor;
	// boolean state variable to check if the deployed escrow is already approved
	bool public isApproved;
	// Event to keep track of the approved balance
	event Approved(uint256 _balance);

	constructor(address _arbiter, address _beneficiary) payable {
		arbiter = _arbiter;
		beneficiary = _beneficiary;
		depositor = msg.sender;
	}

	modifier onlyArbiter() {
		require(msg.sender == arbiter, "You are not the Arbiter");
		_;
	}

	function approve() external onlyArbiter {
		uint256 amount = address(this).balance;
		(bool sent, ) = payable(beneficiary).call{value: amount}("");
 		require(sent, "Failed to send Ether to Beneficiary");
		emit Approved(amount);
		isApproved = true;
	}
}
