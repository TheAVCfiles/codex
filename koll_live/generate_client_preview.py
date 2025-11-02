"""Utility to render a client-facing preview of the executive report template."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from pathlib import Path

import numpy as np
import pandas as pd

from report_generator import generate_report


def _make_backtest_csv(path: Path) -> None:
    np.random.seed(42)
    periods = 6 * 60  # six hours of minutely data
    index = pd.date_range(
        datetime.now(timezone.utc) - timedelta(minutes=periods),
        periods=periods,
        freq="min",
    )
    price = 100 + np.cumsum(np.random.normal(0, 0.15, size=periods))
    returns = np.random.normal(0.0005, 0.002, size=periods)
    equity = 100_000 * (1 + returns).cumprod()
    df = pd.DataFrame({"price": price, "equity": equity}, index=index)
    df.to_csv(path)


def _make_features_csv(path: Path) -> None:
    np.random.seed(7)
    periods = 6 * 60
    index = pd.date_range(
        datetime.now(timezone.utc) - timedelta(minutes=periods),
        periods=periods,
        freq="min",
    )
    price = 100 + np.cumsum(np.random.normal(0, 0.1, size=periods))
    excitation = np.sin(np.linspace(0, 12, periods)) + np.random.normal(0, 0.2, size=periods)
    df = pd.DataFrame({"price": price, "EI": excitation}, index=index)
    df.to_csv(path)


def _make_sweep_csv(path: Path) -> None:
    np.random.seed(5)
    records = []
    for low_q in (0.1, 0.2, 0.3, 0.4, 0.5):
        for high_q in (0.6, 0.7, 0.8, 0.9):
            cooldown = np.random.choice([2, 4, 6])
            sharpe = np.random.normal(1.2, 0.2)
            records.append(
                {
                    "low_q": round(low_q, 2),
                    "high_q": round(high_q, 2),
                    "cooldown": cooldown,
                    "sharpe": sharpe,
                }
            )
    pd.DataFrame(records).to_csv(path, index=False)


def _make_walkforward_csv(path: Path) -> None:
    folds = [
        {"fold": f"Fold {i}", "test_sharpe": 0.8 + 0.1 * i}
        for i in range(1, 5)
    ]
    pd.DataFrame(folds).to_csv(path, index=False)


def _make_transits_csv(path: Path) -> None:
    start = datetime.now(timezone.utc) - timedelta(days=2)
    rows = []
    for offset, label in enumerate(
        [
            "Mercury sextile Jupiter",
            "Moon trine Mars",
            "Venus opposition Saturn",
        ]
    ):
        rows.append(
            {
                "start": start + timedelta(hours=offset * 6),
                "end": start + timedelta(hours=offset * 6 + 4),
                "label": label,
            }
        )
    pd.DataFrame(rows).to_csv(path, index=False)


def build_preview(output_dir: Path | None = None) -> Path:
    base_dir = Path(__file__).resolve().parent
    preview_root = output_dir or base_dir / "reports" / "client_preview"
    preview_root.mkdir(parents=True, exist_ok=True)

    backtest_csv = preview_root / "backtest.csv"
    features_csv = preview_root / "features.csv"
    sweep_csv = preview_root / "sweep_results.csv"
    walk_csv = preview_root / "walk_results.csv"
    transits_csv = preview_root / "transits.csv"

    _make_backtest_csv(backtest_csv)
    _make_features_csv(features_csv)
    _make_sweep_csv(sweep_csv)
    _make_walkforward_csv(walk_csv)
    _make_transits_csv(transits_csv)

    output_html = preview_root / "client_preview.html"

    generate_report(
        feat_path=str(features_csv),
        backtest_path=str(backtest_csv),
        sweep_path=str(sweep_csv),
        walkforward_path=str(walk_csv),
        output_html=str(output_html),
        output_pdf=None,
        title="KOLL Strategy — Client Preview",
        narrative=True,
        astrology_enabled=True,
        transits_csv=str(transits_csv),
    )

    return output_html


def main() -> None:
    html_path = build_preview()
    print(f"Client preview generated at {html_path}")


if __name__ == "__main__":
    main()
