from __future__ import annotations

from datetime import datetime, timedelta
from pathlib import Path

import pandas as pd

from check_structural_bid_confirmation import check_structural_bid_confirmation

# CONFIG
ANCHOR_CALENDAR = pd.DataFrame(
    {
        "anchor_date": [datetime(2026, 2, 12), datetime(2026, 5, 15)],
        "description": ["Saturn/Uranus Conjunction", "Q2 Policy Update"],
    }
)

LEDGER_CSV = Path("structural_ledger.csv")
BACKTEST_CSV = Path("backtest_results.csv")


def detect_narrative_anchors(calendar_df: pd.DataFrame, lookback_days: int = 365) -> pd.DataFrame:
    """Return anchors in recent history or the upcoming 90-day horizon."""
    today = datetime.today()
    start = today - timedelta(days=lookback_days)
    end = today + timedelta(days=90)
    return calendar_df[
        (calendar_df["anchor_date"] >= start) & (calendar_df["anchor_date"] <= end)
    ].sort_values(by="anchor_date")


def backtest_anchors(
    calendar_df: pd.DataFrame,
    ledger_path: str | Path,
    output_path: str | Path = BACKTEST_CSV,
) -> pd.DataFrame:
    """Run structural confirmation over all anchors and persist a CSV artifact."""
    ledger_df = pd.read_csv(ledger_path)
    results: list[dict[str, object]] = []

    for _, anchor in calendar_df.iterrows():
        signal = check_structural_bid_confirmation(ledger_df, anchor["anchor_date"])
        results.append(
            {
                "anchor_date": pd.Timestamp(anchor["anchor_date"]).isoformat(),
                "anchor_description": anchor.get("description", ""),
                "status": signal.get("status", "UNKNOWN"),
                "signal": signal.get("signal", ""),
                "implication": signal.get("implication", ""),
            }
        )

    backtest_df = pd.DataFrame(results)
    backtest_df.to_csv(output_path, index=False)
    return backtest_df


if __name__ == "__main__":
    anchors = detect_narrative_anchors(ANCHOR_CALENDAR)
    print("Detected Anchors:")
    print(anchors)

    if LEDGER_CSV.exists():
        backtest = backtest_anchors(anchors, LEDGER_CSV)
        print("Backtest Results:")
        print(backtest)
    else:
        print(f"Ledger CSV not found at {LEDGER_CSV}; skipping backtest.")
