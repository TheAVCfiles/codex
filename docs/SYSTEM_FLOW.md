# SYSTEM FLOW

This repository implements a static, GitHub-native delivery flow:

1. **Codex dump intake** (`data/codex_dumps.json`)
2. **Scoring** (`scripts/musings_score.py` -> `data/musings.json`)
3. **Demo generation** (`scripts/build_demos.py` -> `site/demos/` + `data/demos.json`)
4. **Deal room generation** (`scripts/build_deal_rooms.py` -> `site/rooms/` + `data/deal_rooms.json`)
5. **Witness generation** (`scripts/build_witness.py` -> `site/witness/` + `data/witness_tokens.json`)
6. **Pages deployment** (`.github/workflows/pages.yml` deploys `site/`)

Purpose of this flow: show outcomes publicly while keeping method-sensitive logic constrained to repo-controlled build scripts.
