require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY || '';
const STAGECOIN_ADDRESS = process.env.STAGECOIN_ADDRESS || '';
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '8453', 10);
const PORT = parseInt(process.env.PORT || '3001', 10);
const STRIPE_SECRET = process.env.STRIPE_SECRET || '';

const stripe = STRIPE_SECRET ? require('stripe')(STRIPE_SECRET) : null;

const DB_FILE = path.join(__dirname, 'db.json');
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify({ users: {}, nonces: {}, txs: {}, payments: {} }, null, 2),
  );
}

function readDb() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

const STAGE_ABI = [
  'function mintWithRoyalty(address to, uint256 amount) external',
  'function MINTER_ROLE() view returns (bytes32)',
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
if (!RELAYER_PRIVATE_KEY) {
  console.error('RELAYER_PRIVATE_KEY not provided. Exiting.');
  process.exit(1);
}

const relayerWallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, provider);
const stageContract = new ethers.Contract(STAGECOIN_ADDRESS, STAGE_ABI, relayerWallet);

const DOMAIN = (chainId, contractAddr) => ({
  name: 'StagePort Bridge',
  version: '1',
  chainId,
  verifyingContract: contractAddr,
});

const TYPES = {
  Bridge: [
    { name: 'user', type: 'address' },
    { name: 'amountCents', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'expiry', type: 'uint256' },
    { name: 'paygateId', type: 'string' },
  ],
};

function centsToStageWei(amountCents) {
  const stageUnits = BigInt(Math.floor(amountCents / 100));
  return ethers.parseUnits(stageUnits.toString(), 18);
}

function applyDecayToBalance(user) {
  const now = Date.now();
  const daysInactive = (now - user.lastActivity) / (1000 * 60 * 60 * 24);
  if (daysInactive <= 30) return 0;

  const months = Math.floor(daysInactive / 30);
  let totalDecay = 0;
  for (let i = 0; i < months; i += 1) {
    const decay = Math.floor(user.sentientCents * 0.01);
    if (decay <= 0) break;
    totalDecay += decay;
    user.sentientCents -= decay;
  }
  return totalDecay;
}

app.get('/api/nonce/:wallet', (req, res) => {
  const wallet = (req.params.wallet || '').toLowerCase();
  if (!ethers.isAddress(wallet)) return res.status(400).json({ error: 'invalid wallet' });

  const db = readDb();
  db.nonces[wallet] = (db.nonces[wallet] || 0) + 1;
  writeDb(db);

  return res.json({ nonce: db.nonces[wallet] });
});

app.post('/api/convert', async (req, res) => {
  try {
    const { userAddress, amountCents, nonce, expiry, paygateId, signature } = req.body;
    if (!ethers.isAddress(userAddress)) return res.status(400).json({ error: 'invalid address' });

    const db = readDb();
    const wallet = userAddress.toLowerCase();

    const domain = DOMAIN(CHAIN_ID, STAGECOIN_ADDRESS);
    const message = {
      user: wallet,
      amountCents: amountCents.toString(),
      nonce,
      expiry,
      paygateId: paygateId || '',
    };

    let recovered;
    try {
      recovered = ethers.verifyTypedData(domain, TYPES, message, signature);
    } catch (err) {
      console.error('sig verify err', err);
      return res.status(400).json({ error: 'signature verification failed' });
    }

    if (recovered.toLowerCase() !== wallet) {
      return res.status(400).json({ error: 'signature mismatch' });
    }

    const serverNonce = db.nonces[wallet] || 0;
    if (nonce !== serverNonce) return res.status(409).json({ error: 'nonce mismatch', serverNonce });

    if (Date.now() / 1000 > expiry) return res.status(400).json({ error: 'signature expired' });

    const user = db.users[wallet];
    if (!user) return res.status(400).json({ error: 'user not found' });

    const decay = applyDecayToBalance(user);

    if (paygateId) {
      const payment = db.payments[paygateId];
      if (!payment || payment.status !== 'paid') {
        return res.status(402).json({ error: 'payment required' });
      }
    }

    if (user.sentientCents < amountCents) {
      return res.status(402).json({ error: 'insufficient SentientCents balance' });
    }

    user.sentientCents -= amountCents;
    user.lastActivity = Date.now();
    db.nonces[wallet] = serverNonce + 1;
    writeDb(db);

    const stageAmount = centsToStageWei(amountCents);
    const tx = await stageContract.mintWithRoyalty(wallet, stageAmount);
    const receipt = await tx.wait();

    db.txs[receipt.hash] = {
      type: 'bridgeMint',
      to: wallet,
      amountCents,
      stageAmount: stageAmount.toString(),
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      timestamp: Date.now(),
    };
    writeDb(db);

    return res.json({ success: true, txHash: receipt.hash, decayApplied: decay });
  } catch (err) {
    console.error('convert error', err);
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/create-user', (req, res) => {
  const { wallet, initialCents } = req.body;
  if (!wallet || !ethers.isAddress(wallet)) return res.status(400).json({ error: 'invalid wallet' });

  const db = readDb();
  const normalized = wallet.toLowerCase();
  db.users[normalized] = db.users[normalized] || {
    wallet: normalized,
    sentientCents: 0,
    lastActivity: Date.now(),
  };
  db.users[normalized].sentientCents += initialCents || 0;
  writeDb(db);

  return res.json({ ok: true, user: db.users[normalized] });
});

app.post('/webhook/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  if (!stripe) return res.status(400).send('Stripe not configured');

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Stripe webhook error', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const wallet = (session.metadata?.wallet || '').toLowerCase();
    const cents = parseInt(session.metadata?.cents || '0', 10);

    const db = readDb();
    db.payments[session.id] = { status: 'paid', session };

    if (ethers.isAddress(wallet) && cents > 0) {
      db.users[wallet] = db.users[wallet] || { wallet, sentientCents: 0, lastActivity: Date.now() };
      db.users[wallet].sentientCents += cents;
      writeDb(db);
    }
  }

  return res.json({ received: true });
});

app.get('/api/status', (_req, res) => {
  res.json({ relayer: relayerWallet.address, chainId: CHAIN_ID });
});

app.listen(PORT, () => {
  console.log(`Relayer running on ${PORT}`);
});
