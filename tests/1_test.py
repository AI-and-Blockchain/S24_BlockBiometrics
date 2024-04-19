import time
import pytest
from brownie import BlockBiometrics, accounts, network

@pytest.fixture
def deploy():
    deployer = accounts[0]
    return BlockBiometrics.deploy({'from': deployer})

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
    contract.receiveConfirmation(id, {'from': owner})
    assert(contract.getAccess({'from': sender}) == True)
    
def test5(deploy):
    contract = deploy
    owner = contract.owner()
    sender = accounts[1]
    contract.register({'from': sender})
    contract.requestAccess({'from': sender})
    id = contract.getRequestID({'from': sender})
    contract.receiveConfirmation(id, {'from': owner})
    assert(contract.getAccess({'from': sender}) == True)
    contract.revokeAccess(sender, {'from': owner})
    assert(contract.getAccess({'from': sender}) == False)



