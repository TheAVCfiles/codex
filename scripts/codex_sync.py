#!/usr/bin/env python3
"""Normalize Codex dump inputs into a stable internal structure.

Expected input schema (tolerant, not strict):
- data/codex_dumps.json is a JSON array OR an object containing `dumps`.
- each item may include fields like id, title, content/body/text, timestamp/date.
- incomplete entries are accepted and normalized with safe defaults.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "data" / "codex_dumps.json"


def _as_list(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]
    if isinstance(payload, dict):
        dumps = payload.get("dumps", [])
        if isinstance(dumps, list):
            return [item for item in dumps if isinstance(item, dict)]
    return []


def normalize_entry(index: int, item: dict[str, Any]) -> dict[str, Any]:
    content = item.get("content") or item.get("body") or item.get("text") or ""
    title = item.get("title") or f"Codex dump {index + 1}"
    normalized = {
        "id": str(item.get("id") or f"dump-{index + 1}"),
        "title": str(title).strip(),
        "content": str(content).strip(),
        "timestamp": str(item.get("timestamp") or item.get("date") or ""),
        "source": str(item.get("source") or "codex"),
        "tags": item.get("tags") if isinstance(item.get("tags"), list) else [],
    }
    return normalized


def load_normalized_dumps() -> list[dict[str, Any]]:
    if not INPUT.exists():
        return []
    payload = json.loads(INPUT.read_text(encoding="utf-8"))
    return [normalize_entry(i, row) for i, row in enumerate(_as_list(payload))]


if __name__ == "__main__":
    print(json.dumps(load_normalized_dumps(), indent=2))
