const hre = require('hardhat');
const { expect, assert } = require('chai');

describe('Escrow', function () {
  let contract;
  let depositor;
  let beneficiary;
  let arbiter;
  const deposit = hre.ethers.parseEther('1');

  beforeEach(async () => {
    depositor = await hre.ethers.provider.getSigner(0);
    beneficiary = await hre.ethers.provider.getSigner(1);
    arbiter = await hre.ethers.provider.getSigner(2);
    const Escrow = await hre.ethers.getContractFactory('Escrow');
    contract = await Escrow.deploy(
      arbiter.getAddress(),
      beneficiary.getAddress(),
      {
        value: deposit,
      }
    );
    await contract.waitForDeployment();
  });

  it('should declare an arbiter', function () {
    assert(contract.arbiter, "Did not find an arbiter!");
  });

  it('should declare an beneficiary', function () {
    assert(contract.beneficiary, "Did not find a beneficiary!");
  });

  it('should be funded initially', async function () {
    let balance = await hre.ethers.provider.getBalance(contract.getAddress());
    expect(balance).to.eq(deposit);
  });

  describe('After approval from address other than the arbiter', () => {
    it('should revert', async () => {
      await expect(contract.connect(beneficiary).approve()).to.be.reverted;
    });
  });

  describe('After approval from the arbiter', () => {
    let before;
    beforeEach(async () => {
      before = await hre.ethers.provider.getBalance(beneficiary.getAddress());
      const approveTxn = await contract.connect(arbiter).approve();
      await approveTxn.wait();
    })

    it('should transfer balance to beneficiary', async () => {
      const after = await hre.ethers.provider.getBalance(beneficiary.getAddress());
      expect(after - before).to.eq(deposit);
    });

    it("should set the isApproved state to true", async function () {
      const isApproved = await contract.isApproved();
      assert(isApproved, "Expected isApproved to be true!");
    })
  });
});
