#!/usr/bin/env python3
"""Build data/release_queue.json from data/musings.json.

Queue logic:
- public_now -> ready
- gated_preview -> gated
- private_hold -> hold

Each item keeps an explicit reason so future operators can quickly see
why an item is bucketed into a particular release lane.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MUSINGS_PATH = ROOT / "data" / "musings.json"
QUEUE_PATH = ROOT / "data" / "release_queue.json"

STATE_TO_BUCKET = {
    "public_now": "ready",
    "gated_preview": "gated",
    "private_hold": "hold",
}


def main() -> int:
    with MUSINGS_PATH.open("r", encoding="utf-8") as fh:
        musings = json.load(fh)

    queue = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "ready": [],
        "gated": [],
        "hold": [],
    }

    for item in musings:
        state = item.get("release_state", "private_hold")
        bucket = STATE_TO_BUCKET.get(state, "hold")
        queue[bucket].append(
            {
                "id": item.get("id"),
                "title": item.get("title"),
                "release_score": item.get("release_score"),
                "leak_risk": item.get("leak_risk"),
                "reason": item.get("reason", "No explicit reason provided."),
            }
        )

    with QUEUE_PATH.open("w", encoding="utf-8") as fh:
        json.dump(queue, fh, indent=2)
        fh.write("\n")

    print(f"Release queue written to: {QUEUE_PATH}")
    print(
        "Bucket counts -> "
        f"ready: {len(queue['ready'])}, "
        f"gated: {len(queue['gated'])}, "
        f"hold: {len(queue['hold'])}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
