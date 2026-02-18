from __future__ import annotations

import math
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Any

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field

app = FastAPI(title="Single-File Fortress", version="0.1.0")


@dataclass
class LearnState:
    hits: int = 1
    misses: int = 1
    timing_shift_min: float = 0.0


STATE: dict[str, LearnState] = {
    "rain": LearnState(),
    "sun": LearnState(),
}


class LearnRequest(BaseModel):
    event: str = Field(pattern="^(rain|sun)$")
    predicted_ts: datetime
    realized_ts: datetime
    hit: bool


def _beta_mean(event: str) -> float:
    s = STATE[event]
    return s.hits / (s.hits + s.misses)


def _calibrated(prob: float, event: str) -> float:
    return max(0.0, min(1.0, 0.65 * prob + 0.35 * _beta_mean(event)))


def _forecast_grid() -> list[dict[str, Any]]:
    now = datetime.now(UTC).replace(second=0, microsecond=0)
    x0 = now.timestamp() / 60.0
    rain_shift = STATE["rain"].timing_shift_min
    sun_shift = STATE["sun"].timing_shift_min

    out: list[dict[str, Any]] = []
    for i in range(6 * 60):
        ts = now + timedelta(minutes=i)
        phase = (x0 + i) / 18.0
        base_rain = 0.5 + 0.25 * math.sin(phase)
        base_sun = 0.5 + 0.25 * math.cos(phase)
        rain = _calibrated(base_rain, "rain")
        sun = _calibrated(base_sun, "sun")

        out.append(
            {
                "ts": ts.isoformat(),
                "rain": rain,
                "sun": sun,
                "rain_ts": (ts + timedelta(minutes=rain_shift)).isoformat(),
                "sun_ts": (ts + timedelta(minutes=sun_shift)).isoformat(),
            }
        )
    return out


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/forecast/eth")
def forecast_eth() -> dict[str, Any]:
    grid = _forecast_grid()
    rain_windows = [r["rain_ts"] for r in grid if r["rain"] >= 0.70][:10]
    sun_windows = [r["sun_ts"] for r in grid if r["sun"] >= 0.70][:10]
    return {
        "generated_at_utc": datetime.now(UTC).isoformat(),
        "grid": grid,
        "rain_windows": rain_windows,
        "sun_windows": sun_windows,
        "rain_calibrated": _beta_mean("rain"),
        "sun_calibrated": _beta_mean("sun"),
        "timing_shift_min": {
            "rain": STATE["rain"].timing_shift_min,
            "sun": STATE["sun"].timing_shift_min,
        },
    }


@app.post("/learn/eth")
def learn_eth(payload: LearnRequest) -> dict[str, Any]:
    s = STATE[payload.event]
    if payload.hit:
        s.hits += 1
    else:
        s.misses += 1

    error_min = (payload.realized_ts - payload.predicted_ts).total_seconds() / 60.0
    s.timing_shift_min = (0.8 * s.timing_shift_min) + (0.2 * error_min)

    return {
        "ok": True,
        "event": payload.event,
        "hits": s.hits,
        "misses": s.misses,
        "timing_shift_min": s.timing_shift_min,
        "beta_mean": _beta_mean(payload.event),
    }


@app.get("/signal")
def signal() -> dict[str, Any]:
    p_rain = _beta_mean("rain")
    timing_ok = abs(STATE["rain"].timing_shift_min) <= 30
    regime_open = p_rain > 0.55 and timing_ok
    return {
        "regime_status": "OPEN" if regime_open else "CLOSED_DEFENSIVE",
        "rain_calibrated": p_rain,
        "timing_shift_min": STATE["rain"].timing_shift_min,
    }


