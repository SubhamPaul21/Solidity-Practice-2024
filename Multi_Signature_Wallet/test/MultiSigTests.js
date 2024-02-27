const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('MultiSig', function () {
    let contract;
    let accounts;
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        const MultiSig = await ethers.getContractFactory("MultiSig");
        const owner1 = await accounts[0].getAddress();
        const owner2 = await accounts[1].getAddress();
        const owner3 = await accounts[2].getAddress();
        contract = await MultiSig.deploy([owner1, owner2, owner3], 1);
        await contract.waitForDeployment();
    });

    describe('storing ERC20 tokens', function () {
        const initialBalance = 10000;
        let token;
        let tokenAddress;

        beforeEach(async () => {
            const myERC20Token = await ethers.getContractFactory("MyToken");
            token = await myERC20Token.deploy(initialBalance);
            tokenAddress = await token.getAddress();
            await token.waitForDeployment();
            await token.transfer(contract.getAddress(), initialBalance);
        });

        it('should store the balance', async () => {
            const balance = await token.balanceOf(contract.getAddress());
            assert.equal(balance, initialBalance);
        });

        describe('executing an ERC20 transaction', function () {
            beforeEach(async () => {
                const data = token.interface.encodeFunctionData("transfer", [accounts[2], initialBalance]);
                await contract.submitTransaction(tokenAddress, 0, data);
            });

            it('should have removed the contract balance', async () => {
                const balance = await token.balanceOf(contract.getAddress());
                assert.equal(balance, 0);
            });

            it('should have moved the balance to the destination', async () => {
                const balance = await token.balanceOf(accounts[2]);
                assert.equal(balance, initialBalance);
            });
        });
    });

    describe('storing ether', function () {
        const oneEther = ethers.parseEther("1");
        beforeEach(async () => {
            (await ethers.provider.getSigner(0)).sendTransaction({ to: contract.getAddress(), value: oneEther });
        });

        it('should store the balance', async () => {
            const balance = await ethers.provider.getBalance(contract.getAddress());
            assert.equal(balance, oneEther);
        });

        describe('executing the ether transaction', function () {
            let balanceBefore;

            beforeEach(async () => {
                balanceBefore = await ethers.provider.getBalance(accounts[1]);
                await contract.submitTransaction(accounts[1], oneEther, "0x");
            });

            it('should have removed the contract balance', async () => {
                const balance = await ethers.provider.getBalance(await contract.getAddress());
                assert.equal(balance, 0);
            });

            it('should have moved the balance to the destination', async () => {
                const balance = await ethers.provider.getBalance(accounts[1]);
                assert.equal(balance - balanceBefore, oneEther);
            });
        });
    });
});
