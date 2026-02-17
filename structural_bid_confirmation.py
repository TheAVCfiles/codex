from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

import pandas as pd


@dataclass(frozen=True)
class ExecutionPlan:
    asset_target: str
    allocation: str
    hedge: str
    horizon: str


def _load_ledger(ledger: pd.DataFrame | str | Path) -> pd.DataFrame:
    if isinstance(ledger, pd.DataFrame):
        df = ledger.copy()
    else:
        df = pd.read_csv(ledger)

    if "event_date" not in df.columns or "weight" not in df.columns:
        raise KeyError("ledger must include at least 'event_date' and 'weight' columns")

    df["event_date"] = pd.to_datetime(df["event_date"], utc=False, errors="coerce")
    df = df.dropna(subset=["event_date", "weight"])
    df["weight"] = pd.to_numeric(df["weight"], errors="coerce")
    return df.dropna(subset=["weight"])


def check_structural_bid_confirmation(
    ledger: pd.DataFrame | str | Path,
    anchor_date: datetime | str,
    *,
    window_days: int = 90,
    min_weight: float = 85.0,
) -> dict[str, Any]:
    """Validate whether high-weight structural events support the narrative anchor."""
    df = _load_ledger(ledger)
    anchor_ts = pd.Timestamp(anchor_date)

    start = anchor_ts - timedelta(days=window_days)
    end = anchor_ts + timedelta(days=window_days)

    qualified_events = df[
        (df["event_date"] >= start)
        & (df["event_date"] <= end)
        & (df["weight"] >= min_weight)
    ].sort_values(by="event_date")

    if qualified_events.empty:
        return {
            "status": "NEUTRAL",
            "signal": "Awaiting Confirmation",
            "implication": "Narrative remains unanchored. Structural capital is absent.",
            "action": "Maintain existing levels. Do not increase exposure.",
        }

    execution = ExecutionPlan(
        asset_target="LAC/SQM (Lithium Juniors)",
        allocation="1.0–1.2% equity",
        hedge="20–30% BTC",
        horizon="6–18 months",
    )
    supporting_evidence = [
        {
            "event_date": row["event_date"].isoformat(),
            "weight": float(row["weight"]),
            "description": row.get("description", ""),
        }
        for _, row in qualified_events.iterrows()
    ]

    return {
        "status": "CONFIRMED",
        "signal": "Structural Bid",
        "implication": "The macro story is now anchored by structural capital (Hardware > Sentiment).",
        "execution": asdict(execution),
        "supporting_evidence": supporting_evidence,
    }
