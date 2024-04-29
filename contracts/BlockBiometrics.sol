//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Oracle.sol";

struct Request {
    address sender;
    uint256 authenticationRequestId;
    uint256 requestTime;
    string result;
}

contract BlockBiometrics {
    //using SafeMath for uint256;

    struct Visitor {
        bool isRegistered;
        bool hasAccess;
        mapping(uint256 => Request) requests;
    }

    address public owner;
    Oracle public oracle;
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
    
    constructor() {
        owner = msg.sender;
        oracle = new Oracle(owner);
    }

    function setOracle(Oracle _oracle) public onlyOwner() {
        oracle = _oracle;
    }

    function getRequest(uint256 id) public view returns (Request memory) {
        require(id <= authenticationRequestCounter, "ID is invalid");
        address visitor = authenticationRequests[id];
        return visitors[visitor].requests[id];
    }

    function register() external notRegistered {
        visitors[msg.sender].isRegistered = true;
        emit VisitorRegistered(msg.sender);
    }

    function authenticate() external registered hasNoAccess {
        // Construct a request
        uint256 requestId = generateRequestId();
        visitors[msg.sender].requests[requestId] = Request(
            address(this), requestId, block.timestamp, ""
        );

        // Store request ID
        authenticationRequests[requestId] = msg.sender;

        // Send request to the oracle
        (oracle).makeRequest(visitors[msg.sender].requests[requestId]);

        // Emit event
        emit AccessRequested(msg.sender, requestId); // Emit event with request ID
    }


    function receiveResponse(uint256 requestId, string memory result) external {
        // Get visitor address from request ID and make sure the ID and visitor is valid
        address visitor = authenticationRequests[requestId]; 
        require(visitor != address(0), "Invalid request ID");
        require(visitors[visitor].isRegistered, "Visitor is not registered");

        // Get the visitors response
        visitors[visitor].requests[requestId].result = result;

        // Visitor now has access
        visitors[visitor].hasAccess = true;
        emit AccessGranted(visitor);
    }

    function revokeAccess(address visitor) external onlyOwner {
        require(visitors[visitor].hasAccess, "Visitor does not have access to revoke");
        visitors[visitor].hasAccess = false;
        emit AccessRevoked(visitor);
    }

    function accessHome() external view returns (bool) {
        require(visitors[msg.sender].hasAccess, "Visitor does not have access");
        return true;
    }

    // Function to generate unique request ID
    function generateRequestId() private returns (uint256) {
        authenticationRequestCounter = authenticationRequestCounter + 1;
        return authenticationRequestCounter;
    }
}
