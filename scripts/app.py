from flask import Flask, request, jsonify
# from brownie import BlockBiometrics, accounts

app = Flask(__name__)
 # Deploy the contract
# deployer = accounts[0]
# contract = BlockBiometrics.deploy({'from': deployer})


# @app.route('/register', methods=['POST'])
# def register_visitor():
#     sender_address = request.json['sender_address']
#     contract.register({'from': sender_address})
#     return jsonify({'message': 'Visitor registered successfully'})

# @app.route('/request-access', methods=['POST'])
# def request_access():
#     sender_address = request.json['sender_address']
#     contract.requestAccess({'from': sender_address})
#     return jsonify({'message': 'Access requested successfully'})

# @app.route('/authenticate-request', methods=['POST'])
# def authenticate_request():
#     sender_address = request.json['sender_address']
#     contract.authenticateRequest({'from': sender_address})
#     return jsonify({'message': 'Request authenticated'})

@app.route('/access-home', methods=['GET'])
def access_home():
    # sender_address = deployer
    # result = contract.accessHome({'from': sender_address})
    # return 'hi'
    return jsonify({'message': "hi"})
    
app.run(debug=True)
