# PRIMA Fortress — ETH Weather Forecaster Scaffold

This repository includes a GitHub-ready scaffold for a self-improving ETH "weather" loop:

- FastAPI backend (`api/`) with forecast + learning endpoints
- Live trade ingestor to rolling 1-minute bars
- Daily evaluator + online trainer scripts
- Paper-trading style executor with kill-switch rails
- Vite + React + TypeScript dashboard (`web/`)
- Docker + docker-compose + CI workflow

> Disclaimer: analytic tooling only, not financial advice.

## Quick start

```bash
# API (local)
python -m pip install -r api/requirements.txt
uvicorn api.app:app --host 0.0.0.0 --port 8000 --reload

# Web (local)
cd web
npm install
npm run dev

# Full stack
docker compose up --build
```

## Daily loop scripts

```bash
python -m api.ingest_stream
python -m api.daily_eval
python -m api.online_train
```

## Single-file fallback mode

For a zero-build dynamic fallback dashboard, run:

```bash
python single_file_fortress.py
# open http://127.0.0.1:8000/
```

This serves a self-contained FastAPI + inline React/Babel UI with forecast, signal, learn loop, sparkline, and WebAudio rhythm controls.
