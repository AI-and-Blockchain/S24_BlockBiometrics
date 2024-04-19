import time
from brownie import BlockBiometrics, accounts, network

def main():
    # Deploy the contract
    deployer = accounts[0]
    contract = BlockBiometrics.deploy({'from': deployer})
    owner = contract.owner()
    print("owener: " + owner)
    print("Contract deployed at:", contract.address)

    contract.register({'from': accounts[1]})
    contract.requestAccess({'from': accounts[1]})
    
    print(contract.accessHome({'from': accounts[1]}))

    time.sleep(1)
