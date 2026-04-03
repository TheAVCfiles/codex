#!/usr/bin/env python3
"""Export operator state to a timestamped JSON snapshot.

Usage:
  python scripts/operator_export_state.py

Output:
  operator/state/snapshots/operator_state_<UTC timestamp>.json
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STATE_PATH = ROOT / "operator" / "state" / "default_state.json"
SNAPSHOT_DIR = ROOT / "operator" / "state" / "snapshots"


def main() -> None:
    if not STATE_PATH.exists():
        raise FileNotFoundError(f"Operator state file not found: {STATE_PATH}")

    state = json.loads(STATE_PATH.read_text(encoding="utf-8"))
    state["exported_at"] = datetime.now(timezone.utc).isoformat()

    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    out_path = SNAPSHOT_DIR / f"operator_state_{stamp}.json"

    out_path.write_text(json.dumps(state, indent=2), encoding="utf-8")
    print(f"Export complete: {out_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
