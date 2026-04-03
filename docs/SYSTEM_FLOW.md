# System Flow

This repository runs a GitHub-native, static-first pipeline:

1. `data/codex_dumps.json` receives Codex dump entries.
2. `scripts/musings_score.py` normalizes/scopes entries and writes scored records to `data/musings.json`.
3. `scripts/build_demos.py` transforms approved records into redacted public-safe HTML demos in `site/demos/`.
4. `scripts/build_deal_rooms.py` builds buyer-facing static deal room pages in `site/rooms/`.
5. `scripts/build_witness.py` builds Witness Window Lite previews in `site/witness/`.
6. `.github/workflows/pages.yml` publishes the `site/` folder to GitHub Pages.

Design intent:

- Publish rendered artifacts, not raw operational logic.
- Keep scoring and decision logic in scripts and workflow automation.
- Keep deployment fully inside GitHub Actions + GitHub Pages.
