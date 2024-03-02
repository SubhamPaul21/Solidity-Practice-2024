const { ethers } = require('hardhat');


async function main() {
    const signer = await ethers.getSigners();
    console.log("Deployed by: ", await signer[0].getAddress());

    const TokenContract = await ethers.getContractFactory('Subham');
    const token = await TokenContract.deploy();

    await token.waitForDeployment();

    console.log("Token Deployed at:", await token.getAddress());
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })