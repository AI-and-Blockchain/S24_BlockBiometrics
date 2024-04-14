from flask import Flask, request, jsonify
from brownie import BlockBiometrics

app = Flask(__name__)
contract = BlockBiometrics[0]  # this contract is the first deployed contract

@app.route('/register', methods=['POST'])
def register_visitor():
    sender_address = request.json['sender_address']
    contract.register({'from': sender_address})
    return jsonify({'message': 'Visitor registered successfully'})

@app.route('/request-access', methods=['POST'])
def request_access():
    sender_address = request.json['sender_address']
    contract.requestAccess({'from': sender_address})
    return jsonify({'message': 'Access requested successfully'})

@app.route('/authenticate-request', methods=['POST'])
def authenticate_request():
    sender_address = request.json['sender_address']
    contract.authenticateRequest({'from': sender_address})
    return jsonify({'message': 'Request authenticated'})

@app.route('/access-home', methods=['GET'])
def access_home():
    sender_address = request.json['sender_address']
    result = contract.accessHome({'from': sender_address})
    return jsonify({'message': result})

if __name__ == '__main__':
    app.run(debug=True)
