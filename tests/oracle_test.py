import pytest
from brownie import Oracle, BlockBiometrics, accounts
from brownie.exceptions import VirtualMachineError

@pytest.fixture(scope="module", autouse=True)
def shared_setup(module_isolation):
    pass

# Testing if deployment occurs
def testDeploy():
    homeowner = accounts[0]
    Oracle.deploy(homeowner, {'from': homeowner})

# Testing if the owner is set correctly
def testOwner():
    homeowner = accounts[0]
    contract = Oracle.deploy(homeowner, {'from': homeowner})

    assert homeowner == contract.owner()
    assert accounts[1] != contract.owner()

# Testing that the request queue starts empty
def testEmptyRequestQueue():
    homeowner = accounts[0]
    contract = Oracle.deploy(homeowner, {'from': homeowner})

    with pytest.raises(VirtualMachineError):
        contract.request_queue(0, {'from': homeowner})

# Testing wether a request made is correctly stored
def testMakeRequest():
    homeowner = accounts[0]
    contract = Oracle.deploy(homeowner, {'from': homeowner})

    request = (homeowner, 1, 1714349438, '')
    contract.makeRequest(request, {'from': homeowner})

    assert contract.request_queue(0, {'from': homeowner}) == request
    with pytest.raises(VirtualMachineError):
        contract.request_queue(1, {'from': homeowner})

# In theory another contract could send requests to this oracle
def testOutsiderMakeRequest():
    homeowner = accounts[0]
    contract = Oracle.deploy(homeowner, {'from': homeowner})

    request = (accounts[1], 1, 1714349438, '')
    contract.makeRequest(request, {'from': accounts[1]})

    assert contract.request_queue(0, {'from': homeowner}) == request

# Testing wether multiple requests are correctly stored
def testMakeMultipleRequests():
    homeowner = accounts[0]
    contract = Oracle.deploy(homeowner, {'from': homeowner})

    for i in range(3):
        request = (homeowner, i+1, 1714349438, '')

        contract.makeRequest(request, {'from': homeowner})
        assert contract.request_queue(i, {'from': homeowner}) == request
        with pytest.raises(VirtualMachineError):
            contract.request_queue(i+1, {'from': homeowner})

def testOutsiderPopRequest():
    homeowner = accounts[0]
    contract = Oracle.deploy(homeowner, {'from': homeowner})

    request = (homeowner, 1, 1714349438, '')
    contract.makeRequest(request, {'from': homeowner})

    with pytest.raises(VirtualMachineError):
        contract.popRequest({'from': accounts[1]})

# Testing whether popped request value matches up
def testPopRequest():
    homeowner = accounts[0]
    contract = Oracle.deploy(homeowner, {'from': homeowner})

    request = (homeowner, 1, 1714349438, '')
    contract.makeRequest(request, {'from': homeowner})

    assert contract.popRequest({'from': homeowner}).return_value == request

    with pytest.raises(VirtualMachineError):
        contract.request_queue(0, {'from': homeowner})

# Testing whether repeated request pops such that size of request queue is 1
def testRepeatedPopRequest():
    homeowner = accounts[0]
    contract = Oracle.deploy(homeowner, {'from': homeowner})

    for i in range(3):
        request = (homeowner, i+1, 1714349438, '')

        contract.makeRequest(request, {'from': homeowner})
        assert contract.request_queue(0, {'from': homeowner}) == request
        with pytest.raises(VirtualMachineError):
            contract.request_queue(1, {'from': homeowner})

        assert contract.popRequest({'from': homeowner}).return_value == request
        with pytest.raises(VirtualMachineError):
            contract.request_queue(0, {'from': homeowner})

# Testing repeated request pops such that a queue of 3 is made and then completely emptied
def testPopMultipleRequests():
    homeowner = accounts[0]
    contract = Oracle.deploy(homeowner, {'from': homeowner})

    for _ in range(2):
        for i in range(3):
            request = (homeowner, i+1, 1714349438, '')
            contract.makeRequest(request, {'from': homeowner})

        for i in range(2, -1, -1):
            request = (homeowner, i+1, 1714349438, '')

            assert contract.popRequest({'from': homeowner}).return_value == request
            with pytest.raises(VirtualMachineError):
                contract.request_queue(i, {'from': homeowner})

# Testing that the publish method can not be called without a blockbiometrics address as the sender
def testNonContractPublishResultFailiure():
    homeowner = accounts[0]
    contract = Oracle.deploy(homeowner, {'from': homeowner})

    with pytest.raises(VirtualMachineError):
        contract.publishResult(homeowner, 1, "accepted", {'from': homeowner})
    with pytest.raises(VirtualMachineError):
        contract.publishResult(contract.address, 1, "accepted", {'from': homeowner})

# Simple test to check that there are no failures in publishing result to a contract
def testPublishResult():
    homeowner = accounts[0]
    visitor = accounts[1]

    contract = BlockBiometrics.deploy({'from': homeowner})
    oracle = Oracle.at(contract.oracle())

    contract.register({'from': visitor})
    contract.authenticate({'from': visitor})

    sender, id, _, _ = oracle.popRequest({'from': homeowner}).return_value
    oracle.publishResult(sender, id, "accepted", {'from': homeowner})

# Test making sure an outsider can't publish a result using the oracle
def testOutsiderPublishResultFailiure():
    homeowner = accounts[0]
    visitor = accounts[1]

    contract = BlockBiometrics.deploy({'from': homeowner})
    oracle = Oracle.at(contract.oracle())

    contract.register({'from': visitor})
    contract.authenticate({'from': visitor})

    sender, id, _, _ = oracle.popRequest({'from': homeowner}).return_value
    with pytest.raises(VirtualMachineError):
        oracle.publishResult(sender, id, "accepted", {'from': visitor})