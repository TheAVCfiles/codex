require('dotenv').config();

const express = require('express');
const cors = require('cors');

const db = require('./db');
const stripeApi = require('./stripe');
const relay = require('./relay');

const app = express();
const port = Number(process.env.PORT || 4242);
const webOrigin = process.env.WEB_ORIGIN || '*';
const appUrl = process.env.APP_URL || `http://localhost:${port}`;

app.use(cors({ origin: webOrigin === '*' ? true : webOrigin }));
app.use('/web', express.static('../web'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'ballet-bank-server' });
});

app.post('/api/users/upsert', async (req, res, next) => {
  try {
    const { email, walletAddress } = req.body || {};
    if (!email) return res.status(400).json({ error: 'email is required' });

    const user = await db.upsertUserByEmail(email, walletAddress || null);
    res.json({
      id: user.id,
      email: user.email,
      walletAddress: user.wallet_address,
      scentBalanceCents: user.scent_balance_cents,
      tier: user.tier,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/users/:email', async (req, res, next) => {
  try {
    const user = await db.findUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user.id,
      email: user.email,
      walletAddress: user.wallet_address,
      scentBalanceCents: user.scent_balance_cents,
      tier: user.tier,
      conversionLimitsCents: user.conversion_limits_cents,
      lastActivity: user.last_activity,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/paygate/create-checkout', async (req, res, next) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'email is required' });

    await db.upsertUserByEmail(email);

    const session = await stripeApi.createCheckoutSession({
      email,
      successUrl: `${appUrl}/web/index.html?checkout=success`,
      cancelUrl: `${appUrl}/web/index.html?checkout=cancel`,
    });

    res.json({ checkoutUrl: session.url });
  } catch (error) {
    next(error);
  }
});

app.post('/api/paygate/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    if (!signature) return res.status(400).send('Missing stripe-signature header');

    const event = stripeApi.constructEvent(req.body, signature);

    if (await db.hasStripeEvent(event.id)) {
      return res.json({ received: true, duplicate: true });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email = session.customer_email || session.metadata?.user_email;
      const amountFromMetadata = Number(session.metadata?.scent_cents);
      const creditAmount = Number.isFinite(amountFromMetadata)
        ? amountFromMetadata
        : stripeApi.getCheckoutCreditValue();

      if (email) {
        const user = await db.upsertUserByEmail(email);
        await db.creditUser({
          userId: user.id,
          amountCents: creditAmount,
          type: 'paygate_credit',
          reference: session.id,
          metadata: {
            provider: 'stripe',
            payment_status: session.payment_status,
          },
        });
      }
    }

    await db.recordStripeEvent(event.id, event.type);
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

app.post('/api/convert', async (req, res, next) => {
  try {
    const { email, walletAddress, amountCents } = req.body || {};

    if (!email || !walletAddress || !amountCents) {
      return res.status(400).json({ error: 'email, walletAddress, and amountCents are required.' });
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({ error: 'Invalid walletAddress.' });
    }

    const numericAmount = Number(amountCents);
    if (!Number.isInteger(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'amountCents must be a positive integer.' });
    }

    const minAmount = Number(process.env.CONVERSION_MIN_CENTS || 500);
    if (numericAmount < minAmount) {
      return res.status(400).json({ error: `Minimum conversion is ${minAmount} SCENT cents.` });
    }

    const user = await db.upsertUserByEmail(email, walletAddress);
    const usedToday = await db.sumDailyConversions(user.id);
    const dailyLimit = Number(process.env.CONVERSION_DAILY_LIMIT_CENTS || user.conversion_limits_cents || 20000);

    if (usedToday + numericAmount > dailyLimit) {
      return res.status(429).json({
        error: 'Daily conversion limit exceeded.',
        dailyLimit,
        usedToday,
      });
    }

    const conversion = await db.addConversionRequest({
      userId: user.id,
      walletAddress,
      amountCents: numericAmount,
    });

    await db.debitUser({
      userId: user.id,
      amountCents: numericAmount,
      type: 'conversion_debit',
      reference: `conversion:${conversion.id}`,
      metadata: { walletAddress },
    });

    let relayResult = null;
    if (relay.isRelayConfigured()) {
      relayResult = await relay.mintToWallet(walletAddress, numericAmount);
      await db.markConversionSubmitted(conversion.id, relayResult.hash);
    }

    res.json({
      ok: true,
      conversionId: conversion.id,
      relayConfigured: relay.isRelayConfigured(),
      txHash: relayResult?.hash || null,
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.statusCode || 500).json({ error: error.message || 'Unexpected server error' });
});

async function start() {
  await db.initDb();
  app.listen(port, () => {
    console.log(`Ballet Bank server running on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
