#!/usr/bin/env python3
"""Build or refresh data/release_queue.json from data/musings.json.

Queue logic:
- ready: release_state == public_now, release_score >= 80, leak_risk != high
- gated: release_state == gated_preview OR medium confidence/risk items
- hold: release_state == private_hold OR low score/high leak risk items
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MUSINGS_PATH = ROOT / "data" / "musings.json"
QUEUE_PATH = ROOT / "data" / "release_queue.json"


def classify(entry: dict) -> tuple[str, str]:
    state = entry.get("release_state", "private_hold")
    score = int(entry.get("release_score", 0))
    leak_risk = str(entry.get("leak_risk", "high")).lower()

    # Hold conditions have highest priority because confidentiality is non-negotiable.
    if state == "private_hold" or leak_risk == "high" or score < 60:
        return "hold", "Hold due to explicit private state, high leak risk, or low score."

    # Ready requires strong score and low enough risk.
    if state == "public_now" and score >= 80 and leak_risk in {"low", "medium"}:
        return "ready", "Ready for publication pipeline based on score/state/risk."

    # Everything else is routed to gated review for controlled release.
    return "gated", "Gated review required before publication."


def main() -> None:
    musings = json.loads(MUSINGS_PATH.read_text(encoding="utf-8"))
    queue = {"ready": [], "gated": [], "hold": []}

    for entry in musings:
        bucket, reason = classify(entry)
        queue[bucket].append(
            {
                "id": entry.get("id"),
                "title": entry.get("title", "Untitled"),
                "reason": reason,
            }
        )

    QUEUE_PATH.write_text(json.dumps(queue, indent=2), encoding="utf-8")
    print(f"Queue refreshed: {QUEUE_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
