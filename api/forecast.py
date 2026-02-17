from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
import yaml

from .learn import calibrated_probability, load_state

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
BARS_PATH = DATA_DIR / "eth_1m_tail.parquet"
CFG_PATH = Path(__file__).resolve().parent / "config.yaml"


@dataclass
class ForecastResult:
    symbol: str
    generated_at_utc: str
    grid: list[dict[str, Any]]
    rain_windows: list[str]
    sun_windows: list[str]
    lightning_windows: list[str]


def _atr(df: pd.DataFrame, n: int = 14) -> pd.Series:
    tr = (df["high"] - df["low"]).abs()
    tr2 = (df["high"] - df["close"].shift()).abs()
    tr3 = (df["low"] - df["close"].shift()).abs()
    true_range = pd.concat([tr, tr2, tr3], axis=1).max(axis=1)
    return true_range.ewm(alpha=1 / n, adjust=False).mean()


def _load_cfg() -> dict[str, Any]:
    return yaml.safe_load(CFG_PATH.read_text(encoding="utf-8"))


def _synthetic_grid(anchor_date: str, horizon_minutes: int) -> pd.DataFrame:
    start = pd.Timestamp(anchor_date, tz="UTC")
    idx = pd.date_range(start=start, periods=min(horizon_minutes, 24 * 60), freq="1min")
    x = np.linspace(0, 6 * np.pi, len(idx))
    rain = 0.5 + 0.2 * np.sin(x)
    sun = 0.5 + 0.2 * np.cos(x)
    lightning = np.abs(np.sin(x * 1.7 + 1.1)) * 0.7
    social_tilt = np.sin(x * 0.9)
    return pd.DataFrame({
        "ts": idx,
        "rain": rain.clip(0.0, 1.0),
        "sun": sun.clip(0.0, 1.0),
        "lightning": lightning.clip(0.0, 1.0),
        "social_tilt": social_tilt,
    })


def generate_forecast(anchor_date: str, horizon_minutes: int | None = None) -> ForecastResult:
    cfg = _load_cfg()
    horizon = int(horizon_minutes or cfg["horizon_minutes"])

    if BARS_PATH.exists():
        bars = pd.read_parquet(BARS_PATH)
        bars["time"] = pd.to_datetime(bars["time"], utc=True)
        bars = bars.sort_values("time").tail(24 * 60)
        bars["atr"] = _atr(bars)
        grid = bars[["time"]].rename(columns={"time": "ts"}).copy()
        if grid.empty:
            grid = _synthetic_grid(anchor_date, horizon)
        else:
            noise = np.linspace(0, 2 * np.pi, len(grid))
            tri_alpha = 0.5 + 0.15 * np.sin(noise)
            social_tilt = np.sin(noise * 1.3)
            lightning = (np.abs(np.gradient(tri_alpha)) * 6.0 + np.abs(social_tilt) * 0.4).clip(0.0, 1.0)
            grid["rain"] = tri_alpha.clip(0.0, 1.0)
            grid["sun"] = (0.5 + 0.15 * np.cos(noise)).clip(0.0, 1.0)
            grid["social_tilt"] = social_tilt
            grid["lightning"] = lightning
    else:
        grid = _synthetic_grid(anchor_date, horizon)

    state = load_state()
    rain_shift = float(state.get("rain", {}).get("shift_minutes", 0.0))
    sun_shift = float(state.get("sun", {}).get("shift_minutes", 0.0))
    lightning_shift = float(state.get("lightning", {}).get("shift_minutes", 0.0))

    grid["rain"] = grid["rain"].map(lambda p: calibrated_probability("rain", float(p)))
    grid["sun"] = grid["sun"].map(lambda p: calibrated_probability("sun", float(p)))
    grid["lightning"] = grid["lightning"].map(lambda p: calibrated_probability("lightning", float(p)))
    grid["rain_ts"] = grid["ts"] + pd.to_timedelta(rain_shift, unit="m")
    grid["sun_ts"] = grid["ts"] + pd.to_timedelta(sun_shift, unit="m")
    grid["lightning_ts"] = grid["ts"] + pd.to_timedelta(lightning_shift, unit="m")

    rain_windows = [ts.isoformat() for ts in grid.loc[grid["rain"] >= 0.70, "rain_ts"].head(5)]
    sun_windows = [ts.isoformat() for ts in grid.loc[grid["sun"] >= 0.70, "sun_ts"].head(5)]
    lightning_windows = [ts.isoformat() for ts in grid.loc[grid["lightning"] >= float(cfg.get("lightning_threshold", 0.75)), "lightning_ts"].head(5)]

    return ForecastResult(
        symbol=cfg["symbol"],
        generated_at_utc=pd.Timestamp.now(tz="UTC").isoformat(),
        grid=[
            {
                "ts": row.ts.isoformat(),
                "rain": float(row.rain),
                "sun": float(row.sun),
                "lightning": float(row.lightning),
                "social_tilt": float(row.social_tilt),
            }
            for row in grid.itertuples()
        ],
        rain_windows=rain_windows,
        sun_windows=sun_windows,
        lightning_windows=lightning_windows,
    )


def kelly_fraction(p: float, rr: float = 1.0, clip: float = 0.25) -> float:
    frac = p - (1.0 - p) / rr
    return max(0.0, min(clip, frac))


def size_notional(account_equity: float, p_rain: float, *, max_pct: float = 0.015) -> float:
    base = account_equity * max_pct
    return base * kelly_fraction(p_rain, rr=1.2, clip=0.25)
