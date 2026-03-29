# StagePort System (GitHub-only Scaffold)

This scaffold is a build-time, GitHub-native pipeline for:

- Codex dump intake + PR classification
- Musings scoring + release-state assignment
- Static demo and deal-room generation
- Witness Window Lite generation
- GitHub Pages deployment from `site/`

## Core rule

Only `site/` is deployed to GitHub Pages. Keep sensitive source logic and authority internals outside `site/`.

## Layout

```text
stageport-system/
├── .github/workflows/
├── scripts/
├── data/
├── site/
├── src/templates/
└── supabase/schema.sql
```

## Build flow

1. Add codex dumps to `data/codex_dumps.json`.
2. Run `scripts/musings_score.py` to build `data/musings.json`.
3. Run `scripts/build_demos.py` and `scripts/build_deal_rooms.py`.
4. Run `scripts/build_witness.py` to create witness page + token hash map.
5. Deploy `site/` via `.github/workflows/pages.yml`.

## Security boundary

GitHub Pages is static hosting. Witness Window Lite is soft-gated only; do not publish raw prompts, source internals, compiler logic, secrets, or governance authority internals to `site/`.
