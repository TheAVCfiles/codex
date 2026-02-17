const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying with: ${deployer.address}`);

  const SentientCents = await hre.ethers.getContractFactory('SentientCents');
  const scent = await SentientCents.deploy(deployer.address);
  await scent.waitForDeployment();

  const Stagecoin = await hre.ethers.getContractFactory('Stagecoin');
  const stage = await Stagecoin.deploy(deployer.address);
  await stage.waitForDeployment();

  // Assign minting privileges to deployer by default.
  await (await scent.setRelayer(deployer.address)).wait();
  await (await stage.setMinter(deployer.address)).wait();

  console.log('SentientCents deployed:', await scent.getAddress());
  console.log('Stagecoin deployed:', await stage.getAddress());
  console.log('Set SCENT relayer + STAGE minter to:', deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
