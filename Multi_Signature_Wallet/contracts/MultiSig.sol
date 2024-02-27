// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract MultiSig {
    // variable to store a list of this wallet owner addresses
    address[] public owners;
    // variable to store the number of confirmation required to execute a transaction
    uint256 public required;
    // struct to store the Transaction information
    struct Transaction {
        address to;
        uint256 value;
        bool executed;
        bytes data;
    }
    // variable to store the transaction count
    uint256 public transactionCount;
    // mapping to store the transactions with their ID
    mapping(uint256 => Transaction) public transactions;
    // nested mapping to store which address has confirmed a particular transaction
    mapping(uint256 => mapping(address => bool)) public confirmations;
    // mapping to store the number of confirmations for a particular transaction
    mapping(uint256 => uint256) public confirmationCount;

    constructor(address[] memory _owners, uint256 _required) {
        // check owner addresses are sent
        require(_owners.length > 0, "No owner addresses are sent");
        // check number of required confirmations is not zero
        require(_required > 0, "Number of required confirmations is zero");
        // check required is less than or equal to the total number of owner addresses
        require(_required <= _owners.length, "Number of required confirmations is more than the total number of owner addresses");
        owners = _owners;
        required = _required;
    }

    // receive function to allow this multi-sig wallet to accept funds at any time
    receive() external payable {}

    // modifier to check only owners can perform certain actions
    modifier onlyOwners() {
        bool isOwner = false;
        for(uint256 i = 0; i < owners.length; i++) {
            if(owners[i] == msg.sender) {
                isOwner = true;
            }
        }
        require(isOwner == true, "You are not the owner");
        _;
    }

    // function to get the number of confirmations received for a particular transaction
    function getConfirmationsCount(uint256 _transactionID) public view returns(uint256) {
        return confirmationCount[_transactionID];
    }

    // function to check if a transaction is confirmed or not
    function isConfirmed(uint256 _transactionID) public view returns(bool) {
        if(getConfirmationsCount(_transactionID) >= required) {
            return true;
        }
        return false;
    }

    // function to store the transaction into storage
    function addTransaction(address _to, uint256 _value, bytes memory _data) internal returns(uint256) {
        // store the transaction into the mapping
        transactions[transactionCount] = Transaction(_to, _value, false, _data);
        // increment the transaction count by 1 for tracking
        transactionCount += 1;

        // return the current transaction ID before incrementing
        return transactionCount - 1;
    }

    // function to submit a transaction by an owner
    function submitTransaction(address _to, uint256 _value, bytes memory _data) external {
        uint256 transactionID = addTransaction(_to, _value, _data);
        confirmTransaction(transactionID);
    }

    // function to execute a transaction after it's confirmed by required owners
    function executeTransaction(uint256 _transactionID) public {
        // check if transaction confirmed or not
        require(isConfirmed(_transactionID) == true, "The transaction is not yet confirmed");
        // check if transaction is not already executed
        require(transactions[_transactionID].executed == false, "The transaction is already executed");
        (bool sent, ) = payable(transactions[_transactionID].to).call{value: transactions[_transactionID].value}(transactions[_transactionID].data);
        require(sent, "Failed to sent amount");
        // On transfer success, set the transaction's executed flag to true
        transactions[_transactionID].executed = true;
    }

    // function to allow addresses to confirm a transaction
    function confirmTransaction(uint256 _transactionID) public onlyOwners {
        confirmations[_transactionID][msg.sender] = true;
        confirmationCount[_transactionID] += 1;

        // execute transaction if Confirmations Count equals Required Count
        if(isConfirmed(_transactionID) == true) {
            executeTransaction(_transactionID);
        }
    }
}
