import { mintCents } from "./cents";
import { normalize } from "./normalize";
import { readLedger, writeLedger } from "./ledger";

export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);

    if (url.pathname === "/log" && request.method === "POST") {
      const raw = await request.json();
      const event = normalize(raw);
      await env.DTG_EVENTS.put(event.id, JSON.stringify(event));
      const cents = mintCents(event, Number(env.SENTIENT_CENT_RATE || 0.01));
      await writeLedger(env, { ...event, cents });
      return new Response(
        JSON.stringify({ ok: true, cents }),
        { headers: { "content-type": "application/json" } }
      );
    }

    if (url.pathname === "/ledger") {
      const rows = await readLedger(env);
      return new Response(
        JSON.stringify(rows),
        { headers: { "content-type": "application/json" } }
      );
    }

    return new Response("ok");
  }
};
