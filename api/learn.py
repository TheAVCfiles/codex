from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

STATE_PATH = Path(__file__).resolve().parents[1] / "data" / "learn_state.json"


@dataclass
class LearnEvent:
    event: str
    predicted_ts: datetime
    realized_ts: datetime
    hit: bool


def _default_state() -> dict[str, dict[str, float | int]]:
    return {
        "rain": {"hits": 1, "misses": 1, "shift_minutes": 0.0},
        "sun": {"hits": 1, "misses": 1, "shift_minutes": 0.0},
    }


def load_state() -> dict[str, dict[str, float | int]]:
    if not STATE_PATH.exists():
        return _default_state()
    try:
        return json.loads(STATE_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return _default_state()


def save_state(state: dict[str, dict[str, float | int]]) -> None:
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(state, indent=2), encoding="utf-8")


def update_state(event: LearnEvent, *, ewma_alpha: float = 0.2) -> dict[str, dict[str, float | int]]:
    state = load_state()
    bucket = state.setdefault(event.event, {"hits": 1, "misses": 1, "shift_minutes": 0.0})

    if event.hit:
        bucket["hits"] = int(bucket.get("hits", 0)) + 1
    else:
        bucket["misses"] = int(bucket.get("misses", 0)) + 1

    delta_min = (event.realized_ts - event.predicted_ts).total_seconds() / 60.0
    prev_shift = float(bucket.get("shift_minutes", 0.0))
    bucket["shift_minutes"] = (1.0 - ewma_alpha) * prev_shift + ewma_alpha * delta_min

    state["updated_utc"] = datetime.now(timezone.utc).isoformat()
    save_state(state)
    return state


def calibrated_probability(event: str, base_prob: float) -> float:
    state = load_state().get(event, {"hits": 1, "misses": 1})
    hits = float(state.get("hits", 1))
    misses = float(state.get("misses", 1))
    beta_mean = hits / (hits + misses)
    blend = 0.6 * base_prob + 0.4 * beta_mean
    return max(0.0, min(1.0, blend))
