#!/usr/bin/env python3
"""Build or refresh the release queue from musings.

Queue buckets are intentionally strict for operator clarity:
- ready: public_now
- gated: gated_preview
- hold: private_hold (or anything unknown)
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MUSINGS_PATH = ROOT / "data" / "musings.json"
QUEUE_PATH = ROOT / "data" / "release_queue.json"


def _bucket_for_state(release_state: str) -> str:
    normalized = (release_state or "").strip().lower()
    if normalized == "public_now":
        return "ready"
    if normalized == "gated_preview":
        return "gated"
    return "hold"


def main() -> None:
    musings = json.loads(MUSINGS_PATH.read_text(encoding="utf-8"))

    queue = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "ready": [],
        "gated": [],
        "hold": [],
    }

    for item in musings:
        release_state = item.get("release_state", "private_hold")
        target_bucket = _bucket_for_state(release_state)
        reason = {
            "public_now": "Approved for public artifact generation.",
            "gated_preview": "Approved only for restricted preview artifacts.",
        }.get(release_state, "Blocked from publication pending internal review.")

        queue[target_bucket].append(
            {
                "id": item.get("id"),
                "title": item.get("title"),
                "release_state": release_state,
                "release_score": item.get("release_score"),
                "leak_risk": item.get("leak_risk"),
                "reason": reason,
            }
        )

    QUEUE_PATH.write_text(json.dumps(queue, indent=2) + "\n", encoding="utf-8")
    print(f"Updated release queue: {QUEUE_PATH}")


if __name__ == "__main__":
    main()
