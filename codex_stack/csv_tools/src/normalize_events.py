from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable

import pandas as pd

from .schemas import EVENT_SCHEMA


REQUIRED = EVENT_SCHEMA["required"]
OPTIONAL = EVENT_SCHEMA["optional"]


def normalize_frame(frame: pd.DataFrame) -> pd.DataFrame:
  missing = [col for col in REQUIRED if col not in frame.columns]
  if missing:
    raise ValueError(f"CSV missing columns: {', '.join(missing)}")
  for col in OPTIONAL:
    if col not in frame.columns:
      frame[col] = None
  frame = frame.copy()
  frame["timestamp"] = pd.to_datetime(frame["timestamp"], utc=True).dt.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
  frame.sort_values("timestamp", inplace=True)
  return frame


def emit_jsonl(rows: Iterable[dict], path: Path) -> None:
  with path.open("w", encoding="utf-8") as handle:
    for row in rows:
      handle.write(json.dumps(row, ensure_ascii=False) + "\n")


def main() -> None:
  parser = argparse.ArgumentParser(description="Normalize engagement CSV exports")
  parser.add_argument("input", type=Path, help="Path to CSV export")
  parser.add_argument("--output", type=Path, default=Path("normalized.jsonl"), help="Normalized JSONL output path")
  args = parser.parse_args()

  frame = pd.read_csv(args.input)
  normalized = normalize_frame(frame)
  emit_jsonl(normalized.to_dict(orient="records"), args.output)
  print(f"[ok] normalized events → {args.output}")


if __name__ == "__main__":
  main()
