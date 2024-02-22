const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { parseEther } = require('ethers');
const hre = require("hardhat");

describe("Faucet", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that Blockchain state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContractAndSetVariables() {

        const Faucet = await hre.ethers.getContractFactory("Faucet");
        const faucet = await Faucet.deploy();

        await faucet.waitForDeployment();

        const [owner, addr1] = await hre.ethers.getSigners();

        console.log(`Signer 1 address: ${owner.address}`);
        console.log(`Signer 2 address: ${addr1.address}`);
        return { faucet, owner, addr1 };
    }

    it("should set the owner correctly", async function () {
        const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

        expect(await faucet.owner()).to.equal(owner.address);
    })

    it("should allow withdrawals lesser or equal to 0.1 ETH", async function () {
        const { faucet } = await loadFixture(deployContractAndSetVariables);

        // Try to withdraw more than 0.1 ETH
        // require will evaluate to false and revert the transaction
        await expect(faucet.withdraw(parseEther("0.1"))).to.not.be.revertedWith("Cannot withdraw more than 0.1 ETH");
    })

    it("should not allow withdrawals above 0.1 ETH", async function () {
        const { faucet } = await loadFixture(deployContractAndSetVariables);

        // Try to withdraw more than 0.1 ETH
        // require will evaluate to false and revert the transaction
        await expect(faucet.withdraw(parseEther("1"))).to.be.revertedWith("Cannot withdraw more than 0.1 ETH");
    })

    it("should only allow owner to call the 'withdrawAll' operation", async function () {
        const { faucet } = await loadFixture(deployContractAndSetVariables);

        await expect(faucet.withdrawAll()).to.not.be.revertedWith("You are not the owner");
    })

    it("should not allow anyone other than owner to call the 'withdrawAll' operation", async function () {
        const { faucet, addr1 } = await loadFixture(deployContractAndSetVariables);

        await expect(faucet.connect(addr1).withdrawAll()).to.be.revertedWith("You are not the owner");
    })
})