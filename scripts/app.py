from flask import Flask, request, jsonify
from brownie import BlockBiometrics, Oracle, accounts

app = Flask(__name__)
 # Deploy the contract
deployer = accounts[0]
contract = None
oracle = None
# contract = BlockBiometrics.deploy({'from': deployer})


@app.route('/deployed', methods=['GET'])
def contract_deployed():
    return jsonify({'message': contract != None})

@app.route('/deploy', methods=['GET'])
def deploy_contract():
    global contract
    global oracle
    contract = BlockBiometrics.deploy({'from': accounts[0]})
    oracle = Oracle.deploy({'from': deployer})
    owner = contract.owner()
    contract.setOracle(oracle.address)

    return jsonify({'message': 'Block biometrics has been deployed'})

@app.route('/registered', methods=['GET'])
def visitor_registered():
    return jsonify({'message': contract.getIsRegistered({'from': accounts[1]})})

@app.route('/register', methods=['GET'])
def register_visitor():
    sender_address = accounts[1]
    contract.register({'from': sender_address})
    return jsonify({'message': 'Visitor registered successfully'})

@app.route('/request', methods=['GET'])
def request_access():
    sender_address = accounts[1]
    contract.requestAccess({'from': sender_address})
    return jsonify({'message': 'user has requested access'})

@app.route('/requested', methods=["GET"])
def access_requested():
    sender_address = accounts[1]
    return jsonify({'message': contract.getRequestID({'from': accounts[1]})})

@app.route('/access', methods=["GET"])
def access_home():
    sender_address = accounts[1]
    oracle.returnResult("hi", {'from': accounts[0]})
    contract.accessHome({'from': accounts[1]})
    return jsonify({'message': 'user has access'})
    
app.run(debug=True)
