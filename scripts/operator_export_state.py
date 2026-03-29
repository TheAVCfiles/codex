#!/usr/bin/env python3
"""Export operator shell state to a timestamped JSON snapshot.

Default behavior:
- reads operator/state/default_state.json
- merges in any localStorage-style JSON state file if provided
- writes snapshot to operator/state/snapshots/
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_STATE_PATH = ROOT / "operator" / "state" / "default_state.json"
SNAPSHOT_DIR = ROOT / "operator" / "state" / "snapshots"


def load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def main() -> int:
    parser = argparse.ArgumentParser(description="Export operator state snapshot")
    parser.add_argument(
        "--state-file",
        type=Path,
        default=DEFAULT_STATE_PATH,
        help="Path to source state JSON (default: operator/state/default_state.json)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Optional explicit output file path",
    )
    args = parser.parse_args()

    state_path = args.state_file if args.state_file.is_absolute() else ROOT / args.state_file
    state = load_json(state_path)

    now = datetime.now(timezone.utc)
    state["exported_at"] = now.isoformat()

    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = (
        args.output
        if args.output
        else SNAPSHOT_DIR / f"operator_state_snapshot_{now.strftime('%Y%m%dT%H%M%SZ')}.json"
    )

    with output_path.open("w", encoding="utf-8") as fh:
        json.dump(state, fh, indent=2)
        fh.write("\n")

    print(f"Exported operator state snapshot to: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
