# StagePort System (GitHub-only scaffold)

This scaffold removes Vercel runtime assumptions and runs entirely on GitHub Actions + GitHub Pages.

## Core model

- **Build-time system**: scoring, classification, demo generation, deal rooms, and witness-lite generation run in workflows.
- **Static deployment**: only `site/` is deployed to GitHub Pages.
- **Boundary rule**: keep private logic in private repos; publish only rendered artifacts and controlled summaries.

## Structure

```text
stageport-system/
  .github/workflows/
  scripts/
  data/
  site/
  src/templates/
  supabase/schema.sql
```

## Workflows

- `pages.yml`: Builds artifacts and deploys `site/`.
- `codex-choreographer.yml`: Labels PRs from title/body heuristics.
- `musings-score.yml`: Scores dumps into `data/musings.json`.
- `demo-build.yml`: Builds static demos from `musings.json`.
- `deal-room-build.yml`: Builds static deal rooms from `musings.json`.

## Local run

```bash
python stageport-system/scripts/musings_score.py
python stageport-system/scripts/build_demos.py
python stageport-system/scripts/build_deal_rooms.py
python stageport-system/scripts/build_witness.py
```

Serve locally:

```bash
python -m http.server -d stageport-system/site 8000
```

## Security note

`build_witness.py` implements a **soft gate** only. Static hosting cannot provide cryptographic one-time redemption or server-side revocation.
