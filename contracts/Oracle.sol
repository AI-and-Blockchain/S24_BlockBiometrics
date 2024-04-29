//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BlockBiometrics.sol";

contract Oracle {
    address public owner;
    Request[] public request_queue;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }
    
    function makeRequest(Request memory _request) external{
        require(msg.sender == _request.sender, "The sender in the request body must be the message sender");
        request_queue.push(_request);
    }

    function popRequest() onlyOwner external returns(Request memory) {
        Request memory r = request_queue[request_queue.length-1];
        request_queue.pop();
        return r;
    }
    
    function publishResult(address _sender, uint256 _id, string memory _result) public onlyOwner {
        (BlockBiometrics)(_sender).receiveResponse(_id, _result);
    }
}