"""Signal generation and evaluation for the KOLL strategy."""

from __future__ import annotations

from typing import Any, Dict, Iterable, List


def generate_signals(features: Iterable[Dict[str, Any]], config: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate EI signals based on feature thresholds."""

    low = float(config.get("low_quantile", 0.6))
    high = float(config.get("high_quantile", 0.9))
    ei_weights = config.get("ei_weights", [0.6, 0.4])

    signals: List[Dict[str, Any]] = []
    for row in features:
        avg_momentum = row.get("avg_momentum") or 0.0
        vol_ratio = row.get("vol_momentum_ratio") or 0.0
        ei_score = ei_weights[0] * avg_momentum + ei_weights[1] * vol_ratio
        bucket = "neutral"
        if ei_score <= low:
            bucket = "accumulate"
        elif ei_score >= high:
            bucket = "distribute"
        signals.append({"ei": ei_score, "bucket": bucket, **row})
    return signals


def evaluate_signals(signals: Iterable[Dict[str, Any]], risk: Dict[str, Any], outputs: Dict[str, Any]) -> None:
    """Evaluate the generated signals and emit simple reports.

    This placeholder writes CSV summaries and prints a human friendly report so
    downstream automations can be validated without full quant infra.
    """

    breaker = float(risk.get("risk_breaker_dd", 0.1))
    threshold = breaker * 100
    summary_lines = ["timestamp,ei,bucket"]
    triggered = 0
    for row in signals:
        timestamp = row.get("time", "n/a")
        ei_score = float(row.get("ei", 0.0))
        bucket = row.get("bucket", "neutral")
        summary_lines.append(f"{timestamp},{ei_score:.4f},{bucket}")
        if abs(ei_score) > threshold:
            triggered += 1

    output_dir = outputs.get("path", "engines/koll_core/outputs")
    import pathlib

    out_dir_path = pathlib.Path(__file__).resolve().parents[0] / "outputs"
    out_dir_path.mkdir(exist_ok=True)
    (out_dir_path / "signals.csv").write_text("\n".join(summary_lines), encoding="utf-8")
    report = f"Signals evaluated. Risk breaker threshold={threshold:.2f}. triggers={triggered}"
    print(report)
