# interact.py
from brownie import BlockBiometrics, accounts, network

def main():
    # Connect to a network (e.g., Ganache)
    network.connect('development')

    # Load the deployed contract
    contract = BlockBiometrics[0]

    # Interact with the contract
    contract.register({'from': accounts[1]})
    contract.requestAccess({'from': accounts[1]})
    print(contract.accessHome({'from': accounts[1]}))
