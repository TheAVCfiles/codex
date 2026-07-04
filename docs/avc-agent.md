# AVC Agent Pipeline

This document captures the full launch pipeline that powers the "AVC Agent" automation. One configuration file and a workflow dispatch create a Stripe product, a GitHub release and issue, publish a Vercel deploy, and wire the rest of the go-to-market loop.

## 1. Architecture overview

**Actors**

- **GitHub repo (`TheAVCFiles/codex`)** – stores the agent configuration (`ops/avc-agent.yml`) and workflow.
- **GitHub Actions** – runs the agent script on `workflow_dispatch` or when a release is created. The workflow also triggers a Vercel deployment.
- **AVC Agent script** – reads the YAML config, ensures a Stripe product+price, writes to Supabase, opens a GitHub release and issue, and notifies Slack.
- **Vercel** – serves the storefront and hosts the serverless APIs (`api/checkout.js` and `api/stripe-webhook.js`).
- **Stripe** – powers checkout and settlement.
- **Supabase/Postgres** – stores product and transaction ledgers.
- **Slack** – announces launches and successful payments.
- **GPT Teams / teammates** – consume the GitHub issue + release and act on follow-up work.

**Happy path flow**

1. Add or update `ops/avc-agent.yml` with the product metadata and dispatch the workflow.
2. The GitHub Action runs `scripts/avc-agent.js` which:
   - creates or updates the Stripe product and price,
   - creates a GitHub release tagged `release/<slug>`,
   - records the product row in Supabase,
   - opens a GitHub issue for ops/marketing,
   - posts a Slack announcement.
3. The release triggers the deploy job which pushes a fresh Vercel build. The hosted landing page uses `/api/checkout` to open the Stripe Checkout session.
4. Stripe Checkout completion calls `/api/stripe-webhook`, which stores the transaction in Supabase and posts a Slack sales alert.
5. GPT Teams watches the release/issue material and can fan out follow-up automation (copywriting, ad variants, etc.).

## 2. Configuration and code files

| File                              | Purpose                                                           |
| --------------------------------- | ----------------------------------------------------------------- |
| `ops/avc-agent.yml`               | Single source of truth for product launch metadata.               |
| `scripts/avc-agent.js`            | Orchestrator that binds Stripe, GitHub, Supabase, and Slack.      |
| `api/checkout.js`                 | Serverless function that creates Stripe Checkout sessions.        |
| `api/stripe-webhook.js`           | Serverless webhook that records transactions and alerts the team. |
| `.github/workflows/avc-agent.yml` | GitHub Action that runs the agent and Vercel deploy.              |
| `supabase_schema.sql`             | Schema for Supabase/Postgres tables.                              |

All files are live in the repo – update the YAML or dispatch the workflow to launch.

## 3. Quickstart (run it today)

1. **Provision services & secrets**

   - Supabase project → run `supabase_schema.sql` → grab `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
   - Stripe account → obtain `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` (point webhook to `<vercel-app>/api/stripe-webhook`).
   - Slack incoming webhook URL → store as `SLACK_WEBHOOK`.
   - Vercel project → store `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and ensure `STRIPE_*`, `SUPABASE_*`, `SLACK_WEBHOOK`, and `PUBLIC_URL` env vars.
   - Add the secrets above to the GitHub repo.

2. **Install dependencies locally**

   ```bash
   pnpm install
   ```

3. **Edit the product config** – customize `ops/avc-agent.yml` (id, title, price, etc.).

4. **Run the agent**

   - Locally: `node scripts/avc-agent.js --config ops/avc-agent.yml`
   - Or in GitHub Actions: dispatch "AVC Agent — Product Launch" with the config path (defaults to `ops/avc-agent.yml`).

5. **Publish the landing** – merge the release branch or push a commit so the deploy job builds Vercel and exposes `/api/checkout`.

6. **Verify checkout** – click the landing "Buy" button, complete a test Stripe checkout, and confirm:
   - Supabase `products` row exists.
   - Supabase `transactions` row is inserted.
   - Slack receives notifications.
   - GitHub issue + release created.

## 4. Team integration (GPT Teams / Slack / GitHub)

- The GitHub issue opened by the agent includes price, release link, and a launch checklist – perfect for ops/marketing follow-up.
- GPT Teams can watch the repo for the `launch` or `avc-agent` label, ingest the issue, and produce marketing copy or additional assets automatically.
- Slack notifications go to `#studio-sales` (or whichever channel the webhook points to) so the whole team sees launches and sales instantly.

## 5. Monitoring & iteration

- Supabase tables provide a single ledger – connect them to internal dashboards or daily digests.
- Stripe dashboard remains the source of truth for payouts and refunds.
- Extend the GitHub Action with scheduled revenue summaries or sanity checks before launches.
- For observability on Vercel/serverless functions, add Sentry or Logflare and watch webhook error rates.

With these pieces in place the AVC Agent becomes a "single file → live product" workflow the team can run, remix, and extend.
