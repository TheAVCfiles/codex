# Aesthetic Intelligence Infrastructure (AII)

A ready-to-deploy scaffold for persona "fits". Drop it onto Vercel, connect Ko-fi, and maintain a Notion Evidence Index of every sale.

## Features

- **Serverless Fits API** — `GET /api/fits` lists available personas, `GET /api/fits/:name` returns the full JSON payload.
- **Ko-fi → Notion webhook** — log every sale (and its metadata) straight to your Evidence Index.
- **Minimal docs site** — static landing page at `/` describing the endpoints.
- **Automation ready** — optional GitHub Actions workflow plus a script to generate new fits.

## Getting Started

```bash
cd aii-fit-api
pnpm install
# or npm install
vercel link   # first-time only
vercel env pull .env.local
vercel dev
```

The project uses ESM modules (`"type": "module"`).

## Deploy to Vercel

1. Create a new Vercel project pointing at this folder.
2. Set production environment variables as needed:
   - `KOFI_TOKEN` (optional verification token from Ko-fi)
   - `NOTION_DB_ID`
   - `NOTION_API_KEY`
3. `pnpm dlx vercel@latest --prod --confirm` (or use the GitHub Action below).

### GitHub Actions Deploy (optional)

Copy `.github/workflows/aii-vercel.yml` to your repository and add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` secrets. Push to `main` to deploy automatically.

## Ko-fi Evidence Logging

The `/api/kofi-webhook` endpoint accepts Ko-fi webhook payloads. When Notion credentials are present it creates a `Pending` entry with:

- ISO timestamp (plus a string column for quick sorting)
- Source, amount, currency, payer, product tier, message
- Transaction link and default next steps

If credentials are missing the webhook simply acknowledges the event (HTTP 200) so you can inspect logs safely.

## Creating New Fits

Use the generator script to scaffold a new persona:

```bash
node scripts/gen-fit.js "Cyber Librarian"
```

Then tweak the generated JSON in `fits/`. Ship it with Git:

```bash
git add fits/cyber-librarian.json
git commit -m "feat: add Cyber Librarian fit"
```

## iPhone Shortcut — "Codex Drop"

Automate fit publishing from your phone using the GitHub API.

1. Prompt for the fit name.
2. Prompt for style, tone, and motion notes.
3. Construct a JSON dictionary mirroring `fits/*.json`.
4. Convert the JSON to Base64.
5. `POST https://api.github.com/repos/<user>/<repo>/contents/aii-fit-api/fits/<slug>.json`
   - Headers: `Authorization: token <PAT>` and `Accept: application/vnd.github+json`
   - Body:
     ```json
     {
       "message": "feat: add <slug> fit (iOS)",
       "content": "<BASE64>"
     }
     ```
6. On success open `https://<your-vercel-domain>/api/fits/<slug>` to validate.

Keep a note in Shortcuts to remind you of the environment variables and PAT scope (`repo`).

## Folder Overview

```
aii-fit-api/
  api/
    fits/
    kofi-webhook.js
  fits/            # persona JSON definitions
  public/index.html
  scripts/gen-fit.js
  vercel.json
```

Stay aesthetic. Ship intelligence.
