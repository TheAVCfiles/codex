#!/usr/bin/env python3
"""Score codex dumps for controlled release decisions.

Scoring purpose:
- intensity: urgency and emotional charge
- clarity: readability and concrete framing
- market_readiness: readiness for buyer-facing packaging
- leak_risk: probability of sensitive method exposure
- release_state: publication gate decision

This script writes data/musings.json for downstream static artifact builders.
"""

from __future__ import annotations

import json
from pathlib import Path

from codex_sync import load_and_normalize

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "data" / "musings.json"

BANNED_TERMS = ["prompt", "internal", "compiler", "authority rules", "token", "key"]


def clamp(value: int) -> int:
    return max(0, min(100, value))


def score_record(record: dict) -> dict:
    text = f"{record['title']}\n{record['content']}".lower()
    word_count = len(text.split())
    unique_words = len(set(text.split())) or 1

    intensity = clamp(min(100, word_count // 3 + (15 if "!" in text else 0)))
    clarity = clamp(min(100, int((unique_words / max(word_count, 1)) * 240)))
    market_readiness = clamp(50 + (10 if "pilot" in text or "buyer" in text else 0) + (10 if clarity > 55 else -10))
    leak_hits = sum(1 for term in BANNED_TERMS if term in text)
    leak_risk = clamp(leak_hits * 20 + (15 if "system" in text else 0))

    if leak_risk >= 60:
        release_state = "private_hold"
    elif market_readiness >= 60 and clarity >= 45:
        release_state = "public_now"
    else:
        release_state = "gated_preview"

    return {
        "id": record["id"],
        "title": record["title"],
        "summary": record["content"][:400],
        "scores": {
            "intensity": intensity,
            "clarity": clarity,
            "market_readiness": market_readiness,
            "leak_risk": leak_risk,
        },
        "release_state": release_state,
        "tags": record["tags"],
        "created_at": record["created_at"],
    }


def main() -> None:
    normalized = load_and_normalize()
    scored = [score_record(record) for record in normalized]
    OUTPUT_PATH.write_text(json.dumps(scored, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(scored)} scored musings to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
