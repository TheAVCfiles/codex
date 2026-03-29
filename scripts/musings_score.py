#!/usr/bin/env python3
"""Score normalized Codex dumps into musings.

Scoring exists to separate publishable artifacts from held/internal material.
Rules are intentionally legible so operators can tune thresholds safely.
"""

from __future__ import annotations

import json
from pathlib import Path

from codex_sync import load_normalized_dumps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "musings.json"


def _count_matches(text: str, words: list[str]) -> int:
    lowered = text.lower()
    return sum(lowered.count(word) for word in words)


def score_dump(entry: dict) -> dict:
    text = f"{entry.get('title', '')} {entry.get('content', '')}".strip()
    length = len(text.split())

    intensity = min(100, 20 + min(length, 400) // 5)
    clarity = max(10, min(100, 70 - _count_matches(text, ["maybe", "unclear", "draft"]) * 10))
    market_readiness = max(5, min(100, 30 + _count_matches(text, ["pilot", "buyer", "deploy", "deliver"]) * 15))
    timeliness = max(10, min(100, 40 + _count_matches(text, ["now", "current", "this week", "today"]) * 15))
    leak_risk = min(100, _count_matches(text, [
        "prompt",
        "system message",
        "internal",
        "compiler",
        "authority",
        "translation layer",
        "token",
        "key",
        "secret",
    ]) * 20)

    if leak_risk >= 60:
        release_state = "private_hold"
    elif leak_risk >= 20 or market_readiness < 45:
        release_state = "gated_preview"
    else:
        release_state = "public_now"

    release_score = round((clarity + market_readiness + timeliness - leak_risk * 0.5) / 3, 2)

    return {
        **entry,
        "scores": {
            "intensity": intensity,
            "clarity": clarity,
            "market_readiness": market_readiness,
            "timeliness": timeliness,
            "leak_risk": leak_risk,
            "release_state": release_state,
            "release_score": release_score,
        },
    }


def main() -> None:
    scored = [score_dump(item) for item in load_normalized_dumps()]
    OUT.write_text(json.dumps(scored, indent=2), encoding="utf-8")
    print(f"wrote {len(scored)} musings -> {OUT}")


if __name__ == "__main__":
    main()
