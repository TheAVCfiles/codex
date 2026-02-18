from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd

try:  # optional heavy deps
    from pycoingecko import CoinGeckoAPI  # type: ignore
except Exception:  # pragma: no cover
    CoinGeckoAPI = None

try:
    from statsmodels.tsa.statespace.sarimax import SARIMAX  # type: ignore
except Exception:  # pragma: no cover
    SARIMAX = None


@dataclass
class TempoForecast:
    forecasted_tempo: float
    model: str


def _normalize_price_to_bpm(price: float) -> float:
    # map price range into musical 60-200 bpm band with clipping
    bpm = 60.0 + (price / 5000.0) * 140.0
    return max(60.0, min(200.0, bpm))


def fetch_eth_daily(days: int = 30) -> pd.DataFrame:
    if CoinGeckoAPI is None:
        raise RuntimeError("pycoingecko is not available")

    cg = CoinGeckoAPI()
    data = cg.get_coin_market_chart_by_id(id="ethereum", vs_currency="usd", days=days, interval="daily")
    df = pd.DataFrame(data["prices"], columns=["time", "price"])
    df["time"] = pd.to_datetime(df["time"], unit="ms", utc=True)
    return df.set_index("time")


def sarima_forecast_tempo(df: pd.DataFrame, order: tuple[int, int, int] = (2, 1, 1), seasonal_order: tuple[int, int, int, int] = (1, 1, 1, 7)) -> TempoForecast:
    if SARIMAX is None:
        raise RuntimeError("statsmodels is not available")
    if len(df) < 15:
        raise ValueError("not enough rows for SARIMA")

    model = SARIMAX(df["price"], order=order, seasonal_order=seasonal_order)
    results = model.fit(disp=False)
    forecast = results.forecast(steps=7)
    mean_price = float(np.mean(forecast))
    return TempoForecast(forecasted_tempo=_normalize_price_to_bpm(mean_price), model="SARIMA")


def fallback_tempo_from_series(df: pd.DataFrame) -> TempoForecast:
    # simple robust fallback: trend + volatility pressure
    recent = df["price"].astype(float).tail(14)
    level = float(recent.mean())
    trend = float((recent.iloc[-1] - recent.iloc[0]) / max(1, len(recent) - 1))
    vol = float(recent.pct_change().std(ddof=0) or 0.0)
    adjusted_price = level + trend * 3 + level * vol * 5
    return TempoForecast(forecasted_tempo=_normalize_price_to_bpm(adjusted_price), model="FALLBACK")


def forecast_tempo(days: int = 30) -> TempoForecast:
    try:
        df = fetch_eth_daily(days=days)
        try:
            return sarima_forecast_tempo(df)
        except Exception:
            return fallback_tempo_from_series(df)
    except Exception:
        # full offline fallback synthetic price pulse around 3k
        idx = pd.date_range(end=pd.Timestamp.now(tz="UTC"), periods=30, freq="D")
        series = 3000.0 + 80.0 * np.sin(np.linspace(0, 2 * np.pi, len(idx)))
        synthetic = pd.DataFrame({"price": series}, index=idx)
        return fallback_tempo_from_series(synthetic)
