from __future__ import annotations

from datetime import datetime
from pathlib import Path

import yaml
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from .forecast import generate_forecast
from .learn import LearnEvent, update_state
from .tempo import forecast_tempo

CFG = yaml.safe_load((Path(__file__).resolve().parent / "config.yaml").read_text(encoding="utf-8"))

app = FastAPI(title="Fortress Forecast API", version="1.1.0")


class LearnRequest(BaseModel):
    event: str = Field(pattern="^(rain|sun|lightning)$")
    predicted_ts: datetime
    realized_ts: datetime
    hit: bool
    social_peak_ts: datetime | None = None


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
            "lightning_windows": fc.lightning_windows,
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
                social_peak_ts=payload.social_peak_ts,
            ),
            ewma_alpha=float(CFG.get("learn_ewma_alpha", 0.2)),
            social_ewma_alpha=float(CFG.get("social_timing_ewma_alpha", 0.2)),
        )
        return {"ok": True, "state": state}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"learn failed: {exc}") from exc


@app.get("/api/forecast-tempo")
def forecast_tempo_endpoint(days: int = 30):
    """Expose SARIMA/fallback tempo projection for the rhythm machine."""
    try:
        result = forecast_tempo(days=days)
        return {"forecasted_tempo": result.forecasted_tempo, "model": result.model}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"tempo forecast failed: {exc}") from exc


@app.get("/forecast-tempo")
def forecast_tempo_endpoint_compat(days: int = 30):
    # compatibility alias used by some clients
    return forecast_tempo_endpoint(days=days)
