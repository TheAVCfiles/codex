from __future__ import annotations

from datetime import datetime

from pathlib import Path

import yaml
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from .forecast import generate_forecast
from .learn import LearnEvent, update_state

CFG = yaml.safe_load((Path(__file__).resolve().parent / "config.yaml").read_text(encoding="utf-8"))

app = FastAPI(title="Fortress Forecast API", version="1.0.0")


class LearnRequest(BaseModel):
    event: str = Field(pattern="^(rain|sun)$")
    predicted_ts: datetime
    realized_ts: datetime
    hit: bool


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/forecast/eth")
def forecast_eth(anchor_date: str = "2026-02-12", horizon_minutes: int | None = None):
    try:
        fc = generate_forecast(anchor_date=anchor_date, horizon_minutes=horizon_minutes)
        return {
            "symbol": fc.symbol,
            "generated_at_utc": fc.generated_at_utc,
            "grid": fc.grid,
            "rain_windows": fc.rain_windows,
            "sun_windows": fc.sun_windows,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"forecast failed: {exc}") from exc


@app.post("/learn/eth")
def learn_eth(payload: LearnRequest):
    try:
        state = update_state(
            LearnEvent(
                event=payload.event,
                predicted_ts=payload.predicted_ts,
                realized_ts=payload.realized_ts,
                hit=payload.hit,
            ),
            ewma_alpha=float(CFG.get("learn_ewma_alpha", 0.2)),
        )
        return {"ok": True, "state": state}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"learn failed: {exc}") from exc
