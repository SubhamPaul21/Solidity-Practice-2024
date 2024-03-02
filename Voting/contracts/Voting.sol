// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";

contract Voting {
    enum VoteState {
        NEUTRAL,
        YES,
        NO
    }

    struct Proposal {
        address target;
        bytes data;
        uint yesCount;
        uint noCount;
        mapping(address => VoteState) voteState;
        bool executed;
    }

    Proposal[] public proposals;
    address[] internal members;

    event ProposalCreated(uint256 _proposalID);
    event VoteCast(uint256 _proposalID, address _voter);

    constructor(address[] memory _allowedAddresses) {
        for (uint256 i = 0; i < _allowedAddresses.length; i++) {
            members.push(_allowedAddresses[i]);
        }
        members.push(msg.sender);
    }

    function newProposal(
        address _target,
        bytes calldata _calldata
    ) external onlyMembers {
        Proposal storage proposal = proposals.push();
        proposal.target = _target;
        proposal.data = _calldata;
        emit ProposalCreated(proposals.length - 1);
    }

    function castVote(
        uint256 _proposalID,
        bool _supporting
    ) external onlyMembers {
        Proposal storage proposal = proposals[_proposalID];

        // Remove old votes
        if (proposal.voteState[msg.sender] == VoteState.YES) {
            proposal.yesCount--;
        }

        if (proposal.voteState[msg.sender] == VoteState.NO) {
            proposal.noCount--;
        }

        // Add new vote
        if (_supporting) {
            proposal.yesCount++;
        } else {
            proposal.noCount++;
        }

        proposal.voteState[msg.sender] = _supporting
            ? VoteState.YES
            : VoteState.NO;

        emit VoteCast(_proposalID, msg.sender);

        // Execute Proposal immediately when more than 10 voters have voted YES
        if (proposal.yesCount >= 10) {
            require(proposal.executed == false, "Proposal already executed");
            (bool sent, ) = proposal.target.call(proposal.data);
            require(sent, "Could not send data to target");
        }
    }

    modifier onlyMembers() {
        bool isMember = false;
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == msg.sender) {
                isMember = true;
            }
        }
        require(isMember == true, "You are not a voting member");
        _;
    }
}
