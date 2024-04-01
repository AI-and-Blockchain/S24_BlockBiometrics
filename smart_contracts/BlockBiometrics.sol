//SPDX-License-Identifier: MIT
pragma solidity 0.8.22;
  
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

        // Authenticate Request
    // Make a request to oracle
    function authenticateRequest() external registered hasNoAccess {
        // Implementation of making a request to oracle goes here
        // For simplicity, we emit an event indicating authentication request
        emit AuthenticateRequest(msg.sender);
    }

    event AuthenticateRequest(address visitor);

    // Authenticate Receive
    // Receive oracle confirmation and give user access
    function receiveConfirmation() external onlyOwner {
        // Implementation of receiving oracle confirmation and granting access goes here
        // For simplicity, we directly grant access to the visitor who made the request
        visitors[msg.sender].hasAccess = true;
        emit AccessGranted(msg.sender);
    }

    event AccessGranted(address visitor);

    // Access home
    // if user is authenticated they can access home
    function accessHome() external view returns (string memory) {
        require(visitors[msg.sender].hasAccess, "Visitor does not have access");
        return "Home access granted";
    }


}