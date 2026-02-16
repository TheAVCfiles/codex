const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Stagecoin", function () {
  let stage;
  let owner;
  let minter;
  let burner;
  let alice;
  let bob;
  let royalty;
  let other;

  beforeEach(async function () {
    [owner, minter, burner, alice, bob, royalty, other] = await ethers.getSigners();
    const Stagecoin = await ethers.getContractFactory("Stagecoin");

    stage = await Stagecoin.deploy("Stagecoin", "STG", owner.address, royalty.address, 100);
    await stage.waitForDeployment();

    await stage.connect(owner).grantRole(await stage.MINTER_ROLE(), minter.address);
    await stage.connect(owner).grantRole(await stage.BURNER_ROLE(), burner.address);
  });

  it("Minter can mint and balances update", async function () {
    await stage.connect(minter).mint(alice.address, ethers.parseEther("100"));
    expect(await stage.balanceOf(alice.address)).to.equal(ethers.parseEther("100"));
  });

  it("mintOnRecreation mints and updates streetcred", async function () {
    await stage.connect(minter).mintOnRecreation(alice.address, 5000);

    const expectedMint = (5n + 5n) * 10n ** 18n;
    const expectedCred = 5n * 10n;

    expect(await stage.balanceOf(alice.address)).to.equal(expectedMint);
    expect(await stage.streetcred(alice.address)).to.equal(expectedCred);
  });

  it("Transfer charges royalty and sends correct net", async function () {
    await stage.connect(minter).mint(alice.address, ethers.parseEther("100"));

    const amount = ethers.parseEther("10");
    await stage.connect(alice).transfer(bob.address, amount);

    const fee = (amount * 100n) / 10000n;
    const net = amount - fee;

    expect(await stage.balanceOf(royalty.address)).to.equal(fee);
    expect(await stage.balanceOf(bob.address)).to.equal(net);
  });

  it("Burning works only with BURNER_ROLE", async function () {
    await stage.connect(minter).mint(alice.address, ethers.parseEther("50"));
    await stage.connect(burner).burn(alice.address, ethers.parseEther("10"));
    expect(await stage.balanceOf(alice.address)).to.equal(ethers.parseEther("40"));
  });

  it("Only royalty admin can change royalty", async function () {
    await expect(stage.connect(other).setRoyaltyBasisPoints(200)).to.be.reverted;
    await stage.connect(owner).setRoyaltyBasisPoints(200);
    expect(await stage.royaltyBasisPoints()).to.equal(200);
  });

  it("No royalty when bps is zero", async function () {
    await stage.connect(owner).setRoyaltyBasisPoints(0);
    await stage.connect(minter).mint(alice.address, ethers.parseEther("10"));
    await stage.connect(alice).transfer(bob.address, ethers.parseEther("1"));

    expect(await stage.balanceOf(royalty.address)).to.equal(0);
    expect(await stage.balanceOf(bob.address)).to.equal(ethers.parseEther("1"));
  });
});
