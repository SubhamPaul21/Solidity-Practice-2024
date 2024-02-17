const hre = require("hardhat");

async function main() {
  try {
    const counter = await hre.ethers.deployContract("Counter");
    await counter.waitForDeployment();
    const deployedAddress = await counter.getAddress();

    console.log(`Contract Deployed on Address: ${deployedAddress}`);

  } catch (error) {
    console.log(error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
