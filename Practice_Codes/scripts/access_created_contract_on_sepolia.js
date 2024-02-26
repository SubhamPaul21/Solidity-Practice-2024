require('dotenv').config();
const ethers = require('ethers');

const countContractABI = [
    {
        "inputs": [],
        "name": "count",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "dec",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "get",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "inc",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

// create Provider
const provider = new ethers.AlchemyProvider("sepolia", process.env.TESTNET_API_KEY_ALCHEMY);

const wallet = new ethers.Wallet(process.env.METAMASK_SEPOLIA_TESTNET_PRIVATE_KEY, provider);

async function main() {
    const countContract = new ethers.Contract(
        '0x41bd4A64d5CB45216314fA6343561B7B5EcCFD53',
        countContractABI,
        wallet,
    )

    let currentCountValue = await countContract.get();

    console.log(currentCountValue.toString());
}

console.log("Hello!");
main();