#!/usr/bin/env python3
"""Normalize Codex dump records into a stable internal shape.

Expected dump schema in data/codex_dumps.json:
[
  {
    "id": "dump-001",
    "title": "Short title",
    "content": "raw codex output text",
    "created_at": "2026-03-29T12:00:00Z",
    "tags": ["vision", "governance"]
  }
]

The script tolerates partial records and fills defaults so downstream scoring
and builders can trust consistent keys.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
INPUT_PATH = ROOT / "data" / "codex_dumps.json"


def _to_text(value: Any, default: str = "") -> str:
    if value is None:
        return default
    return str(value).strip() or default


def normalize_dump(raw: dict[str, Any], index: int) -> dict[str, Any]:
    fallback_id = f"dump-{index + 1:03d}"
    tags = raw.get("tags", [])
    if not isinstance(tags, list):
        tags = []

    normalized = {
        "id": _to_text(raw.get("id"), fallback_id),
        "title": _to_text(raw.get("title"), f"Untitled dump {index + 1}"),
        "content": _to_text(raw.get("content"), "No content provided."),
        "created_at": _to_text(raw.get("created_at"), "1970-01-01T00:00:00Z"),
        "tags": [str(tag).strip() for tag in tags if str(tag).strip()],
        "source": _to_text(raw.get("source"), "codex_dump"),
    }
    return normalized


def load_and_normalize(input_path: Path = INPUT_PATH) -> list[dict[str, Any]]:
    records = json.loads(input_path.read_text(encoding="utf-8"))
    if not isinstance(records, list):
        raise ValueError("data/codex_dumps.json must contain a JSON array")
    return [normalize_dump(record if isinstance(record, dict) else {}, i) for i, record in enumerate(records)]


def main() -> None:
    normalized = load_and_normalize()
    print(json.dumps(normalized, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
