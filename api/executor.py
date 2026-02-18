from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests
import yaml

from .forecast import size_notional

CFG = yaml.safe_load((Path(__file__).resolve().parent / "config.yaml").read_text(encoding="utf-8"))
DATA = Path(__file__).resolve().parents[1] / "data"
ORDERS_PATH = DATA / "paper_orders.jsonl"
METRICS_PATH = DATA / "metrics.jsonl"


@dataclass
class Decision:
    action: str
    p_rain: float
    p_sun: float
    lightning: float
    notional: float
    reason: str


def _latest_brier() -> float | None:
    if not METRICS_PATH.exists():
        return None
    lines = [ln.strip() for ln in METRICS_PATH.read_text(encoding="utf-8").splitlines() if ln.strip()]
    if not lines:
        return None
    row = json.loads(lines[-1])
    rain = float(row.get("brier_rain", 1.0))
    sun = float(row.get("brier_sun", 1.0))
    return (rain + sun) / 2.0


def decide(account_equity: float, p_rain: float, p_sun: float, lightning: float = 0.0) -> Decision:
    brier = _latest_brier()
    if brier is not None and brier > 0.25 and lightning >= float(CFG.get("lightning_threshold", 0.75)):
        return Decision("HOLD", p_rain, p_sun, lightning, 0.0, "kill-switch: high lightning + degrading brier")

    if p_rain >= 0.70:
        notional = size_notional(account_equity, p_rain, max_pct=float(CFG["max_position_pct"]))
        return Decision("BUY", p_rain, p_sun, lightning, notional, "rain window high confidence")
    if p_sun >= 0.70:
        return Decision("SELL", p_rain, p_sun, lightning, 0.0, "sun window high confidence")
    return Decision("HOLD", p_rain, p_sun, lightning, 0.0, "no high-confidence window")


def run(account_equity: float = 100_000, api_base: str = "http://localhost:8000") -> dict[str, Any]:
    forecast = requests.get(f"{api_base}/forecast/eth", timeout=20).json()
    grid = forecast.get("grid", [])
    if not grid:
        decision = Decision("HOLD", 0.5, 0.5, 0.0, 0.0, "missing forecast grid")
    else:
        first = grid[0]
        decision = decide(
            account_equity,
            float(first.get("rain", 0.5)),
            float(first.get("sun", 0.5)),
            float(first.get("lightning", 0.0)),
        )

    record = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "action": decision.action,
        "p_rain": decision.p_rain,
        "p_sun": decision.p_sun,
        "lightning": decision.lightning,
        "notional": decision.notional,
        "reason": decision.reason,
    }
    DATA.mkdir(exist_ok=True)
    with ORDERS_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(record) + "\n")
    return record


if __name__ == "__main__":
    print(run())
