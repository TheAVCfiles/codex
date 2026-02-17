const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with', deployer.address);

  const Stage = await hre.ethers.getContractFactory('Stagecoin');
  const stage = await Stage.deploy('Stagecoin', 'STAGE', deployer.address, deployer.address, 200);
  await stage.deployed();
  console.log('Stagecoin:', stage.address);

  const Scent = await hre.ethers.getContractFactory('SentientCents');
  const scent = await Scent.deploy('Sentient Cents', 'SCENT', deployer.address, deployer.address, 100);
  await scent.deployed();
  console.log('SentientCents:', scent.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
