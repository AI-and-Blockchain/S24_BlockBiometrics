import { ethers } from 'ethers';
import fs from 'fs'

var {abi, data } = JSON.parse(fs.readFileSync('HelloWorld2.json', 'utf8'));

// console.log(obj.abi)
// console.log(obj.bytecode)

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");

const interact = async() => {
    const accounts = await provider.listAccounts();
    
    const account = accounts[0].address

    const signer = await provider.getSigner(accounts[1].address);

    const contractFactory = new ethers.ContractFactory(abi, data.bytecode.object, signer);

    const contract = await contractFactory.deploy(); 

    console.log(contract.target)
    return contract.target
}

const interact2 = async(target) => {
    const accounts = await provider.listAccounts();
    const account = accounts[0].address;
    const signer = await provider.getSigner(accounts[1].address);

    let contract = new ethers.Contract(target, abi, signer);

    console.log(contract)

    const res = await contract.functions.sayHelloWorld()

    console.log(res)
}

interact().then(target => interact2(target))
// interact2(target)
// console.log(abi)