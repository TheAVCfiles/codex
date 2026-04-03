# StagePort GitHub-Only Scaffold

This repository is a GitHub-native, static-first StagePort scaffold.
It turns Codex dumps into scored musings, public-safe demos, buyer-facing deal rooms, Witness Window Lite previews, and GitHub Pages output.

## Why GitHub-only

- Single operational surface for build + publish
- Lower operational complexity and fewer leak points
- No Vercel, no serverless runtime assumptions, no paid hosting dependency

## Pipeline overview

1. `scripts/musings_score.py` scores normalized dumps into `data/musings.json`.
2. `scripts/build_demos.py` builds redacted demo artifacts in `site/demos/`.
3. `scripts/build_deal_rooms.py` builds buyer-facing artifacts in `site/rooms/`.
4. `scripts/build_witness.py` builds Witness Window Lite previews in `site/witness/` and writes `data/witness_tokens.json`.
5. `.github/workflows/pages.yml` deploys `site/` to GitHub Pages.

## What gets published

Only `site/` is deployed publicly.
Public outputs are rendered artifacts and controlled summaries.

## What must never be published

- Raw prompt/system text
- Authority/translation/compiler internals
- Unredacted method-sensitive logic
- Raw secrets, tokens, keys, service role material

## Before You Publish

- Never publish raw source logic.
- Never publish prompts.
- Never publish authority logic.
- Never publish translation/compiler internals.
- Only publish rendered artifacts and redacted summaries.

## Local run

```bash
python scripts/musings_score.py
python scripts/build_demos.py
python scripts/build_deal_rooms.py
python scripts/build_witness.py
```

## GitHub Pages deploy

`pages.yml` builds the artifact pipeline and uploads `site/` as the Pages artifact.
No runtime API surface is required for the public layer.

## Why public layer is artifact-only

Static Pages cannot securely host private runtime logic.
This scaffold protects delivery by publishing only transformed outputs while keeping method-sensitive logic internal to repo-controlled build scripts.

## First Run Checklist

1. Edit `data/codex_dumps.json`
2. Run musings scoring
3. Build demos
4. Build deal rooms
5. Build witness
6. Push to `main`
7. Confirm Pages output
