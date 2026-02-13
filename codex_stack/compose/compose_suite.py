"""Compose Codex workflow suites."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def load_suite(name: str) -> dict[str, Any]:
  manifest_path = Path(__file__).parent / "suites" / name / "manifest.json"
  data = json.loads(manifest_path.read_text(encoding="utf-8"))
  return data


def main() -> None:
  import argparse

  parser = argparse.ArgumentParser(description="Load a Codex compose suite manifest")
  parser.add_argument("suite", help="Suite name to load")
  args = parser.parse_args()

  manifest = load_suite(args.suite)
  print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
  main()
