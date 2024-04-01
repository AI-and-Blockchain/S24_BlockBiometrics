//SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

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
        ;
    }

    modifier notRegistered() {
        require(!visitors[msg.sender].isRegistered, "Visitor is already registered");
        ;
    }

    modifier registered() {
        require(visitors[msg.sender].isRegistered, "Visitor is not registered");
        ;
    }

    modifier hasNoAccess() {
        require(!visitors[msg.sender].hasAccess, "Visitor already has access");
        ;
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

    // Authenticate Recieve
        // Recieve oracle confirmation and give user access

    // Access home
        // if user is authenticated they can access home
}