#!/usr/bin/env python3
# /ip_mesh/engines/koll_core/update_predictive_levels.py
"""
Update Predictive Levels
------------------------
Computes institutional-grade reference levels from OHLCV (and optionally EI)
and writes:
  - ./reports/predictive_levels.json  (latest snapshot)
  - ./reports/predictive_levels.csv   (rolling timeseries)
  - ./reports/predictive_levels.png   (quick visual)

Inputs:
  --config   path to YAML (defaults to engines/koll_core/configs/koll_config.yaml)
  --input    CSV with columns: time,ticker,open,high,low,close,volume[,ei]
            If omitted and mode==api, implement your adapter in data_adapters.py.

Designed to align with KOLL quantile gates (low/high) & feature windows
(AM/VM) already present in your configs 【koll_config.yaml: features/strategy】.

Author: DTG / KOLL
"""

from __future__ import annotations
import argparse, json, math, os, sys, time, warnings
from dataclasses import dataclass
from typing import Optional, Dict, Any, Tuple, List

warnings.filterwarnings("ignore")
import pandas as pd
import numpy as np
import yaml
from datetime import datetime
import matplotlib.pyplot as plt  # no style set; keep defaults for portability

# ---------------------------
# Config & Data Structures
# ---------------------------

@dataclass
class StrategyParams:
    low_q: float = 0.60
    high_q: float = 0.90
    am_window: int = 30
    vm_short: int = 10
    vm_long: int = 50
    vm_norm: int = 240

@dataclass
class IOPaths:
    outputs_folder: str = "./reports"
    save_csv: bool = True
    save_plots: bool = True

@dataclass
class RunConfig:
    mode: str = "csv"            # "csv" | "api"
    csv_path: Optional[str] = None
    symbol: str = "DEMO"
    strategy: StrategyParams = StrategyParams()
    io: IOPaths = IOPaths()

# ---------------------------
# Utilities
# ---------------------------

def _ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def load_yaml_config(path: str) -> RunConfig:
    with open(path, "r", encoding="utf-8") as f:
        raw = yaml.safe_load(f)

    # Map KOLL config into this script (names aligned to your YAML) 【koll_config.yaml】:
    # features.am_window, features.vm_short, features.vm_long, features.vm_norm
    # strategy.low_quantile, strategy.high_quantile, outputs.folder 【】【】
    features = raw.get("features", {})
    strategy = raw.get("strategy", {})
    outputs  = raw.get("outputs", {})

    cfg = RunConfig(
        mode=raw.get("data", {}).get("mode", "csv"),
        csv_path=raw.get("data", {}).get("csv_path"),
        symbol=raw.get("data", {}).get("symbol", "DEMO"),
        strategy=StrategyParams(
            low_q=float(strategy.get("low_quantile", 0.60)),
            high_q=float(strategy.get("high_quantile", 0.90)),
            am_window=int(features.get("am_window", 30)),
            vm_short=int(features.get("vm_short", 10)),
            vm_long=int(features.get("vm_long", 50)),
            vm_norm=int(features.get("vm_norm", 240)),
        ),
        io=IOPaths(
            outputs_folder=outputs.get("folder", "./outputs"),
            save_csv=bool(outputs.get("save_csv", True)),
            save_plots=bool(outputs.get("save_plots", True)),
        ),
    )
    return cfg