@app.get("/", response_class=HTMLResponse)
def index() -> str:
    return """<!doctype html>
<html>
<head>
  <meta charset='utf-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <title>Single-File Fortress</title>
  <script src='https://unpkg.com/react@18/umd/react.development.js'></script>
  <script src='https://unpkg.com/react-dom@18/umd/react-dom.development.js'></script>
  <script src='https://unpkg.com/@babel/standalone/babel.min.js'></script>
  <style>
    body { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; background:#020617; color:#cbd5e1; margin:0; }
    .wrap { max-width:1000px; margin:0 auto; padding:24px; }
    .card { border:1px solid #1e293b; background:#0f172a; border-radius:10px; padding:16px; margin-bottom:16px; }
    .row { display:flex; gap:12px; align-items:center; }
    .pill { border:1px solid #334155; border-radius:999px; padding:4px 10px; }
    button { background:#0ea5e9; border:0; color:#00111a; font-weight:700; border-radius:8px; padding:8px 12px; cursor:pointer; }
    svg { width:100%; height:120px; background:#020617; border-radius:8px; }
  </style>
</head>
<body>
  <div id='root'></div>
  <script type='text/babel'>
    const {useEffect, useMemo, useRef, useState} = React;

    function useRhythm() {
      const ctxRef = useRef(null);
      const makeCtx = () => {
        if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        return ctxRef.current;
      };
      const play = (freq) => {
        const ctx = makeCtx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.value = 0.0001;
        o.connect(g); g.connect(ctx.destination);
        const t = ctx.currentTime;
        g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        o.start(); o.stop(t + 0.36);
      };
      return { play };
    }

    function App() {
      const [fc, setFc] = useState(null);
      const [sig, setSig] = useState(null);
      const [status, setStatus] = useState('loading');
      const { play } = useRhythm();

      const load = async () => {
        try {
          const [a,b] = await Promise.all([fetch('/forecast/eth'), fetch('/signal')]);
          setFc(await a.json());
          setSig(await b.json());
          setStatus('ok');
        } catch {
          setStatus('error');
        }
      };

      useEffect(() => {
        load();
        const id = setInterval(load, 30000);
        return () => clearInterval(id);
      }, []);

      const points = useMemo(() => (fc?.grid || []).slice(0, 120), [fc]);
      const path = useMemo(() => {
        if (!points.length) return '';
        return points.map((p, i) => `${(i/119)*980},${100-(p.rain*90)}`).join(' ');
      }, [points]);

      const sendLearn = async () => {
        if (!points.length) return;
        const p = points[0];
        const pred = p.ts;
        const real = new Date(new Date(pred).getTime() + 7*60000).toISOString();
        await fetch('/learn/eth', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({event:'rain', predicted_ts: pred, realized_ts: real, hit:true})
        });
        load();
      };

      return <div className='wrap'>
        <h1>PRIMA Single-File Fortress</h1>
        <div className='card row'>
          <span className='pill'>API: {status}</span>
          <span className='pill'>Regime: {sig?.regime_status || '—'}</span>
          <span className='pill'>Rain β: {(fc?.rain_calibrated ?? 0).toFixed(3)}</span>
          <span className='pill'>Timing Shift: {(sig?.timing_shift_min ?? 0).toFixed(2)}m</span>
        </div>

        <div className='card'>
          <h3>Next windows</h3>
          <div>Rain ≥ 70%: {(fc?.rain_windows || []).slice(0,3).map(x => <div key={x}>{new Date(x).toLocaleString()}</div>)}</div>
          <div style={{marginTop:8}}>Sun ≥ 70%: {(fc?.sun_windows || []).slice(0,3).map(x => <div key={x}>{new Date(x).toLocaleString()}</div>)}</div>
        </div>

        <div className='card'>
          <h3>Rain sparkline (next 120 min)</h3>
          <svg viewBox='0 0 980 100'>
            <polyline fill='none' stroke='#22d3ee' strokeWidth='2' points={path} />
          </svg>
        </div>

        <div className='card'>
          <h3>Rhythm machine</h3>
          <div className='row'>
            {[261.63,293.66,329.63,349.23,392.0,440.0,493.88].map((f,i) => (
              <button key={f} onMouseDown={() => play(f)}>{String.fromCharCode(65+i)}</button>
            ))}
            <button onClick={sendLearn}>Post Learn(+7m)</button>
          </div>
          <p style={{opacity:.8}}>Keys A–G play notes. Learn button nudges timing EWMA.</p>
        </div>
      </div>
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>"""


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
