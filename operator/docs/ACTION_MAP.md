# Action Map

## Review Actions (Release State)

### `public_now`
- **What it does:** Marks a musing for direct publication eligibility.
- **Why it exists:** Fast routing for high-confidence, low-risk items.
- **Files affected:** Operator runtime state (browser localStorage), source record in `data/musings.json` for persistent updates via scripts.
- **Output target:** Included in `data/release_queue.json` under `ready` when queue is rebuilt.

### `gated_preview`
- **What it does:** Marks a musing for controlled preview only.
- **Why it exists:** Allows stakeholder review without full public release.
- **Files affected:** Operator runtime state; later normalized into `data/musings.json`.
- **Output target:** Included in `data/release_queue.json` under `gated`.

### `private_hold`
- **What it does:** Blocks publication and keeps artifact internal.
- **Why it exists:** Prevents accidental release of sensitive or low-confidence material.
- **Files affected:** Operator runtime state; later normalized into `data/musings.json`.
- **Output target:** Included in `data/release_queue.json` under `hold`.

## Build Control Actions

### Build demos
- **What it does:** Runs demo generation flow.
- **Why it exists:** Produces safe public-facing value previews.
- **Files affected:** `scripts/build_demos.py`, `data/demos.json`.
- **Output target:** `site/demos/`.

### Build deal rooms
- **What it does:** Runs deal room generator.
- **Why it exists:** Creates buyer-facing, structured offer pages.
- **Files affected:** `scripts/build_deal_rooms.py`, `data/deal_rooms.json`.
- **Output target:** `site/rooms/`.

### Build witness
- **What it does:** Runs witness preview generator.
- **Why it exists:** Produces restricted preview artifacts for controlled access.
- **Files affected:** `scripts/build_witness.py`, `data/witness_tokens.json`.
- **Output target:** `site/witness/`.

### Score musings
- **What it does:** Recomputes or refreshes musing release-state signals.
- **Why it exists:** Keeps release decisions consistent across updates.
- **Files affected:** `scripts/musings_score.py`, `data/musings.json`.
- **Output target:** `data/musings.json` and downstream `data/release_queue.json`.

## Additional Operator Scripts

### Export state snapshot
- **Command:** `python scripts/operator_export_state.py`
- **Output:** `operator/state/snapshots/operator_state_<timestamp>.json`

### Build publication queue
- **Command:** `python scripts/operator_build_queue.py`
- **Output:** `data/release_queue.json`
