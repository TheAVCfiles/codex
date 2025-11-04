const NOTION_VERSION = "2022-06-28";

function normalizeBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (error) {
      console.warn("Unable to parse Ko-fi payload as JSON", error);
      return {};
    }
  }
  return body;
}

async function createNotionEntry({ notionDb, notionKey, payload }) {
  if (!notionDb || !notionKey) return false;

  const amount = Number(payload?.amount ?? payload?.data?.amount ?? 0) || 0;
  const currency = payload?.currency ?? payload?.data?.currency ?? "USD";
  const payer =
    payload?.from_name ?? payload?.data?.from_name ?? "Ko-fi Supporter";
  const message = payload?.message ?? payload?.data?.message ?? "";
  const timestamp =
    payload?.timestamp ?? payload?.data?.timestamp ?? new Date().toISOString();
  const product = payload?.tier_name ?? payload?.data?.tier_name ?? "";
  const transactionId =
    payload?.kofi_transaction_id ?? payload?.data?.kofi_transaction_id ?? "";
  const link = transactionId
    ? `https://ko-fi.com/transaction/${transactionId}`
    : (payload?.shop_items?.[0]?.direct_download_url ?? "");

  const body = {
    parent: { database_id: notionDb },
    properties: {
      "Date ISO": { date: { start: timestamp } },
      "Date (Local)": { rich_text: [{ text: { content: timestamp } }] },
      "Source": { select: { name: "Ko-fi" } },
      "Amount": { number: amount },
      "Currency": { rich_text: [{ text: { content: currency } }] },
      "Payer": { rich_text: [{ text: { content: payer } }] },
      "Message": { rich_text: [{ text: { content: message.slice(0, 2000) } }] },
      "Product": { rich_text: [{ text: { content: product } }] },
      "Order ID / Txn ID": {
        rich_text: [{ text: { content: transactionId } }],
      },
      "Link": link ? { url: link } : null,
      "Fulfillment Status": { select: { name: "Pending" } },
      "Next Step / Notes": {
        rich_text: [{ text: { content: "Auto via Ko-fi webhook" } }],
      },
    },
  };

  if (!link) {
    delete body.properties.Link;
  }

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${notionKey}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Notion API error: ${response.status} ${response.statusText} - ${text}`,
    );
  }

  return true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const payload = normalizeBody(req.body);
  const verificationToken = process.env.KOFI_TOKEN;
  const notionDb = process.env.NOTION_DB_ID;
  const notionKey = process.env.NOTION_API_KEY;

  if (
    verificationToken &&
    payload?.verification_token &&
    payload.verification_token !== verificationToken
  ) {
    return res.status(401).json({ error: "invalid_token" });
  }

  console.info("Ko-fi webhook received", {
    amount: payload?.amount ?? payload?.data?.amount,
    payer: payload?.from_name ?? payload?.data?.from_name,
    tier: payload?.tier_name ?? payload?.data?.tier_name,
  });

  try {
    const notionLogged = await createNotionEntry({
      notionDb,
      notionKey,
      payload,
    });
    return res.status(200).json({ ok: true, notionLogged });
  } catch (error) {
    console.error("Failed to log Ko-fi sale to Notion", error);
    return res.status(500).json({ error: "failed_to_log_sale" });
  }
}
