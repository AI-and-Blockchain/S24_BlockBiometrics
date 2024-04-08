# deploy.py
from brownie import BlockBiometrics, accounts, network

def main():
    # Connect to a network (e.g., Ganache)
    network.connect('development')

    # Deploy the contract
    deployer = accounts[0]
    contract = BlockBiometrics.deploy({'from': deployer})

    print("Contract deployed at:", contract.address)
