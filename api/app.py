"""FastAPI application that mirrors the Cloudflare worker behaviour.

The API exposes the same routes as :mod:`api/worker.js` so that developers can
run and test the DTG event logging flow locally.  Events are persisted to a
JSON file inside ``data/`` and basic analytics (daily batches and reader
balances) are supported.
"""

from __future__ import annotations

import csv
import hashlib
import json
import re
import threading
import uuid
from datetime import datetime, timezone
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field, validator


# ---------------------------------------------------------------------------
# Sentient Cents rules and helpers
# ---------------------------------------------------------------------------

SENTIENT_CENTS_RULES: Dict[str, float] = {
    "keystroke": 0.01,
    "view": 0.05,
    "click": 0.02,
    "scroll": 0.001,
    "submit": 0.10,
    "deploy": 1.00,
    "mint": 0.00,
    "validate": 0.25,
}

VALID_ACTIONS = frozenset(SENTIENT_CENTS_RULES.keys())


def _isoformat_now() -> str:
    """Return the current UTC timestamp formatted like the worker output."""

    return (
        datetime.now(timezone.utc)
        .isoformat(timespec="milliseconds")
        .replace("+00:00", "Z")
    )


def _normalize_timestamp(value: Optional[str]) -> str:
    """Normalize *value* to an ISO timestamp.

    Any parsing errors result in the current timestamp, mirroring the behaviour
    of the Node.js implementation used in the worker utilities.
    """

    if not value:
        return _isoformat_now()

    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        try:
            parsed = datetime.fromtimestamp(float(value), tz=timezone.utc)
        except (TypeError, ValueError):
            try:
                parsed = datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
                parsed = parsed.replace(tzinfo=timezone.utc)
            except ValueError:
                return _isoformat_now()

    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    else:
        parsed = parsed.astimezone(timezone.utc)

    return parsed.isoformat(timespec="milliseconds").replace("+00:00", "Z")


def calculate_sentient_cents(action: str, context: Optional[Dict[str, Any]]) -> float:
    """Calculate the Sentient Cents earned for an action."""

    base_rate = SENTIENT_CENTS_RULES.get(action, 0.0)
    multiplier = 1.0

    if context:
        engagement = context.get("engagement_duration")
        if isinstance(engagement, (int, float)) and engagement > 10:
            multiplier += 0.1

        length = context.get("content_length")
        if isinstance(length, (int, float)) and length > 100:
            multiplier += 0.2

        if context.get("is_unique"):
            multiplier += 0.5

    return round(base_rate * multiplier, 2)


