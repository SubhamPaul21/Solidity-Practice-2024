const { ethers } = require('hardhat');

async function main() {
    const contract = await ethers.getContractFactory("SubhamNFT");
    const token = await contract.deploy("0xF3aa994ba179bf34FF9AcEC8c0F2cBDc027B2f49");
    await token.waitForDeployment();

    console.log("ERC721 Token Deployed at: ", await token.getAddress());
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })