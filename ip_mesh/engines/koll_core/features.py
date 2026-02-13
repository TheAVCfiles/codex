"""Feature engineering primitives for KOLL."""

from __future__ import annotations

from statistics import mean
from typing import Any, Dict, Iterable, List


def compute_features(dataset: Iterable[Dict[str, Any]], config: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Compute rolling features specified by the config.

    The function currently supports simple average momentum (``am_window``) and
    volatility momentum windows (``vm_short``/``vm_long``/``vm_norm``).
    """

    am_window = int(config.get("am_window", 30))
    vm_short = int(config.get("vm_short", 10))
    vm_long = int(config.get("vm_long", 50))
    vm_norm = int(config.get("vm_norm", 240))

    history: List[Dict[str, Any]] = []
    enriched: List[Dict[str, Any]] = []

    for row in dataset:
        history.append(row)
        if len(history) > vm_norm:
            history.pop(0)

        prices = [entry.get("price") for entry in history if isinstance(entry.get("price"), (int, float))]
        am_slice = prices[-am_window:]
        vm_short_slice = prices[-vm_short:]
        vm_long_slice = prices[-vm_long:]

        features = dict(row)
        if am_slice:
            features["avg_momentum"] = mean(am_slice)
        if vm_short_slice and vm_long_slice:
            features["vol_momentum_ratio"] = (mean(vm_short_slice) / mean(vm_long_slice)) if mean(vm_long_slice) else 0.0
        features["vol_reference"] = mean(prices[-vm_norm:]) if prices else None
        enriched.append(features)

    return enriched
