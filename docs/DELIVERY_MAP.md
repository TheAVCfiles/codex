# DELIVERY MAP

## Operator-first file map

### `.github/workflows/` — **INTERNAL / OPERATOR-EDITED**

- **WHAT**: Automation for scoring, building, labeling, and Pages deployment.
- **WHY**: Keeps delivery repeatable and GitHub-native.
- **WHERE output goes**: Generated files under `data/` and `site/`.
- **Edit first when**: You need trigger, sequence, or deploy changes.

### `scripts/` — **INTERNAL / OPERATOR-EDITED**

- **WHAT**: Build-time logic for normalization, scoring, redaction, and artifact assembly.
- **WHY**: Converts raw dumps into controlled public artifacts.
- **WHERE output goes**: `data/*.json`, `site/demos/`, `site/rooms/`, `site/witness/`.
- **Edit first when**: You need policy or generation behavior changes.

### `data/` — mixed

- `data/codex_dumps.json` — **INTERNAL / OPERATOR-EDITED** source intake.
- `data/musings.json` — **GENERATED** scored records.
- `data/demos.json` — **GENERATED** demo manifest.
- `data/deal_rooms.json` — **GENERATED** deal room manifest.
- `data/witness_tokens.json` — **INTERNAL-GENERATED** local soft-gate tokens.

### `site/` — **PUBLIC / GENERATED**

- **WHAT**: The only Pages-deployed surface.
- **WHY**: Public artifacts should be static, controlled, and low-leakage.
- **WHERE output goes**: GitHub Pages deployment target.

### `src/templates/` — **INTERNAL / OPERATOR-EDITED**

- **WHAT**: Minimal HTML templates documenting expected output structure.
- **WHY**: Gives future operators a stable page contract.
- **WHERE output goes**: Referenced by build maintenance workflows.

### `docs/` — **INTERNAL / OPERATOR-EDITED**

- **WHAT**: Delivery instructions and boundary documentation.
- **WHY**: Ensures handoff-ready operation without external context.
- **WHERE output goes**: Repo documentation for future delivery operators.

## First files a future operator should edit

1. `data/codex_dumps.json`
2. `scripts/musings_score.py`
3. `scripts/redact.py`
4. `scripts/build_demos.py`
5. `.github/workflows/pages.yml`
