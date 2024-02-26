const { expect, assert } = require('chai');
const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers')

describe('Party', () => {
    let friends, venue, contract, initialVenueBalance, manager;
    let previousBalances = [];
    beforeEach(async () => {
        const signers = await ethers.getSigners();
        manager = signers[0];
        friends = signers.slice(1, 5);
        venue = signers[6];

        const Party = await ethers.getContractFactory('Party');
        contract = await Party.deploy(ethers.parseEther("2"));
        for (let i = 0; i < friends.length; i++) {
            await contract.connect(friends[i]).rsvp({
                value: ethers.parseEther("2"),
            });
            previousBalances[i] = await ethers.provider.getBalance(friends[i].getAddress());
        }
        initialVenueBalance = await ethers.provider.getBalance(venue.getAddress());
    });

    describe('for address of manager', () => {
        it('should pay the bill and distribute refund evenly', async () => {
            await expect(contract.payBill(venue.getAddress(), ethers.parseEther("8"))).to.not.be.reverted;
        })
    })

    describe('for address other than manager', () => {
        it('should revert the transaction', async () => {
            await expect(contract.connect(friends[2]).payBill(venue.getAddress(), ethers.parseEther("8"))).to.be.reverted;
        })
    })

    describe('for an eight ether bill', () => {
        const bill = ethers.parseEther("8");
        beforeEach(async () => {
            await contract.payBill(venue.getAddress(), bill);
        });

        it('should pay the bill', async () => {
            const balance = await ethers.provider.getBalance(venue.getAddress());
            expect(balance).to.eq(initialVenueBalance + bill);
            // assert.equal(balance, initialVenueBalance + bill);
        });

        it('should refund nothing', async () => {
            for (let i = 0; i < 4; i++) {
                const balance = await ethers.provider.getBalance(friends[i].getAddress());
                expect(balance).to.eq(previousBalances[i]);
                // assert.equal(balance.toString(), previousBalances[i].toString());
            }
        });
    });

    describe('for a four ether bill', async () => {
        const bill = ethers.parseEther("4");
        beforeEach(async () => {
            await contract.payBill(venue.getAddress(), bill);
        });

        it('should pay the bill', async () => {
            const balance = await ethers.provider.getBalance(venue.getAddress());
            expect(balance).to.eq(initialVenueBalance + bill);
            // assert.equal(balance, initialVenueBalance + bill);
        });

        it('should only have cost one ether each', async () => {
            for (let i = 0; i < 4; i++) {
                const balance = await ethers.provider.getBalance(friends[i].getAddress());
                const expected = previousBalances[i] + ethers.parseEther("1");
                expect(balance).to.eq(expected);
                // assert.equal(balance, expected);
            }
        });
    });

    describe('for a two ether bill', async () => {
        const bill = ethers.parseEther("2");
        beforeEach(async () => {
            await contract.payBill(venue.getAddress(), bill);
        });

        it('should pay the bill', async () => {
            const balance = await ethers.provider.getBalance(venue.getAddress());
            expect(balance).to.eq(initialVenueBalance + bill);
            // assert.equal(balance.toString(), initialVenueBalance.add(bill));
        });

        it('should only have cost .5 ether each', async () => {
            for (let i = 0; i < 4; i++) {
                const balance = await ethers.provider.getBalance(friends[i].getAddress());
                const expected = previousBalances[i] + ethers.parseEther("1.5");
                expect(balance).to.eq(expected);
                // assert.equal(balance.toString(), expected);
            }
        });
    });
});
