const { ethers } = require('hardhat');

async function main() {
    const erc721ContractAddress = "0xa6f4025b7c5B5B697F9AAE9277a99b6C5ceD080D";

    const contract = await ethers.getContractAt("SubhamNFT", erc721ContractAddress);

    const mintOutput = await contract.safeMint("< recipient address >", "< token ID >", "< metadata-ipfs > ");

    // const tokenURI = await contract.tokenURI(2);
    console.log("mintOutput:", mintOutput);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })