from __future__ import annotations

from datetime import datetime
from pathlib import Path

import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from check_structural_bid_confirmation import check_structural_bid_confirmation

app = FastAPI(title="Structural Bid Signal API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

LEDGER_CSV = Path("structural_ledger.csv")


@app.get("/signal")
async def get_signal(anchor_date: str = Query("2026-02-12", pattern=r"^\d{4}-\d{2}-\d{2}$")):
    """Serve structural signal output for dashboard polling clients."""
    try:
        datetime.strptime(anchor_date, "%Y-%m-%d")
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid anchor_date format. Use YYYY-MM-DD.") from exc

    if not LEDGER_CSV.exists():
        raise HTTPException(status_code=500, detail=f"Ledger file not found: {LEDGER_CSV}")

    try:
        ledger_df = pd.read_csv(LEDGER_CSV)
        return check_structural_bid_confirmation(ledger_df, anchor_date)
    except Exception as exc:  # surface as API error payload
        raise HTTPException(status_code=500, detail=f"Signal generation failed: {exc}") from exc
