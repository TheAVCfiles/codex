# Ballet Bank (local-first MVP)

## Structure

- `server/` Express + SQLite + Stripe webhook + relayer conversion API
- `contracts/` Hardhat contracts for Stagecoin and SentientCents
- `web/` Minimal UI for checkout + balance + conversion

## Quick start

```bash
cd server
npm i
npm run dev
```

Server defaults to `http://localhost:4242` and hosts UI at `/web/index.html`.

## Notes

- SCENT is stored off-chain in SQLite by default.
- Conversion is optional and relayer-backed (gas paid by platform).
- Stripe webhook is idempotent using `stripe_events` table.
