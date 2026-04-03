# Action Map (Internal Only)

## Build demos
- **What:** Generates public-safe demo artifacts.
- **Why:** Provides preview value without exposing internal logic.
- **Affects:** `scripts/build_demos.py` and generated `data/demos.json` (if script writes to data).
- **Output path:** `site/demos/`.

## Build deal rooms
- **What:** Generates buyer-facing room pages.
- **Why:** Supports controlled partner and buyer review.
- **Affects:** `scripts/build_deal_rooms.py` and generated deal room artifacts.
- **Output path:** `site/rooms/`.

## Build witness
- **What:** Generates restricted preview pages.
- **Why:** Enables verification views without source disclosure.
- **Affects:** `scripts/build_witness.py` and witness artifacts.
- **Output path:** `site/witness/`.

## Score musings
- **What:** Refreshes release scoring and states.
- **Why:** Keeps routing decisions consistent before queue build.
- **Affects:** `scripts/musings_score.py` and `data/musings.json`.
- **Output path:** `data/musings.json`.

## Build release queue
- **What:** Rebuilds queue buckets (`ready`, `gated`, `hold`) from musing states.
- **Why:** Makes publication decisions explicit and auditable.
- **Affects:** `scripts/operator_build_queue.py`.
- **Output path:** `data/release_queue.json`.
