const { ethers } = require('ethers');

const SCENT_ABI = [
  'function mint(address to, uint256 amount) external',
  'function decimals() view returns (uint8)',
];

let provider;
let signer;
let contract;
let decimalsCache;

function isRelayConfigured() {
  return Boolean(
    process.env.RPC_URL &&
      process.env.RELAYER_PRIVATE_KEY &&
      process.env.SCENT_CONTRACT_ADDRESS
  );
}

function getContract() {
  if (!isRelayConfigured()) {
    const error = new Error(
      'Relay not configured. Set RPC_URL, RELAYER_PRIVATE_KEY, and SCENT_CONTRACT_ADDRESS.'
    );
    error.statusCode = 500;
    throw error;
  }

  if (!provider) {
    provider = new ethers.JsonRpcProvider(process.env.RPC_URL, Number(process.env.CHAIN_ID || 8453));
    signer = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, provider);
    contract = new ethers.Contract(process.env.SCENT_CONTRACT_ADDRESS, SCENT_ABI, signer);
  }

  return contract;
}

async function getTokenDecimals() {
  if (decimalsCache !== undefined) return decimalsCache;
  const c = getContract();
  decimalsCache = Number(await c.decimals());
  return decimalsCache;
}

async function mintToWallet(walletAddress, amountCents) {
  const c = getContract();
  const decimals = await getTokenDecimals();

  // 1 SCENT onchain = 1 cent in offchain ledger.
  const amount = ethers.parseUnits(String(amountCents), decimals);
  const tx = await c.mint(walletAddress, amount);
  const receipt = await tx.wait();

  return {
    hash: tx.hash,
    blockNumber: receipt.blockNumber,
  };
}

module.exports = {
  isRelayConfigured,
  mintToWallet,
};
