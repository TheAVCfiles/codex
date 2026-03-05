# StagePort Research Lab — Choreographic Intelligence Infrastructure

StagePort is a research platform for choreographic intelligence and creative labor attribution.
It combines narrative systems, movement-aware computation, and governance tooling into one executable lab.

## Front door

### 1) Problem this system solves

Creative labor is often captured, remixed, and monetized without durable attribution.
This repository prototypes a pipeline where movement artifacts, operator decisions, and governance evidence can be tracked as first-class system records.

### 2) What makes it unusual

Most projects stop at one layer (UI, analytics, or smart contracts).
This one intentionally spans multiple layers:

- **Movement analytics engine** (Py.rouette style compute loops)
- **Creative rights + value rails** (StageCoin / ledger-oriented primitives)
- **Institutional confidence dashboards** (evidence, governance, and operator visibility)

### 3) What already works

- FastAPI service with ingestion, evaluation, and online training loops
- Runnable React + TypeScript dashboard with tempo-aware modules
- Single-file fallback runtime for resilient demo recovery
- Dockerized local stack for end-to-end execution

---

## PRIMA Fortress — ETH Weather Forecaster Scaffold

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

## Atmospheric Sentience Orchestrator

The web dashboard includes a rhythm-machine panel driven by market tempo projection.

- API endpoint: `GET /api/forecast-tempo` (or compatibility alias `/forecast-tempo`)
- Model: SARIMA when available (`statsmodels` + CoinGecko), with deterministic fallback tempo logic when offline
- UI: rhythm presets, 16-step drum grid, and tempo slider seeded from forecast tempo

---

## Upstream PR readiness checklist

Use this quick pass before opening a PR from a fork back to an upstream project:

1. **Run from scratch**
   - Verify a fresh clone can install dependencies and start (`npm install`, `docker compose up`, etc.).
2. **Remove experiment debris**
   - Keep scratch files, temporary scripts, and half-built modules out of the PR.
3. **Keep scope surgical**
   - Submit one clear idea per PR. Split docs fixes, CLI fixes, and API changes into separate proposals.
4. **Check license + ownership hygiene**
   - Confirm dependency compatibility and avoid committing proprietary code, secrets, `.env` values, or credentials.
5. **Write a maintainable PR description**
   - State problem, why it matters, implementation summary, and exact test/repro steps.
6. **Run quality gates first**
   - Run lint/tests/CI-equivalent checks locally before asking maintainers to review.

When a fork has diverged heavily, consider extracting small upstream-worthy fixes into clean branches and keep larger architecture experiments as independent project work.