def _sha256_for_event(event_payload: Dict[str, Any]) -> str:
    """Return the SHA256 hash for *event_payload*.

    The hash is computed on the payload with sorted keys, matching the worker.
    """

    ordered_payload = {key: event_payload[key] for key in sorted(event_payload)}
    event_json = json.dumps(ordered_payload, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(event_json.encode("utf-8")).hexdigest()


# ---------------------------------------------------------------------------
# Data models
# ---------------------------------------------------------------------------


class EventInput(BaseModel):
    """Incoming event payload provided by clients."""

    ts_iso: Optional[str] = Field(None, description="Client supplied timestamp")
    reader_id: Optional[str] = Field(None, description="Reader identifier")
    surface: Optional[str] = Field(None, description="Interaction surface")
    action: str = Field(..., description="Type of interaction")
    node_id: Optional[str] = Field(None, description="DOM or graph node identifier")
    version: Optional[str] = Field(None, description="Client version")
    session_id: Optional[str] = Field(None, description="Session identifier")
    artifact_href: Optional[str] = Field(None, description="Link to related artifact")
    notes: Optional[str] = Field(None, description="Free-form notes")
    context: Optional[Dict[str, Any]] = Field(
        None,
        description="Additional context used for Sentient Cents bonuses",
    )

    @validator("action")
    def _validate_action(cls, value: str) -> str:
        if value not in VALID_ACTIONS:
            raise ValueError(
                "Invalid action. Expected one of: " + ", ".join(sorted(VALID_ACTIONS))
            )
        return value


class Event(BaseModel):
    ts_iso: str
    event_id: str
    reader_id: str
    surface: str
    action: str
    node_id: str
    version: str
    session_id: str
    artifact_href: str
    notes: str
    sentient_cents_earned: float
    hash_sha256: str


class LogResponse(BaseModel):
    success: bool = True
    event_id: str
    sentient_cents_earned: float
    hash: str


class BatchLogRequest(BaseModel):
    events: List[EventInput]


class BatchLogResult(BaseModel):
    success: bool
    event_id: Optional[str] = None
    sentient_cents_earned: Optional[float] = None
    error: Optional[str] = None


class BatchResponse(BaseModel):
    results: List[BatchLogResult]


class BalanceResponse(BaseModel):
    reader_id: str
    total_balance: float
    events_count: int
    last_updated: str
    note: str


# ---------------------------------------------------------------------------
# Persistence layer
# ---------------------------------------------------------------------------


class EventStore:
    """Simple JSON-backed event store used for the FastAPI server."""

    def __init__(self, storage_path: Path) -> None:
        self._path = storage_path
        self._lock = threading.Lock()
        self._data = self._load()

    @property
    def _events(self) -> Dict[str, Dict[str, Any]]:
        return self._data.setdefault("events", {})

    @property
    def _batches(self) -> Dict[str, List[str]]:
        return self._data.setdefault("batches", {})

    def log_event(self, event: Event) -> None:
        event_dict = event.model_dump()
        with self._lock:
            self._events[event.event_id] = event_dict
            batch_key = event.ts_iso[:10]
            batch = self._batches.setdefault(batch_key, [])
            if event.event_id not in batch:
                batch.append(event.event_id)
            self._write()

    def log_events(self, events: Iterable[Event]) -> None:
        for event in events:
            self.log_event(event)

    def get_batch(self, date_str: str) -> List[Event]:
        ids = self._batches.get(date_str, [])
        return [Event(**self._events[event_id]) for event_id in ids if event_id in self._events]

    def events_for_reader(self, reader_id: str) -> List[Event]:
        return [Event(**payload) for payload in self._events.values() if payload["reader_id"] == reader_id]

    def _load(self) -> Dict[str, Any]:
        if not self._path.exists():
            self._path.parent.mkdir(parents=True, exist_ok=True)
            return {"events": {}, "batches": {}}

        try:
            with self._path.open("r", encoding="utf-8") as handle:
                data = json.load(handle)
        except json.JSONDecodeError:
            data = {"events": {}, "batches": {}}

        if not isinstance(data, dict):
            data = {"events": {}, "batches": {}}

        data.setdefault("events", {})
        data.setdefault("batches", {})
        return data

    def _write(self) -> None:
        tmp_path = self._path.with_suffix(".tmp")
        with tmp_path.open("w", encoding="utf-8") as handle:
            json.dump(self._data, handle, indent=2, ensure_ascii=False)
        tmp_path.replace(self._path)


DATA_DIR = Path(__file__).resolve().parent.parent / "data"
STORE_PATH = DATA_DIR / "dtg_events.json"

event_store = EventStore(STORE_PATH)


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------


@lru_cache(maxsize=1)
def _baseline_balances() -> Dict[str, float]:
    """Load baseline Sentient Cents from the analytics CSV file."""

    analytics_file = DATA_DIR / "DecryptTheGirl_Analytics.csv"
    balances: Dict[str, float] = {}

    if not analytics_file.exists():
        return balances

    with analytics_file.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            reader_id = row.get("reader_id") or ""
            if not reader_id:
                continue

            raw_value = row.get("sentient_cents_earned", "0")
            try:
                cents = float(raw_value)
            except (TypeError, ValueError):
                continue

            balances[reader_id] = round(balances.get(reader_id, 0.0) + cents, 2)

    return balances


def _build_event(payload: EventInput, request: Request) -> Event:
    user_agent = request.headers.get("user-agent", "")
    default_surface = "mobile" if "mobile" in user_agent.lower() else "web"

    event_payload: Dict[str, Any] = {
        "ts_iso": _normalize_timestamp(payload.ts_iso),
        "event_id": str(uuid.uuid4()),
        "reader_id": payload.reader_id or "anonymous",
        "surface": payload.surface or default_surface,
        "action": payload.action,
        "node_id": payload.node_id or "",
        "version": payload.version or "v1.0.0",
        "session_id": payload.session_id or str(uuid.uuid4()),
        "artifact_href": payload.artifact_href or "",
        "notes": payload.notes or "",
    }

    cents_earned = calculate_sentient_cents(payload.action, payload.context)
    event_payload["sentient_cents_earned"] = cents_earned
    event_payload["hash_sha256"] = _sha256_for_event(event_payload)

    return Event(**event_payload)


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------


app = FastAPI(
    title="DTG Event Logging API",
    description="Local FastAPI implementation of the DTG event logger",
    version="1.0.0",
)


@app.post("/log", response_model=LogResponse)
async def log_event(payload: EventInput, request: Request) -> LogResponse:
    event = _build_event(payload, request)
    event_store.log_event(event)
    return LogResponse(
        success=True,
        event_id=event.event_id,
        sentient_cents_earned=event.sentient_cents_earned,
        hash=event.hash_sha256,
    )


@app.post("/log/batch", response_model=BatchResponse)
async def log_batch(request_body: BatchLogRequest, request: Request) -> BatchResponse:
    results: List[BatchLogResult] = []

    for event_payload in request_body.events:
        try:
            event = _build_event(event_payload, request)
        except ValueError as exc:
            results.append(BatchLogResult(success=False, error=str(exc)))
            continue

        event_store.log_event(event)
        results.append(
            BatchLogResult(
                success=True,
                event_id=event.event_id,
                sentient_cents_earned=event.sentient_cents_earned,
            )
        )

    return BatchResponse(results=results)


_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


@app.get("/batch/{date}")
async def get_batch(date: str) -> Dict[str, List[Event]]:
    if not _DATE_RE.match(date):
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    events = event_store.get_batch(date)
    return {"events": events}


@app.get("/balance/{reader_id}", response_model=BalanceResponse)
async def get_balance(reader_id: str) -> BalanceResponse:
    baseline = _baseline_balances()
    base_value = baseline.get(reader_id, 0.0)

    events = event_store.events_for_reader(reader_id)
    runtime_value = sum(event.sentient_cents_earned for event in events)
    total = round(base_value + runtime_value, 2)

    return BalanceResponse(
        reader_id=reader_id,
        total_balance=total,
        events_count=len(events),
        last_updated=_isoformat_now(),
        note="Balance includes baseline analytics data plus locally logged events",
    )


@app.get("/health")
async def healthcheck() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "timestamp": _isoformat_now(),
        "version": "1.0.0",
    }


@app.get("/")
async def root() -> Dict[str, Any]:
    return {
        "message": "DTG Event Logging API",
        "endpoints": [
            {"method": "POST", "path": "/log"},
            {"method": "POST", "path": "/log/batch"},
            {"method": "GET", "path": "/batch/{date}"},
            {"method": "GET", "path": "/balance/{reader_id}"},
            {"method": "GET", "path": "/health"},
        ],
    }

