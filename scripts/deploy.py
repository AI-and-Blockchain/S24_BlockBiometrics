import time
from brownie import BlockBiometrics, Oracle, accounts, network

def main():
    # Deploy the contract
    deployer = accounts[0]
    contract = BlockBiometrics.deploy({'from': deployer})
    oracle = Oracle.deploy({'from': deployer})
    owner = contract.owner()
    contract.setOracle(oracle.address)
    print("owner: " + owner)
    print("Contract deployed at:", contract.address)
    print("Oracle deployed at:", oracle.address)
    time.sleep(1)
