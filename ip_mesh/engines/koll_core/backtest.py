"""KOLL backtest harness.

This module loads a strategy configuration, ingests historical
feature data, and produces a lightweight report artefact for the
mesh builder demo. The implementation is intentionally minimal so
that downstream agents can replace it with a production grade
pipeline while still preserving expected entrypoints.
"""
from __future__ import annotations

from pathlib import Path
import json

from .strategy_koll import KollStrategy
from .data_adapters import load_price_frame


def run_backtest(config_path: Path) -> dict:
    """Run a toy backtest returning summary metrics.

    Parameters
    ----------
    config_path:
        Path to the YAML configuration described in ``configs/koll_config.yaml``.
    """
    config = KollStrategy.load_config(config_path)
    dataset = load_price_frame(config.dataset)
    strategy = KollStrategy.from_config(config)
    results = strategy.evaluate(dataset)

    report_dir = Path(__file__).resolve().parent / "reports"
    report_dir.mkdir(exist_ok=True)
    summary_path = report_dir / "backtest_summary.json"
    summary_path.write_text(json.dumps(results, indent=2), encoding="utf-8")
    return results


if __name__ == "__main__":
    config_file = Path(__file__).resolve().parent / "configs" / "koll_config.yaml"
    metrics = run_backtest(config_file)
    print(json.dumps(metrics, indent=2))
