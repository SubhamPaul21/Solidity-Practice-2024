require('dotenv').config();
const ethers = require('ethers');
const fs = require('fs');

// const countContractABI = [{ "inputs": [], "name": "count", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "dec", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "get", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "inc", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

// create Provider
const provider = new ethers.AlchemyProvider("goerli", process.env.TESTNET_API_KEY_ALCHEMY);

async function main() {
    const countContractFile = fs.readFileSync('D:\\Ethereum Developer Bootcamp\\Solidity-Practice-2024\\ALCHEMY\\hardhat-practice\\artifacts\\contracts\\Counter.sol\\Counter.json');

    const contract = JSON.parse(countContractFile.toString());
    const countContract = new ethers.Contract(
        '0x5F91eCd82b662D645b15Fd7D2e20E5e5701CCB7A',
        contract.abi,
        provider,
    )

    const currentCountValue = await countContract.get();

    console.log(currentCountValue.toString());
}
main();

