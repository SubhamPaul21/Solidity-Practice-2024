const { ethers } = require('hardhat');
const { assert } = require('chai');

describe('Voting', function () {
    const amount = 250;
    const interface = new ethers.Interface(["function mint(uint) external"]);
    const data = interface.encodeFunctionData("mint", [amount]);
    let contract, owner, member1, member2, nonmember;
    let target = ethers.ZeroAddress;

    describe('Creating New Proposal And Vote', function () {

        before(async () => {
            owner = await ethers.provider.getSigner(0);
            member1 = await ethers.provider.getSigner(1);
            member2 = await ethers.provider.getSigner(2);
            nonmember = await ethers.provider.getSigner(3);

            const Voting = await ethers.getContractFactory("Voting");
            contract = await Voting.deploy([await member1.getAddress(), await member2.getAddress()]);
            await contract.waitForDeployment();
        });

        describe('creating a new proposal from a nonmember', () => {
            it('should revert', async () => {
                let ex;
                try {
                    await contract.connect(nonmember).newProposal(target, data);
                }
                catch (_ex) {
                    ex = _ex;
                }
                assert(ex, "Attempted to create new proposal from a nonmember. Expected this transaction to revert!");
            });
        });

        describe('casting a vote as a nonmember', () => {
            it('should revert', async () => {
                let ex;
                try {
                    await contract.connect(nonmember).castVote(0, true);
                }
                catch (_ex) {
                    ex = _ex;
                }
                assert(ex, "Attempted to create new proposal from a nonmember. Expected this transaction to revert!");
            });
        });
    });
});