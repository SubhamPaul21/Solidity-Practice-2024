require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_TESTNET_RPC_URL,
      accounts: [process.env.METAMASK_SEPOLIA_TESTNET_PRIVATE_KEY],
    }
  },
  paths: {
    sources: "./ERC721/contracts",
  },
};
