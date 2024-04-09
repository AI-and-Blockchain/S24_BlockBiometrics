//SPDX-License-Identifier: MIT
  
pragma solidity ^0.8.0;
import {FunctionsClient} from "@chainlink/contracts@0.8.0/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts@0.8.0/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts@0.8.0/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BlockBiometrics is FunctionsClient{
    using FunctionsRequest for FunctionsRequest.Request;

    //hardcoded for sepola
    address router = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;
    //Callback gas limit
    uint32 gasLimit = 300000;
    // donID - Hardcoded for sepola
    bytes32 donID = 0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;

    // State variable to store the returned character information
    string character;
    uint64 subscriptionId;

    // State variables to store the last request ID, response, and error
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    // Custom error type
    error UnexpectedRequestID(bytes32 requestId);

    // Event to log responses
    event Response(
        bytes32 indexed requestId,
        string character,
        bytes response,
        bytes err
    );
    // JavaScript source code
    // Fetch character name from pokemon API.
    string source =
        "const pokiURL = 'https://pokeapi.co/api/v2/pokemon';"
        "const pokemonCharacter = args[0];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `${pokiURL}/${pokemonCharacter}`,"
        "method: 'GET',"
        "});"
        "if (apiResponse.error) {"
        "throw Error('Request failed');"
        "}"
        "const reqData = apiResponse.data;"
        "const myData = {"
        "base_experience: reqData.base_experience,"
        "weight: reqData.weight/10,"
        "height: reqData.height/10,"
        "};"
        "return Functions.encodeString(JSON.stringify(myData));";


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
    /**
    * @notice Initializes the contract with the Chainlink router address and sets the contract owner
    */
    constructor(uint64 id) FunctionsClient(router) {
        subscriptionId = id;
        owner = msg.sender;

    }
    function sendRequest(
        string[] memory args
    ) internal returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source); // Initialize the request with JS code
        if (args.length > 0) req.setArgs(args); // Set the arguments for the request
        
        // Send the request and store the request ID
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        return s_lastRequestId;
    }
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId); // Check if request IDs match
        }
        // Update the contract's state variables with the response and any errors
        s_lastResponse = response;
        character = string(response);
        s_lastError = err;

        // Emit an event to log the response
        emit Response(requestId, character, s_lastResponse, s_lastError);
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
    function authenticateRequest(string[] memory args) external registered hasNoAccess {
        // Implementation of making a request to oracle goes here
        // For simplicity, we emit an event indicating authentication request
        sendRequest(args);
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