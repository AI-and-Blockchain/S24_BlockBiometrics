//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockBiometrics {
    struct Visitor {
        bool isRegistered;
        bool hasAccess;
    }

    address public owner;
    mapping(address => Visitor) public visitors;

    event VisitorRegistered(address visitor);
    event AccessRequested(address visitor);
    event AuthenticateRequest(address visitor);
    event AccessGranted(address visitor);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    modifier notRegistered() {
        require(!visitors[msg.sender].isRegistered, "Visitor is already registered");
        _;
    }

    modifier registered() {
        require(visitors[msg.sender].isRegistered, "Visitor is not registered");
        _;
    }

    modifier hasNoAccess() {
        require(!visitors[msg.sender].hasAccess, "Visitor already has access");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function register() external notRegistered {
        visitors[msg.sender].isRegistered = true;
        emit VisitorRegistered(msg.sender);
    }

    function requestAccess() external registered hasNoAccess {
        visitors[msg.sender].hasAccess = true;
        emit AccessRequested(msg.sender);
    }

    function authenticateRequest() external registered hasNoAccess {
        // You can implement the logic for making a request to an oracle here
        emit AuthenticateRequest(msg.sender);
    }

    function receiveConfirmation() external onlyOwner {
        // You can implement the logic for receiving confirmation from the oracle here
        visitors[msg.sender].hasAccess = true;
        emit AccessGranted(msg.sender);
    }

    function accessHome() external view returns (string memory) {
        require(visitors[msg.sender].hasAccess, "Visitor does not have access");
        return "Home access granted";
    }
}
