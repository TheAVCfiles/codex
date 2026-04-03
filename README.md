# StagePort GitHub-Only Scaffold

This repository now includes a GitHub-native scaffold that converts Codex dumps into scored musings, public-safe demos, buyer-facing deal rooms, Witness Window Lite previews, and GitHub Pages deployment output.

## Why GitHub-only

- No Vercel usage.
- No serverless runtime dependency.
- No paid hosting requirement.
- Single operational surface: this repository + GitHub Actions + GitHub Pages.

## Pipeline overview

1. Intake: `data/codex_dumps.json` stores dump entries.
2. Scoring: `scripts/musings_score.py` computes intensity, clarity, market readiness, leak risk, and release state.
3. Demo generation: `scripts/build_demos.py` creates redacted public demo pages.
4. Deal room generation: `scripts/build_deal_rooms.py` creates buyer-facing static pages.
5. Witness generation: `scripts/build_witness.py` creates Witness Window Lite soft-gated previews.
6. Deployment: `.github/workflows/pages.yml` publishes `site/` to GitHub Pages.

## What gets published

Public output is limited to rendered artifacts:

- `site/index.html`
- `site/demos/*`
- `site/rooms/*`
- `site/witness/*`
- `site/assets/*`

## What must never be published

Never publish core method internals:

- Scoring internals
- Authority/translation logic
- Raw prompt and operational source logic
- Sensitive mappings/keys/tokens that imply executable system control

## Local run

```bash
python scripts/musings_score.py
python scripts/build_demos.py
python scripts/build_deal_rooms.py
python scripts/build_witness.py
```

## GitHub Pages deployment

The `pages.yml` workflow runs on `main` branch pushes affecting scripts, templates, data, or site assets. It rebuilds artifacts and deploys the `site/` directory via the official Pages actions.

## First Run Checklist

1. Edit `data/codex_dumps.json`
2. Run musings scoring
3. Build demos
4. Build deal rooms
5. Build witness
6. Push to `main`
7. Confirm Pages output
