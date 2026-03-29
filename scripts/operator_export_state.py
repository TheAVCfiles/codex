#!/usr/bin/env python3
"""Export operator state into a timestamped snapshot file."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STATE_PATH = ROOT / "operator" / "state" / "default_state.json"
SNAPSHOT_DIR = ROOT / "operator" / "state" / "snapshots"


def main() -> None:
    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)

    state = json.loads(STATE_PATH.read_text(encoding="utf-8"))
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    snapshot_path = SNAPSHOT_DIR / f"operator_state_{timestamp}.json"

    payload = {
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "source": str(STATE_PATH.relative_to(ROOT)),
        "state": state,
    }

    snapshot_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Snapshot written to {snapshot_path}")


if __name__ == "__main__":
    main()
