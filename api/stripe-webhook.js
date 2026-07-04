const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

let supabasePromise;
async function getSupabase() {
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

async function sendSlack(text) {
  if (!process.env.SLACK_WEBHOOK) return;

  const fetchImpl = globalThis.fetch;
  if (!fetchImpl) {
    console.warn(
      "fetch is not available in this environment; skipping Slack notification",
    );
    return;
  }
  await fetchImpl(process.env.SLACK_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

module.exports = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  const payloadBuffer = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payloadBuffer,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Webhook signature verification failed", error.message);
    res.statusCode = 400;
    return res.end(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const supabase = await getSupabase();
      await supabase.from("transactions").upsert(
        [
          {
            id: session.id,
            product_id: session.metadata?.product_id || null,
            stripe_session_id: session.id,
            amount: session.amount_total,
            currency: session.currency,
            customer_email: session.customer_details?.email || null,
            status: "complete",
            created_at: new Date().toISOString(),
          },
        ],
        { onConflict: "id" },
      );

      let lineItems = session.display_items;
      if (!lineItems) {
        const fullSession = await stripe.checkout.sessions.retrieve(
          session.id,
          { expand: ["line_items"] },
        );
        lineItems = fullSession.line_items?.data;
      }

      const description = Array.isArray(lineItems)
        ? lineItems
            .map(
              (item) =>
                item.description ||
                item.price?.product ||
                item.price?.id ||
                "product",
            )
            .join(", ")
        : "product";

      await sendSlack(
        `:tada: Sale! ${session.customer_details?.email || "Customer"} purchased ${description} for ${(session.amount_total / 100).toFixed(2)} ${
          session.currency
        }.`,
      );
    } catch (error) {
      console.error("Failed to record transaction", error);
    }
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ received: true }));
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req
      .on("data", (chunk) => chunks.push(chunk))
      .on("end", () => resolve(Buffer.concat(chunks)))
      .on("error", reject);
  });
}
