//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract BlockBiometrics {
    //using SafeMath for uint256;

    struct Visitor {
        bool isRegistered;
        bool hasAccess;
        uint256 authenticationRequestId; // ID of the authentication request
        uint256 requestTime; // Time of the authentication request
    }

    address public owner;
    mapping(address => Visitor) public visitors;
    mapping(uint256 => address) public authenticationRequests; // Mapping from request ID to visitor address

    uint256 private authenticationRequestCounter; // Counter for generating unique authentication request IDs
    uint256 public constant timeoutDuration = 1 hours; // Timeout duration (1 hour)

    event VisitorRegistered(address visitor);
    event AccessRequested(address visitor, uint256 requestId); // Include request ID in event
    event AuthenticateRequest(address visitor, uint256 requestId); // Include request ID in event
    event AccessGranted(address visitor);
    event AccessRevoked(address visitor);
    event RequestTimeout(uint256 requestId);

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
    function getIsRegistered() view public returns (bool) {
        return visitors[msg.sender].isRegistered;
    }
    function getRequestID() view public returns (uint256) {
        return visitors[msg.sender].authenticationRequestId;
    }
    function getFromRequestId(uint256 id) view public returns (address) {
        return authenticationRequests[id];
    }
    function getAccess() view public returns (bool) {
        return visitors[msg.sender].hasAccess;
    }
    constructor() {
        owner = msg.sender;
    }

    function register() external notRegistered {
        visitors[msg.sender].isRegistered = true;
        emit VisitorRegistered(msg.sender);
    }

    function requestAccess() external registered hasNoAccess {
        uint256 requestId = generateRequestId();
        visitors[msg.sender].authenticationRequestId = requestId; // Link request ID to visitor
        visitors[msg.sender].requestTime = block.timestamp; // Record request time
        authenticationRequests[requestId] = msg.sender; // Store request ID
        emit AccessRequested(msg.sender, requestId); // Emit event with request ID
    }

    function authenticateRequest() external registered hasNoAccess {
        uint256 requestId = generateRequestId();
        visitors[msg.sender].authenticationRequestId = requestId; // Link request ID to visitor
        visitors[msg.sender].requestTime = block.timestamp; // Record request time
        authenticationRequests[requestId] = msg.sender; // Store request ID
        emit AuthenticateRequest(msg.sender, requestId); // Emit event with request ID
    }

    function receiveConfirmation(uint256 requestId, string memory result) external onlyOwner {
        address visitor = authenticationRequests[requestId]; // Get visitor address from request ID
        require(visitors[visitor].isRegistered, "Visitor is not registered");
        require(visitors[visitor].authenticationRequestId == requestId, "Invalid request ID");
        // This is the fallback
        require(block.timestamp - visitors[visitor].requestTime <= timeoutDuration, "Request timed out");
        // Implement logic to receive confirmation from the oracle
        // For demonstration purposes, let's assume the oracle confirms access for the visitor
        // Replace this with the actual oracle integration logic
        // For simplicity, we'll just emit an event here
        emit AccessGranted(visitor);
        visitors[visitor].hasAccess = true;
    }

    function revokeAccess(address visitor) external onlyOwner {
        require(visitors[visitor].hasAccess, "Visitor does not have access to revoke");
        visitors[visitor].hasAccess = false;
        emit AccessRevoked(visitor);
    }

    function accessHome() external view returns (string memory) {
        require(visitors[msg.sender].hasAccess, "Visitor does not have access");
        return "Home access granted";
    }

    // Function to generate unique request ID
    function generateRequestId() private returns (uint256) {
        authenticationRequestCounter = authenticationRequestCounter + 1;
        return authenticationRequestCounter;
    }
}
contract Oracle {
    address public owner;
    string public request;
    string public result;
    address public sender;
    uint256 public id;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }
    
    function makeRequest(string memory _request, uint256 sender_id) external{
        request = _request;
        sender = msg.sender;
        id = sender_id;
    }
    
    function getRequest() public view onlyOwner returns (string memory) {
        return request;
    }
    
    function returnResult(string memory _result) public onlyOwner {
        result = _result;
        // call original_contract method
        (BlockBiometrics)(sender).receiveConfirmation(id, result);
    }
}
