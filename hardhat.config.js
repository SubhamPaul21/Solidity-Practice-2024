require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  paths: {
    sources: "./Multi_Signature_Wallet/contracts",
    tests: "./Multi_Signature_Wallet/test",
  },
};