def load_data_csv(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    # Accept flexible column names
    for c in ("time","timestamp","date"):
        if c in df.columns:
            df["time"] = pd.to_datetime(df[c])
            break
    if "time" not in df.columns:
        raise ValueError("CSV must have time/timestamp/date column.")
    # Required price columns
    for c in ("open","high","low","close"):
        if c not in df.columns:
            raise ValueError(f"Missing column: {c}")
    if "volume" not in df.columns:
        df["volume"] = 0.0
    df = df.sort_values("time").reset_index(drop=True)
    return df

# ---------------------------
# Level Calculations
# ---------------------------

def vwap(close: pd.Series, volume: pd.Series) -> pd.Series:
    pv = (close * volume).cumsum()
    vv = volume.cumsum().replace(0, np.nan)
    return pv / vv


def atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
    high, low, close = df["high"], df["low"], df["close"]
    prev_close = close.shift(1)
    tr = pd.concat([
        (high - low),
        (high - prev_close).abs(),
        (low - prev_close).abs()
    ], axis=1).max(axis=1)
    return tr.ewm(alpha=1/period, adjust=False).mean()


def donchian(df: pd.DataFrame, window: int = 20) -> Tuple[pd.Series, pd.Series]:
    upper = df["high"].rolling(window).max()
    lower = df["low"].rolling(window).min()
    return upper, lower


def classic_pivots(df: pd.DataFrame) -> pd.DataFrame:
    # Daily pivots from previous session (assumes time ascending)
    g = df.set_index("time").copy()
    g["date"] = g.index.date
    prev = g.groupby("date").agg({"high":"max","low":"min","close":"last"}).shift(1)
    P = (prev["high"] + prev["low"] + prev["close"]) / 3
    R1 = 2*P - prev["low"]
    S1 = 2*P - prev["high"]
    R2 = P + (prev["high"] - prev["low"])
    S2 = P - (prev["high"] - prev["low"])
    piv = pd.DataFrame({"P":P,"R1":R1,"S1":S1,"R2":R2,"S2":S2}).reset_index(drop=False).rename(columns={"date":"pivot_date"})
    return piv


def rolling_quantile_bands(series: pd.Series, low_q: float, high_q: float, window: int) -> Tuple[pd.Series, pd.Series]:
    lq = series.rolling(window).quantile(low_q)
    hq = series.rolling(window).quantile(high_q)
    return lq, hq


def simple_volume_profile(close: pd.Series, volume: pd.Series, bins: int = 50) -> Dict[str, float]:
    # Histogram on price with volume weights (POC/VAH/VAL approx)
    pmin, pmax = float(close.min()), float(close.max())
    if not math.isfinite(pmin) or not math.isfinite(pmax) or pmin == pmax:
        return {"poc": float(close.iloc[-1]), "vah": float(close.iloc[-1]), "val": float(close.iloc[-1])}
    hist, edges = np.histogram(close, bins=bins, range=(pmin, pmax), weights=volume)
    idx = hist.argmax()
    poc = float((edges[idx] + edges[idx+1]) / 2)
    # Value area ~ 70% around POC
    total = hist.sum()
    if total <= 0:
        return {"poc": poc, "vah": poc, "val": poc}
    target = 0.7 * total
    left = right = idx
    acc = hist[idx]
    while acc < target and (left > 0 or right < len(hist) - 1):
        # expand toward the larger of adjacent bins
        lnext = hist[left-1] if left > 0 else -1
        rnext = hist[right+1] if right < len(hist)-1 else -1
        if rnext >= lnext and right < len(hist)-1:
            right += 1; acc += hist[right]
        elif left > 0:
            left -= 1; acc += hist[left]
        else:
            break
    val = float(edges[left])
    vah = float(edges[right+1])
    return {"poc": poc, "vah": vah, "val": val}


def local_extrema_levels(series: pd.Series, lookback: int = 10) -> Tuple[pd.Series, pd.Series]:
    # Naive peak/trough finder (no SciPy)
    s = series.values
    highs = np.full_like(s, np.nan, dtype=float)
    lows  = np.full_like(s, np.nan, dtype=float)
    for i in range(lookback, len(s)-lookback):
        window = s[i-lookback:i+lookback+1]
        if s[i] == window.max(): highs[i] = s[i]
        if s[i] == window.min(): lows[i]  = s[i]
    return pd.Series(highs, index=series.index), pd.Series(lows, index=series.index)

# ---------------------------
# Main compute
# ---------------------------

def compute_levels(df: pd.DataFrame, cfg: RunConfig) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    out = df.copy()
    out["vwap"] = vwap(out["close"], out["volume"])
    out["atr14"] = atr(out, 14)
    dU, dL = donchian(out, window=max(20, cfg.strategy.vm_long))
    out["donchian_hi"] = dU
    out["donchian_lo"] = dL

    # Quantile bands on close; if EI exists, also provide EI bands
    lq, hq = rolling_quantile_bands(out["close"], cfg.strategy.low_q, cfg.strategy.high_q, window=cfg.strategy.vm_norm)
    out["qband_low"] = lq
    out["qband_high"] = hq

    if "ei" in out.columns:
        ei_lq, ei_hq = rolling_quantile_bands(out["ei"], cfg.strategy.low_q, cfg.strategy.high_q, window=cfg.strategy.am_window)
        out["ei_low"] = ei_lq
        out["ei_high"] = ei_hq

    # Daily pivots (aligned on date)
    piv = classic_pivots(out[["time","high","low","close"]])
    out = out.merge(piv, left_on=out["time"].dt.date, right_on=piv["pivot_date"], how="left").drop(columns=["key_0","pivot_date"], errors="ignore")

    # Volume profile snapshot on trailing window
    tail = out.tail(max(500, cfg.strategy.vm_norm))
    vp = simple_volume_profile(tail["close"], tail["volume"], bins=60)

    # Local extrema as discretionary S/R hints
    highs, lows = local_extrema_levels(out["close"], lookback=10)
    out["loc_high"] = highs
    out["loc_low"]  = lows

    # Snapshot (latest)
    last = out.iloc[-1]
    snapshot = {
        "asof": last["time"].isoformat() if isinstance(last["time"], pd.Timestamp) else str(last["time"]),
        "symbol": cfg.symbol,
        "close": round(float(last["close"]), 6),
        "vwap": round(float(last.get("vwap", np.nan)), 6),
        "atr14": round(float(last.get("atr14", np.nan)), 6),
        "donchian_hi": round(float(last.get("donchian_hi", np.nan)), 6),
        "donchian_lo": round(float(last.get("donchian_lo", np.nan)), 6),
        "qband_low": round(float(last.get("qband_low", np.nan)), 6),
        "qband_high": round(float(last.get("qband_high", np.nan)), 6),
        "pivots": {
            "P": round(float(last.get("P", np.nan)), 6),
            "R1": round(float(last.get("R1", np.nan)), 6),
            "S1": round(float(last.get("S1", np.nan)), 6),
            "R2": round(float(last.get("R2", np.nan)), 6),
            "S2": round(float(last.get("S2", np.nan)), 6),
        },
        "volume_profile": {k: round(float(v), 6) for k,v in vp.items()},
    }
    if "ei" in out.columns:
        snapshot["ei_low"]  = round(float(last.get("ei_low", np.nan)), 6)
        snapshot["ei_high"] = round(float(last.get("ei_high", np.nan)), 6)

    return out, snapshot


def plot_levels(df: pd.DataFrame, cfg: RunConfig, outpath: str) -> None:
    fig, ax = plt.subplots(figsize=(11, 6))
    ax.plot(df["time"], df["close"], label="Close", linewidth=1.3)
    for c, label in [("vwap","VWAP"), ("qband_low","Q-Low"), ("qband_high","Q-High"),
                     ("donchian_hi","Donch Hi"), ("donchian_lo","Donch Lo")]:
        if c in df.columns:
            ax.plot(df["time"], df[c], label=label, alpha=0.9)
    # Mark last pivots if present
    for p in ("P","R1","S1","R2","S2"):
        if p in df.columns:
            ax.plot(df["time"], df[p], label=p, linestyle="--", linewidth=0.8, alpha=0.6)
    ax.set_title(f"Predictive Levels · {cfg.symbol}")
    ax.legend(loc="best", fontsize=8)
    ax.grid(True, alpha=0.2)
    fig.tight_layout()
    fig.savefig(outpath, dpi=144)
    plt.close(fig)

# ---------------------------
# CLI
# ---------------------------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", default="engines/koll_core/configs/koll_config.yaml")
    ap.add_argument("--input", default=None, help="CSV with time,open,high,low,close,volume[,ei]")
    ap.add_argument("--output-dir", default=None, help="Override report dir from config.outputs.folder")
    args = ap.parse_args()

    cfg = load_yaml_config(args.config)
    if args.output_dir:
        cfg.io.outputs_folder = args.output_dir
    _ensure_dir(cfg.io.outputs_folder)

    # Load data
    if cfg.mode == "csv":
        csv_path = args.input or cfg.csv_path
        if not csv_path:
            raise ValueError("CSV path not provided. Use --input or set data.csv_path in config.")
        df = load_data_csv(csv_path)
    else:
        # OPTIONAL: implement API mode using your data_adapters to keep parity with KOLL
        # from data_adapters import load_api_minute_bars
        # df = load_api_minute_bars(...)
        raise NotImplementedError("API mode not implemented in this script.")

    # Compute & persist
    full, snap = compute_levels(df, cfg)

    levels_csv = os.path.join(cfg.io.outputs_folder, "predictive_levels.csv")
    levels_json = os.path.join(cfg.io.outputs_folder, "predictive_levels.json")
    levels_png = os.path.join(cfg.io.outputs_folder, "predictive_levels.png")

    if cfg.io.save_csv:
        full.to_csv(levels_csv, index=False)
    with open(levels_json, "w", encoding="utf-8") as f:
        json.dump(snap, f, indent=2)

    if cfg.io.save_plots:
        plot_levels(full, cfg, levels_png)

    print(f"[OK] predictive levels → {levels_json}")
    if cfg.io.save_csv:  print(f"[OK] timeseries      → {levels_csv}")
    if cfg.io.save_plots:print(f"[OK] plot            → {levels_png}")


if __name__ == "__main__":
    main()
