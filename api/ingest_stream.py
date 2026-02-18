from __future__ import annotations

import asyncio
import json
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd
import websockets
import yaml

try:
    from .ws import BINANCE_TRADE_WS
except ImportError:  # pragma: no cover - script execution fallback
    from ws import BINANCE_TRADE_WS

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
DATA.mkdir(exist_ok=True)

CFG = yaml.safe_load((Path(__file__).resolve().parent / "config.yaml").read_text(encoding="utf-8"))
HIST_DAYS = int(CFG.get("minute_history_days", 60))
TICKS_PATH = DATA / "eth_ticks.parquet"
BARS_PATH = DATA / "eth_1m_tail.parquet"


async def main() -> None:
    buf: list[tuple[int, float, float]] = []
    last_flush = datetime.now(timezone.utc)

    async with websockets.connect(BINANCE_TRADE_WS) as ws:
        while True:
            msg = await ws.recv()
            data = json.loads(msg)
            buf.append((int(data["T"]), float(data["p"]), float(data["q"])))

            if (datetime.now(timezone.utc) - last_flush).total_seconds() < 2:
                continue

            last_flush = datetime.now(timezone.utc)
            if not buf:
                continue

            ticks = pd.DataFrame(buf, columns=["ts", "price", "qty"])
            buf.clear()
            ticks["time"] = pd.to_datetime(ticks["ts"], unit="ms", utc=True)

            if TICKS_PATH.exists():
                ticks = pd.concat([pd.read_parquet(TICKS_PATH), ticks], ignore_index=True)
            ticks = ticks[ticks["time"] >= pd.Timestamp.now(tz="UTC") - pd.Timedelta(days=1)]
            ticks.to_parquet(TICKS_PATH, index=False)

            bars = (
                ticks.set_index("time")
                .resample("1min")
                .agg(
                    open=("price", "first"),
                    high=("price", "max"),
                    low=("price", "min"),
                    close=("price", "last"),
                    vol=("qty", "sum"),
                )
                .dropna()
                .reset_index()
            )

            if BARS_PATH.exists():
                bars = (
                    pd.concat([pd.read_parquet(BARS_PATH), bars], ignore_index=True)
                    .drop_duplicates(subset=["time"], keep="last")
                    .sort_values("time")
                )

            cutoff = pd.Timestamp.now(tz="UTC") - pd.Timedelta(days=HIST_DAYS)
            bars = bars[bars["time"] >= cutoff]
            bars.to_parquet(BARS_PATH, index=False)


if __name__ == "__main__":
    asyncio.run(main())
