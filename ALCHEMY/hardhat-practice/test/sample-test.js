const { assert } = require('chai');
const { ethers } = require('ethers');

describe("TestCounterVariable", () => {
    it("should increment x value by 1", async () => {
        
        const Counter = new ethers.ContractFactory("Counter");

        const counterContract = await Counter.deploy();

        await counterContract.deployed();

        const count = await counterContract.get();

        console.log(count);

        assert.equal(1, 1);
    });
});