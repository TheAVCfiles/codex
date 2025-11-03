"""Minimal autopilot scheduler stub."""
from __future__ import annotations

import datetime as dt
import json
from pathlib import Path

from .mesh_build import build_mesh


SCHEDULE_PATH = Path(__file__).resolve().parent / "autopilot_schedule.json"


def run_autopilot() -> dict:
    """Build the mesh and record a timestamp."""
    mesh = build_mesh()
    payload = {
        "ran_at": dt.datetime.utcnow().isoformat() + "Z",
        "nodes": len(mesh["nodes"]),
        "edges": len(mesh["edges"]),
    }
    SCHEDULE_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return payload


if __name__ == "__main__":
    result = run_autopilot()
    print(json.dumps(result, indent=2))
