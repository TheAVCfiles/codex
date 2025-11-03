"""Toy implementation of the Koll strategy stack."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict
import json

import yaml

from .features import feature_engineering


@dataclass
class StrategyConfig:
    dataset: Path
    vm_short: int
    vm_long: int
    vm_norm: int
    am_window: int
    ei_weights: tuple[float, float]
    low_quantile: float
    high_quantile: float
    risk_breaker_dd: float


class KollStrategy:
    """Represents a parameterised strategy used by the mesh demo."""

    def __init__(self, config: StrategyConfig):
        self.config = config

    @classmethod
    def load_config(cls, path: Path) -> StrategyConfig:
        data = yaml.safe_load(Path(path).read_text(encoding="utf-8"))
        return StrategyConfig(
            dataset=Path(data["data"]["csv"]),
            vm_short=int(data["parameters"]["vm_short"]),
            vm_long=int(data["parameters"]["vm_long"]),
            vm_norm=int(data["parameters"]["vm_norm"]),
            am_window=int(data["parameters"]["am_window"]),
            ei_weights=tuple(data["parameters"]["ei_weights"]),
            low_quantile=float(data["parameters"]["quantiles"]["low"]),
            high_quantile=float(data["parameters"]["quantiles"]["high"]),
            risk_breaker_dd=float(data["risk"]["max_drawdown"]),
        )

    @classmethod
    def from_config(cls, config: StrategyConfig) -> "KollStrategy":
        return cls(config)

    def evaluate(self, dataset) -> Dict[str, Any]:
        engineered = feature_engineering(dataset, self.config)
        momentum = engineered["price"].pct_change(self.config.vm_short).mean()
        value = engineered["price"].pct_change(self.config.vm_long).mean()
        ei = sum(w * m for w, m in zip(self.config.ei_weights, (momentum, value)))
        return {
            "expected_information": ei,
            "momentum_score": momentum,
            "value_score": value,
            "config_hash": self._hash_config(),
        }

    def _hash_config(self) -> str:
        payload = {
            "vm_short": self.config.vm_short,
            "vm_long": self.config.vm_long,
            "vm_norm": self.config.vm_norm,
            "am_window": self.config.am_window,
            "ei_weights": self.config.ei_weights,
            "quantiles": {
                "low": self.config.low_quantile,
                "high": self.config.high_quantile,
            },
            "risk_breaker_dd": self.config.risk_breaker_dd,
        }
        return json.dumps(payload, sort_keys=True)
