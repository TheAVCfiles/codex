const Stripe = require('stripe');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

function ensureStripe() {
  if (!stripe) {
    const error = new Error('Stripe is not configured. Set STRIPE_SECRET_KEY.');
    error.statusCode = 500;
    throw error;
  }
  return stripe;
}

function getCheckoutCreditValue() {
  return Number(process.env.SCENT_CENTS_PER_CHECKOUT || 1000);
}

async function createCheckoutSession({ email, successUrl, cancelUrl }) {
  const client = ensureStripe();
  const priceId = process.env.SCENT_PRICE_ID;
  if (!priceId) {
    const error = new Error('SCENT_PRICE_ID is missing.');
    error.statusCode = 500;
    throw error;
  }

  return client.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      scent_cents: String(getCheckoutCreditValue()),
      user_email: email,
    },
  });
}

function constructEvent(payload, signature) {
  const client = ensureStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    const error = new Error('STRIPE_WEBHOOK_SECRET is missing.');
    error.statusCode = 500;
    throw error;
  }

  return client.webhooks.constructEvent(payload, signature, webhookSecret);
}

module.exports = {
  createCheckoutSession,
  constructEvent,
  getCheckoutCreditValue,
};
