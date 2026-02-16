const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SentientCents", function () {
  let cents;
  let owner;
  let minter;
  let burner;
  let alice;
  let bob;
  let royalty;

  beforeEach(async function () {
    [owner, minter, burner, alice, bob, royalty] = await ethers.getSigners();
    const SentientCents = await ethers.getContractFactory("SentientCents");

    cents = await SentientCents.deploy("SentientCents", "SCT", owner.address, royalty.address, 50);
    await cents.waitForDeployment();

    await cents.connect(owner).grantRole(await cents.MINTER_ROLE(), minter.address);
    await cents.connect(owner).grantRole(await cents.BURNER_ROLE(), burner.address);
  });

  it("decimals is 2", async function () {
    expect(await cents.decimals()).to.equal(2);
  });

  it("autoPushToSource mints role-gated source royalties", async function () {
    await cents.connect(minter).autoPushToSource(alice.address, 9000);
    expect(await cents.balanceOf(alice.address)).to.equal(3000n);
  });

  it("mint and transfer with royalty (2 decimals)", async function () {
    const minted = ethers.parseUnits("100.00", 2);
    await cents.connect(minter).mint(alice.address, minted);
    expect(await cents.balanceOf(alice.address)).to.equal(minted);

    const amount = ethers.parseUnits("10.00", 2);
    await cents.connect(alice).transfer(bob.address, amount);

    const fee = (amount * 50n) / 10000n;
    const net = amount - fee;

    expect(await cents.balanceOf(royalty.address)).to.equal(fee);
    expect(await cents.balanceOf(bob.address)).to.equal(net);
  });

  it("only burner role can burn", async function () {
    const minted = ethers.parseUnits("5.00", 2);
    await cents.connect(minter).mint(alice.address, minted);
    await cents.connect(burner).burn(alice.address, ethers.parseUnits("1.00", 2));

    expect(await cents.balanceOf(alice.address)).to.equal(ethers.parseUnits("4.00", 2));
  });
});
