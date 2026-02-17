const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Stagecoin', function () {
  it('deploys, mints, and charges royalty on transfer', async function () {
    const [owner, alice, bob] = await ethers.getSigners();

    const Stage = await ethers.getContractFactory('Stagecoin');
    const stage = await Stage.deploy('Stagecoin', 'STAGE', owner.address, owner.address, 100);
    await stage.deployed();

    await stage.connect(owner).mintWithRoyalty(alice.address, ethers.utils.parseEther('100'));
    expect(await stage.balanceOf(alice.address)).to.equal(ethers.utils.parseEther('100'));

    await stage.connect(alice).transfer(bob.address, ethers.utils.parseEther('10'));

    expect(await stage.balanceOf(owner.address)).to.equal(ethers.utils.parseEther('0.1'));
    expect(await stage.balanceOf(bob.address)).to.equal(ethers.utils.parseEther('9.9'));
  });
});
