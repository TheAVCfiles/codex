# Delivery Map

This map explains what each required part does, why it exists, where it delivers output, and whether it is public.

## `.github/workflows/`

- `pages.yml`

  - **What**: Builds artifacts from scripts and deploys `site/` to GitHub Pages.
  - **Why**: Keeps deployment GitHub-only with no Vercel/runtime dependency.
  - **Where**: Published Pages artifact.
  - **Visibility**: Internal automation; outputs public files.

- `codex-choreographer.yml`

  - **What**: Classifies PRs by title/body and applies institutional labels.
  - **Why**: Keeps intake governance searchable and triaged.
  - **Where**: PR labels in GitHub UI.
  - **Visibility**: Internal operational metadata.

- `musings-score.yml`

  - **What**: Rebuilds `data/musings.json` when dump inputs change.
  - **Why**: Keeps scored release decisions up-to-date and committed.
  - **Where**: `data/musings.json` in repo.
  - **Visibility**: Internal dataset; not for direct public display.

- `demo-build.yml`

  - **What**: Regenerates `site/demos/` from scored musings.
  - **Why**: Ensures public-safe demos stay synchronized.
  - **Where**: `site/demos/` and `data/demos.json`.
  - **Visibility**: Outputs are public artifacts.

- `deal-room-build.yml`
  - **What**: Regenerates `site/rooms/` and `site/witness/`.
  - **Why**: Keeps buyer-facing and witness previews fresh.
  - **Where**: `site/rooms/`, `site/witness/`, `data/deal_rooms.json`.
  - **Visibility**: Outputs are public artifacts with soft gating.

## `scripts/`

- `codex_sync.py`

  - **What**: Normalizes dump schema into stable records.
  - **Why**: Downstream scripts need predictable keys.
  - **Where**: Prints normalized records for composition.
  - **Visibility**: Internal-only logic.

- `musings_score.py`

  - **What**: Scores intensity, clarity, market readiness, leak risk, release state.
  - **Why**: Converts raw dumps into controlled publish decisions.
  - **Where**: `data/musings.json`.
  - **Visibility**: Internal-only logic.

- `build_demos.py`

  - **What**: Builds redacted demo HTML pages.
  - **Why**: Public surface should show value without exposing method.
  - **Where**: `site/demos/`, `data/demos.json`.
  - **Visibility**: Rendered output public; method internal.

- `build_deal_rooms.py`

  - **What**: Builds buyer-facing room pages with CTA controls.
  - **Why**: Enable structured conversion pathways.
  - **Where**: `site/rooms/`, `data/deal_rooms.json`.
  - **Visibility**: Public artifact output.

- `build_witness.py`
  - **What**: Builds Witness Window Lite static preview.
  - **Why**: Soft-gated visibility without private runtime claims.
  - **Where**: `site/witness/index.html`.
  - **Visibility**: Public preview page.

## `data/`

- `codex_dumps.json`: raw intake data source (internal input).
- `musings.json`: scored dataset for builders (internal transformed data).
- `demos.json`: public demo index metadata.
- `deal_rooms.json`: public deal room metadata.
- `witness_tokens.json`: static preview token list (non-secure signaling only).

## `site/`

- `index.html`: landing page for published artifacts.
- `demos/`: public-safe generated demo pages.
- `rooms/`: buyer-facing static room pages.
- `witness/`: Witness Window Lite pages.
- `assets/`: static CSS and shared assets.

## `src/templates/`

- `demo.html`, `room.html`, `witness.html`: controlled HTML templates used by build scripts.

## `docs/`

- `DELIVERY_MAP.md`: this file.
- `SYSTEM_FLOW.md`: end-to-end transformation flow.
- `PUBLIC_PRIVATE_SPLIT.md`: publication boundaries and anti-leak posture.
