from __future__ import annotations

import os
import shutil
from datetime import datetime
from pathlib import Path

import pandas as pd
import yaml
from dateutil import parser as date_parser
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from .forecast import generate_forecast
from .learn import LearnEvent, update_state
from .tempo import forecast_tempo

CFG = yaml.safe_load((Path(__file__).resolve().parent / "config.yaml").read_text(encoding="utf-8"))

app = FastAPI(title="Fortress Forecast API", version="1.1.0")

FORENSIC_MASTER_XLSX = Path(os.getenv("FORENSIC_MASTER_XLSX", Path(__file__).resolve().parent / "case_master.xlsx"))
FORENSIC_SESSIONS_DIR = Path(
    os.getenv("FORENSIC_SESSIONS_DIR", Path(__file__).resolve().parent / "sessions")
)


class LearnRequest(BaseModel):
    event: str = Field(pattern="^(rain|sun|lightning)$")
    predicted_ts: datetime
    realized_ts: datetime
    hit: bool
    social_peak_ts: datetime | None = None


class SessionNameRequest(BaseModel):
    name: str


def _read_sheet_or_empty(sheet_name: str) -> pd.DataFrame:
    if not FORENSIC_MASTER_XLSX.exists():
        return pd.DataFrame()

    try:
        return pd.read_excel(FORENSIC_MASTER_XLSX, sheet_name=sheet_name)
    except ValueError:
        return pd.DataFrame()


def _extract_iso_date(text: str) -> str | None:
    if not isinstance(text, str) or not text.strip():
        return None
    try:
        return date_parser.parse(text, fuzzy=True, ignoretz=True).isoformat()
    except (ValueError, TypeError, OverflowError):
        return None


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


@app.get("/api/timeline")
def get_timeline():
    df_raw = _read_sheet_or_empty("Raw_Entities")
    df_events = _read_sheet_or_empty("Events")

    events: list[dict[str, str | int | None]] = []

    for _, row in df_raw.iterrows():
        raw_text = str(row.get("raw_text", ""))
        context = str(row.get("context_snippet", ""))

        candidate = None
        if row.get("type") == "Date":
            candidate = _extract_iso_date(raw_text)

        if not candidate:
            candidate = _extract_iso_date(raw_text) or _extract_iso_date(context)

        if candidate:
            events.append(
                {
                    "date": candidate,
                    "entity": raw_text,
                    "type": row.get("type"),
                    "efta_bates": row.get("efta_bates", ""),
                    "page": row.get("page"),
                    "doc_id": row.get("doc_id"),
                }
            )

    for _, row in df_events.iterrows():
        date_value = row.get("date")
        if pd.isna(date_value):
            continue

        if hasattr(date_value, "isoformat"):
            date_string = date_value.isoformat()
        else:
            date_string = _extract_iso_date(str(date_value)) or str(date_value)

        events.append(
            {
                "date": date_string,
                "entity": row.get("description", "Event"),
                "type": "Event",
                "efta_bates": row.get("efta_bates", ""),
                "page": row.get("page"),
                "doc_id": row.get("doc_id"),
            }
        )

    events.sort(key=lambda item: item.get("date") or "9999-12-31")
    return events


@app.get("/api/session/list")
def list_sessions():
    if not FORENSIC_SESSIONS_DIR.exists():
        return []

    return sorted(path.stem for path in FORENSIC_SESSIONS_DIR.glob("*.xlsx"))


@app.post("/api/session/save")
def save_session(payload: SessionNameRequest):
    if not FORENSIC_MASTER_XLSX.exists():
        raise HTTPException(status_code=404, detail="Master workbook not found")

    FORENSIC_SESSIONS_DIR.mkdir(parents=True, exist_ok=True)
    target = FORENSIC_SESSIONS_DIR / f"{payload.name}.xlsx"
    shutil.copy2(FORENSIC_MASTER_XLSX, target)
    return {"status": "saved", "name": payload.name, "path": str(target)}


@app.post("/api/session/load")
def load_session(payload: SessionNameRequest):
    source = FORENSIC_SESSIONS_DIR / f"{payload.name}.xlsx"
    if not source.exists():
        raise HTTPException(status_code=404, detail="Session not found")

    FORENSIC_MASTER_XLSX.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, FORENSIC_MASTER_XLSX)
    return {"status": "loaded", "name": payload.name}


@app.get("/api/document/{doc_id}")
def serve_document(doc_id: str):
    intake = _read_sheet_or_empty("Intake_Log")
    if intake.empty:
        raise HTTPException(status_code=404, detail="Document not found")

    matches = intake[intake.get("doc_id") == doc_id]
    if matches.empty:
        raise HTTPException(status_code=404, detail="Document not found")

    source_path = Path(str(matches.iloc[0].get("source_path", ""))).expanduser()
    if not source_path.is_file():
        raise HTTPException(status_code=404, detail="Document path does not exist")

    return FileResponse(source_path)
