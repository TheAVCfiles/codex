const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const minimist = require("minimist");
const Stripe = require("stripe");

const argv = minimist(process.argv.slice(2));

if (!argv.config) {
  console.error("Usage: node scripts/avc-agent.js --config <path-to-config>");
  process.exit(1);
}

const configPath = path.resolve(argv.config);
if (!fs.existsSync(configPath)) {
  console.error(`Config file not found: ${configPath}`);
  process.exit(1);
}

const config = yaml.load(fs.readFileSync(configPath, "utf8"));

const requiredEnvVars = [
  "STRIPE_SECRET_KEY",
  "GITHUB_TOKEN",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "REPO_OWNER",
  "REPO_NAME",
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const slackWebhook = process.env.SLACK_WEBHOOK || null;

let supabasePromise;
function getSupabase() {
  if (!supabasePromise) {
    supabasePromise = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
      ),
    );
  }
  return supabasePromise;
}

async function ensureStripeProduct(cfg) {
  const lookupKey = cfg.product.id;
  const products = await stripe.products.list({
    limit: 100,
    active: true,
  });

  let product = products.data.find(
    (p) =>
      p.metadata?.avc_id === lookupKey || p.metadata?.sku === cfg.product.sku,
  );

  if (!product) {
    product = await stripe.products.create({
      name: cfg.product.title,
      description: cfg.product.short_desc,
      images: cfg.product.image ? [cfg.product.image] : undefined,
      metadata: {
        avc_id: cfg.product.id,
        sku: cfg.product.sku || "",
      },
    });
  }

  const prices = await stripe.prices.list({
    product: product.id,
    active: true,
    limit: 100,
  });
  const desiredAmount = cfg.product.price_cents;
  const desiredCurrency = cfg.product.currency;

  let price = prices.data.find(
    (p) => p.unit_amount === desiredAmount && p.currency === desiredCurrency,
  );

  const priceWithLookup = prices.data.find((p) => p.lookup_key === lookupKey);
  if (
    !price &&
    priceWithLookup &&
    priceWithLookup.unit_amount !== desiredAmount
  ) {
    await stripe.prices.update(priceWithLookup.id, { active: false });
  }

  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: desiredAmount,
      currency: desiredCurrency,
      lookup_key: lookupKey,
    });
  }

  return { product, price };
}

async function createGithubRelease(cfg, price) {
  const tag = `release/${cfg.product.slug}`;
  const body = [
    `### ${cfg.product.title}`,
    cfg.product.short_desc,
    "",
    `**Price:** ${cfg.product.currency.toUpperCase()} ${(cfg.product.price_cents / 100).toFixed(2)}`,
    `**Stripe Price ID:** ${price.id}`,
    `**Product slug:** ${cfg.product.slug}`,
    "",
    `Deployment branch: \`${cfg.deploy.publish_branch}\``,
  ].join("\n");

  const baseUrl = `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/releases`;

  const existing = await fetch(`${baseUrl}/tags/${encodeURIComponent(tag)}`, {
    headers: {
      "Authorization": `token ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  const payload = {
    tag_name: tag,
    name: `${cfg.product.title} - release`,
    body,
    draft: false,
    prerelease: false,
  };

  if (existing.ok) {
    const existingRelease = await existing.json();
    const updateResponse = await fetch(`${baseUrl}/${existingRelease.id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `token ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`GitHub release update failed: ${errorText}`);
    }

    return updateResponse.json();
  }

  if (existing.status !== 404) {
    const errorText = await existing.text();
    throw new Error(`GitHub release lookup failed: ${errorText}`);
  }

  const createResponse = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Authorization": `token ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    throw new Error(`GitHub release creation failed: ${errorText}`);
  }

  return createResponse.json();
}

async function upsertProduct(cfg, stripeProduct, stripePrice) {
  const supabase = await getSupabase();
  const payload = {
    id: cfg.product.id,
    title: cfg.product.title,
    short_desc: cfg.product.short_desc,
    price_cents: cfg.product.price_cents,
    currency: cfg.product.currency,
    stripe_product_id: stripeProduct.id,
    stripe_price_id: stripePrice.id,
    slug: cfg.product.slug,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("products").upsert(payload);

  if (error) {
    throw error;
  }

  return data;
}

async function createGithubIssue(cfg, release, price) {
  const body = [
    `**Product:** ${cfg.product.title}`,
    `**Price:** ${cfg.product.currency.toUpperCase()} ${(cfg.product.price_cents / 100).toFixed(2)}`,
    `**Stripe Price ID:** ${price.id}`,
    `**Release:** ${release.html_url}`,
    "",
    "Steps:",
    "- Verify landing page & images (preview from Vercel)",
    `- Ensure checkout button points to /api/checkout?priceId=${price.id}`,
    "- Marketing: write Etsy/Shopify listing copy and pin images.",
  ].join("\n");

  const response = await fetch(
    `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/issues`,
    {
      method: "POST",
      headers: {
        "Authorization": `token ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `Launch: ${cfg.product.title}`,
        body,
        labels: ["launch", "product", "avc-agent"],
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Create issue failed: ${errorText}`);
  }

  return response.json();
}

async function postSlackMessage(cfg, release, price) {
  if (!slackWebhook) return;

  const text = [
    ":sparkles: *New product release created* :sparkles:",
    `*${cfg.product.title}*`,
    `Price: ${cfg.product.currency.toUpperCase()} ${(cfg.product.price_cents / 100).toFixed(2)}`,
    `Release: ${release.html_url}`,
    `Stripe price: ${price.id}`,
    `Deploy branch: \`${cfg.deploy.publish_branch}\``,
  ].join("\n");

  const response = await fetch(slackWebhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Slack notification failed: ${errorText}`);
  }
}

async function main() {
  try {
    console.log("Ensuring Stripe product and price...");
    const { product, price } = await ensureStripeProduct(config);

    console.log("Creating GitHub release...");
    const release = await createGithubRelease(config, price);

    console.log("Upserting product into Supabase...");
    await upsertProduct(config, product, price);

    console.log("Creating GitHub issue...");
    await createGithubIssue(config, release, price);

    console.log("Posting Slack notification...");
    await postSlackMessage(config, release, price);

    console.log("Done. Release URL:", release.html_url);
    console.log("Stripe product id:", product.id, "price id:", price.id);
  } catch (error) {
    console.error("Error in AVC Agent:", error);
    process.exit(1);
  }
}

main();
