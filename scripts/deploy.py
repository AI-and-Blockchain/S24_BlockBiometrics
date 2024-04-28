import time
from brownie import BlockBiometrics, Oracle, accounts

def main():
    # Parties
    homeowner = accounts[0]
    visitor = accounts[0]

    # Deploy the contract
    contract = BlockBiometrics.deploy({'from': homeowner})

    # Retrieve the oracle contract
    oracle = Oracle.at(contract.oracle())

    # Register new user
    contract.register({'from': visitor})

    # Authenticate
    contract.authenticate({'from': visitor})

    # Oracle processes request
    print(oracle.request_queue(0, {'from': homeowner}))
    request = oracle.popRequest({'from': homeowner}).return_value
    sender, id, _, _ = request
    response = "accepted"
    oracle.publishResult(sender, id, response, {'from': homeowner})

    # Access home
    print(contract.getRequest(id, {'from': visitor}))
    print(contract.accessHome({'from': visitor}))

    # Sleep
    time.sleep(1)
