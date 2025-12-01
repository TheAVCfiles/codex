"""Tiny helper that reads suite manifests and runs entrypoints."""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Dict, Iterable, List

ROOT = Path(__file__).resolve().parents[1]
SUITES = ROOT / "suites"


def load_manifest(path: Path) -> Dict[str, object]:
    return json.loads(path.read_text(encoding="utf-8"))


def iter_suite_manifests() -> Iterable[Path]:
    return sorted(SUITES.glob("*/manifest.json"))


def run_entrypoint(entry: Dict[str, str]) -> int:
    if "cli" in entry:
        print(">", entry["cli"])
        return subprocess.call(entry["cli"].split())
    raise ValueError("Unsupported entrypoint schema")


def compose(suite_filter: str | None = None) -> List[int]:
    results: List[int] = []
    for manifest_path in iter_suite_manifests():
        manifest = load_manifest(manifest_path)
        name = manifest.get("name", manifest_path.parent.name)
        if suite_filter and suite_filter not in name:
            continue
        print(f"Launching suite: {name}")
        for entry in manifest.get("entrypoints", []):
            results.append(run_entrypoint(entry))
    return results


if __name__ == "__main__":
    suite = sys.argv[1] if len(sys.argv) > 1 else None
    sys.exit(max(compose(suite) or [0]))
