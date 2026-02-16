const { ethers } = require("hardhat");

async function main() {
  const [deployer, oracle, minter, burner, royaltyAdmin] = await ethers.getSigners();

  console.log("Deployer:", deployer.address);

  const Stagecoin = await ethers.getContractFactory("Stagecoin");
  const stage = await Stagecoin.deploy("Stagecoin", "SC", deployer.address, deployer.address, 0);
  await stage.waitForDeployment();
  console.log("Stagecoin:", await stage.getAddress());

  const SentientCents = await ethers.getContractFactory("SentientCents");
  const scent = await SentientCents.deploy("Sentient Cents", "SCENT", deployer.address, deployer.address, 0);
  await scent.waitForDeployment();
  console.log("SentientCents:", await scent.getAddress());

  await stage.grantRole(await stage.MINTER_ROLE(), minter.address);
  await stage.grantRole(await stage.BURNER_ROLE(), burner.address);
  await stage.grantRole(await stage.ROYALTY_ADMIN_ROLE(), royaltyAdmin.address);

  await scent.grantRole(await scent.MINTER_ROLE(), minter.address);
  await scent.grantRole(await scent.BURNER_ROLE(), burner.address);
  await scent.grantRole(await scent.ROYALTY_ADMIN_ROLE(), royaltyAdmin.address);

  console.log("Roles granted", {
    oracle: oracle.address,
    minter: minter.address,
    burner: burner.address,
    royaltyAdmin: royaltyAdmin.address
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
