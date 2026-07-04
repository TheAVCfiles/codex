require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config({ path: '../server/.env' });

const privateKey = process.env.RELAYER_PRIVATE_KEY || '';
const hasValidKey = /^0x[a-fA-F0-9]{64}$/.test(privateKey);
const accounts = hasValidKey ? [privateKey] : [];

module.exports = {
  solidity: '0.8.24',
  networks: {
    base: {
      url: process.env.RPC_URL || 'https://mainnet.base.org',
      accounts,
    },
    arbitrum: {
      url: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
      accounts,
    },
  },
};
