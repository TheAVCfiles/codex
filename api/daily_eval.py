from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

import numpy as np
import pandas as pd
import requests
import yaml

ROOT = Path(__file__).resolve().parent
DATA = ROOT.parent / "data"
CFG = yaml.safe_load((ROOT / "config.yaml").read_text(encoding="utf-8"))
API = "http://localhost:8000"


def atr(df: pd.DataFrame, n: int = 14) -> pd.Series:
    tr = (df["high"] - df["low"]).abs()
    tr2 = (df["high"] - df["close"].shift()).abs()
    tr3 = (df["low"] - df["close"].shift()).abs()
    true_range = pd.concat([tr, tr2, tr3], axis=1).max(axis=1)
    return true_range.ewm(alpha=1 / n, adjust=False).mean()


def label_hits(bars: pd.DataFrame, start_ts: pd.Timestamp, horizon_min: int, k: float):
    if start_ts not in bars.index:
        nearest = bars.index.get_indexer([start_ts], method="nearest")
        if nearest.size == 0 or nearest[0] == -1:
            return None
        start_ts = bars.index[nearest[0]]

    base_close = float(bars.loc[start_ts, "close"])
    base_atr = float(bars.loc[start_ts, "atr"])
    upper = base_close + k * base_atr
    lower = base_close - k * base_atr
    end_ts = start_ts + pd.Timedelta(minutes=horizon_min)
    window = bars[(bars.index > start_ts) & (bars.index <= end_ts)]
    if window.empty:
        return None

    t_up = window[window["high"] >= upper].index.min()
    t_dn = window[window["low"] <= lower].index.min()

    if pd.isna(t_up) and pd.isna(t_dn):
        return {"event": None}
    if pd.isna(t_dn) or (not pd.isna(t_up) and t_up < t_dn):
        return {"event": "rain", "realized_ts": t_up}
    return {"event": "sun", "realized_ts": t_dn}


def brier(probs: list[float], labels: list[int]) -> float:
    p = np.array(probs, dtype=float)
    y = np.array(labels, dtype=float)
    if len(p) == 0:
        return 1.0
    return float(np.mean((p - y) ** 2))


def run() -> None:
    bars = pd.read_parquet(DATA / "eth_1m_tail.parquet")
    bars["time"] = pd.to_datetime(bars["time"], utc=True)
    bars = bars.set_index("time").sort_index()
    bars["atr"] = atr(bars)

    forecast_resp = requests.get(
        f"{API}/forecast/eth",
        params={"anchor_date": datetime.now(timezone.utc).date().isoformat(), "horizon_minutes": CFG["horizon_minutes"]},
        timeout=30,
    )
    forecast_resp.raise_for_status()

    grid = pd.DataFrame(forecast_resp.json()["grid"])
    grid["ts"] = pd.to_datetime(grid["ts"], utc=True)

    yday_start = (datetime.now(timezone.utc) - timedelta(days=1)).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    yday_end = yday_start + timedelta(days=1)
    g = grid[(grid["ts"] >= yday_start) & (grid["ts"] < yday_end)]
    if g.empty:
        return

    rain_probs: list[float] = []
    rain_labels: list[int] = []
    sun_probs: list[float] = []
    sun_labels: list[int] = []
    mae_times: list[float] = []

    for row in g.itertuples(index=False):
        lab = label_hits(bars, row.ts, int(CFG["horizon_minutes"]), float(CFG["upper_band_atr_k"]))
        if lab is None:
            continue

        if lab["event"] is None:
            rain_labels.append(0)
            rain_probs.append(float(row.rain))
            sun_labels.append(0)
            sun_probs.append(float(row.sun))
            continue

        event = str(lab["event"])
        realized_ts = pd.Timestamp(lab["realized_ts"]).to_pydatetime()
        requests.post(
            f"{API}/learn/eth",
            json={
                "event": event,
                "predicted_ts": row.ts.isoformat(),
                "realized_ts": realized_ts.isoformat(),
                "hit": True,
            },
            timeout=30,
        ).raise_for_status()

        rain_labels.append(1 if event == "rain" else 0)
        rain_probs.append(float(row.rain))
        sun_labels.append(1 if event == "sun" else 0)
        sun_probs.append(float(row.sun))
        mae_times.append(abs((realized_ts - row.ts.to_pydatetime()).total_seconds() / 60.0))

    metric = {
        "date": yday_start.date().isoformat(),
        "brier_rain": brier(rain_probs, rain_labels),
        "brier_sun": brier(sun_probs, sun_labels),
        "timing_mae_min": float(np.mean(mae_times)) if mae_times else None,
        "n_points": int(len(g)),
    }

    DATA.mkdir(exist_ok=True)
    with (DATA / "metrics.jsonl").open("a", encoding="utf-8") as f:
        f.write(json.dumps(metric) + "\n")


if __name__ == "__main__":
    run()
