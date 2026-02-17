const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('SentientCents', function () {
  it('has 2 decimals and supports minting', async function () {
    const [owner, alice] = await ethers.getSigners();

    const Scent = await ethers.getContractFactory('SentientCents');
    const scent = await Scent.deploy('Sentient Cents', 'SCENT', owner.address, owner.address, 100);
    await scent.deployed();

    expect(await scent.decimals()).to.equal(2);
    await scent.connect(owner).mint(alice.address, 5000);
    expect(await scent.balanceOf(alice.address)).to.equal(5000);
  });
});
