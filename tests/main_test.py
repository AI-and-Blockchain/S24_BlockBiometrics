import time
import pytest
from brownie import BlockBiometrics, Oracle, accounts, network

@pytest.fixture
def deploy():
    # Deploy the contract
    deployer = accounts[0]
    contract = BlockBiometrics.deploy({'from': deployer})
    oracle = Oracle.deploy({'from': deployer})
    owner = contract.owner()
    contract.setOracle(oracle.address)
    print("owner: " + owner)
    print("Contract deployed at:", contract.address)
    print("Oracle deployed at:", oracle.address)
    return contract

def test1(deploy):
    # Deploy the contract
    contract = deploy
    owner = contract.owner()
    assert(owner == accounts[0])
def test2(deploy):
    contract = deploy
    sender = accounts[1]
    assert(contract.getIsRegistered({'from': sender}) == False)
    contract.register({'from': sender})
    assert(contract.getIsRegistered({'from': sender}) == True)
def test3(deploy):
    contract = deploy
    sender = accounts[1]
    contract.register({'from': sender})
    contract.requestAccess({'from': sender})
    id = contract.getRequestID({'from': sender})
    assert(contract.getFromRequestId(id) == sender)
def test4(deploy):
    contract = deploy
    owner = contract.owner()
    sender = accounts[1]
    contract.register({'from': sender})
    contract.requestAccess({'from': sender})
    id = contract.getRequestID({'from': sender})
    assert(contract.getAccess({'from': sender}) == False)
    contract.receiveConfirmation(id, "", {'from': owner})
    assert(contract.getAccess({'from': sender}) == True)
    
def test5(deploy):
    contract = deploy
    owner = contract.owner()
    sender = accounts[1]
    contract.register({'from': sender})
    contract.requestAccess({'from': sender})
    id = contract.getRequestID({'from': sender})
    contract.receiveConfirmation(id, "", {'from': owner})
    assert(contract.getAccess({'from': sender}) == True)
    contract.revokeAccess(sender, {'from': owner})
    assert(contract.getAccess({'from': sender}) == False)
def test6(deploy):
    contract = deploy
    sender = accounts[1]
    errorthrown = False
    try:
        contract.requestAccess({'from': sender})
    except:
        errorthrown = True
    assert(errorthrown)
def test7(deploy):
    contract = deploy
    owner = contract.owner()
    sender = accounts[1]
    contract.register({'from': sender})
    errorthrown = False
    try:
        contract.revokeAccess(sender, {'from': owner})
    except:
        errorthrown = True
    assert(errorthrown)
        
    



