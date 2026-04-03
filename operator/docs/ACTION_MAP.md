# Action Map (Internal Console)

## Build demos
- **What:** Generates rendered demo previews.
- **Why:** Keeps external-facing examples current without exposing internals.
- **Files:** `scripts/build_demos.py`, `data/demos.json`.
- **Output path:** `site/demos/`.

## Build deal rooms
- **What:** Generates buyer-facing room pages.
- **Why:** Supports controlled deal packaging.
- **Files:** `scripts/build_deal_rooms.py`, `data/deal_rooms.json`.
- **Output path:** `site/rooms/`.

## Build witness
- **What:** Generates restricted preview pages.
- **Why:** Supports controlled visibility and evidence-style previews.
- **Files:** `scripts/build_witness.py`, `data/witness_tokens.json`.
- **Output path:** `site/witness/`.

## Score musings
- **What:** Updates release scoring and release-state metadata.
- **Why:** Keeps queue decisions current and auditable.
- **Files:** `scripts/musings_score.py`, `data/musings.json`.
- **Output path:** `data/musings.json`.

## Export operator state
- **What:** Saves timestamped snapshots of operator state.
- **Why:** Creates audit-friendly handoff records.
- **Files:** `scripts/operator_export_state.py`, `operator/state/default_state.json`.
- **Output path:** `operator/state/snapshots/`.

## Build release queue
- **What:** Regenerates queue buckets (`ready`, `gated`, `hold`) from musing states.
- **Why:** Produces explicit publication-readiness visibility.
- **Files:** `scripts/operator_build_queue.py`, `data/musings.json`, `data/release_queue.json`.
- **Output path:** `data/release_queue.json`.
