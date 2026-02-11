from __future__ import annotations

import hashlib
import json
import logging
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Literal, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, ValidationError

from embodied_learning.components.content_generator import STEMContentGenerator
from embodied_learning.components.movement_mapper import MovementToConceptMapper
from embodied_learning.components.nlp_processor import NeurolinguisticProcessor
from embodied_learning.curriculum import Curriculum
from embodied_learning.generator import EmbodiedLearningGenerator


logger = logging.getLogger("embodied_api")
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
logger.setLevel(logging.INFO)
logger.addHandler(handler)

app = FastAPI(
    title="Embodied Learning Curriculum API",
    version="1.0.0",
    description="Generate embodied-learning curricula from movement + concept inputs.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ALLOW_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

GradeBand = Literal["K-2", "3-5", "6-8", "9-12", "Undergrad", "Adult"]


class CurriculumRequest(BaseModel):
    concept: str = Field(
        ..., min_length=2, description="Target concept, e.g. 'Momentum', 'Photosynthesis'."
    )
    grade_level: GradeBand | str = Field(..., description="Grade band or descriptor.")
    learning_objectives: List[str] = Field(
        ...,
        min_items=1,
        description="Concrete objectives, e.g. ['Define momentum', 'Relate movement to mass*velocity']",
    )
    language: Optional[str] = Field(default="en", description="ISO language code for generated content.")
    difficulty: Optional[Literal["intro", "standard", "advanced"]] = "standard"


class ErrorPayload(BaseModel):
    detail: str
    code: Optional[str] = None

    def to_dict(self) -> dict:
        model_dump = getattr(self, "model_dump", None)
        if callable(model_dump):
            return model_dump()
        return self.dict()


class MintReq(BaseModel):
    kind: str = Field(..., min_length=2)
    payload: Dict[str, Any] = Field(default_factory=dict)


LLM_API_KEY = os.environ.get("LLM_API_KEY")
BASE_DIR = Path(__file__).resolve().parent
REPO_ROOT = BASE_DIR if (BASE_DIR / "docs").exists() else BASE_DIR.parent
DB_PATH = os.environ.get("LEDGER_DB_PATH", str(REPO_ROOT / "data" / "ledger.db"))
BALLETBANK_CONFIG_PATH = Path(
    os.environ.get(
        "BALLETBANK_CONFIG_PATH",
        str(REPO_ROOT / "docs" / "config" / "balletbank.config.json"),
    )
)


def load_balletbank_config() -> Dict[str, Any]:
    try:
        return json.loads(BALLETBANK_CONFIG_PATH.read_text(encoding="utf-8"))
    except FileNotFoundError:
        logger.warning("Ballet Bank config not found at %s", BALLETBANK_CONFIG_PATH)
        return {}
    except json.JSONDecodeError:
        logger.exception("Ballet Bank config is invalid JSON at %s", BALLETBANK_CONFIG_PATH)
        return {}


BALLETBANK_CONFIG = load_balletbank_config()


def initialize_ledger_db() -> None:
    Path(DB_PATH).parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS artifacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                kind TEXT NOT NULL,
                payload TEXT NOT NULL,
                receipt_hash TEXT NOT NULL UNIQUE,
                created_at TEXT NOT NULL
            )
            """
        )


def canonical_hash(data: Dict[str, Any]) -> str:
    canonical = json.dumps(data, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def _resolve_qr_url(receipt_hash: str) -> str:
    template = BALLETBANK_CONFIG.get("receiptPayload", {}).get(
        "qrTemplate",
        "https://stageport.app/receipt/{{txId}}?v=bbank",
    )
    return template.replace("{{txId}}", receipt_hash)


def _validate_balletbank_payload(req: MintReq) -> None:
    payload = req.payload
    if payload.get("module") != "BalletBank":
        return

    currencies = BALLETBANK_CONFIG.get("currencies", {})
    currency = payload.get("currency")
    if currency and currency not in currencies:
        raise HTTPException(status_code=400, detail=f"Unsupported BalletBank currency: {currency}")

    if req.kind == "bbank_accrual" and "amount" not in payload:
        raise HTTPException(status_code=400, detail="bbank_accrual payload must include amount")

    lock_rule = BALLETBANK_CONFIG.get("lockRule", {})
    lock_meta_key = lock_rule.get("metaKey", "lock")
    lock_payload = payload.get("meta", {}).get(lock_meta_key, payload.get(lock_meta_key))
    if lock_payload and "unlockAt" not in lock_payload:
        raise HTTPException(status_code=400, detail="Lock metadata must include unlockAt")

try:
    initialize_ledger_db()
    movement_mapper = MovementToConceptMapper()
    content_synthesizer = STEMContentGenerator(api_key=LLM_API_KEY)
    neurolinguistic_processor = NeurolinguisticProcessor()

    curriculum_generator = EmbodiedLearningGenerator(
        movement_analyzer=movement_mapper,
        content_synthesizer=content_synthesizer,
        neurolinguistic_processor=neurolinguistic_processor,
    )
    logger.info("EmbodiedLearning components initialized.")
except Exception:
    logger.exception("Failed to initialize components at import time.")
    curriculum_generator = None  # type: ignore


@app.get("/health")
def health():
    ok = curriculum_generator is not None
    return {"status": "ok" if ok else "degraded"}


@app.get("/version")
def version():
    return {"version": app.version}


@app.exception_handler(ValidationError)
async def pydantic_validation_handler(_, __: ValidationError):
    return JSONResponse(
        status_code=422,
        content=ErrorPayload(detail="Invalid request payload.", code="VALIDATION_ERROR").to_dict(),
    )


@app.exception_handler(Exception)
async def unhandled_handler(_, exc: Exception):
    logger.exception("Unhandled server error: %s", exc)
    return JSONResponse(
        status_code=500,
        content=ErrorPayload(detail="Internal server error.", code="UNHANDLED_ERROR").to_dict(),
    )


@app.post(
    "/generate-curriculum",
    response_model=Curriculum,
    responses={400: {"model": ErrorPayload}, 500: {"model": ErrorPayload}},
)
def generate_embodied_learning_curriculum(request: CurriculumRequest):
    if curriculum_generator is None:
        raise HTTPException(status_code=503, detail="Service not initialized.")

    grade_level = str(request.grade_level)

    try:
        final_curriculum: Curriculum = curriculum_generator.generate_curriculum(
            concept=request.concept.strip(),
            grade_level=grade_level.strip(),
            learning_objectives=[obj.strip() for obj in request.learning_objectives if obj.strip()],
            language=request.language,
            difficulty=request.difficulty,
        )
        return final_curriculum
    except ValueError as ve:
        logger.warning("Domain error: %s", ve)
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception:
        logger.exception("Generation failed.")
        raise HTTPException(status_code=500, detail="Failed to generate curriculum.")


@app.post("/mint")
def mint(req: MintReq):
    _validate_balletbank_payload(req)

    payload_for_hash = {
        "kind": req.kind,
        "payload": req.payload,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "module": req.payload.get("module"),
    }
    receipt_hash = canonical_hash(payload_for_hash)
    created_at = datetime.now(timezone.utc).isoformat()

    with sqlite3.connect(DB_PATH) as conn:
        row = conn.execute(
            """
            INSERT INTO artifacts (kind, payload, receipt_hash, created_at)
            VALUES (?, ?, ?, ?)
            RETURNING id, created_at
            """,
            (req.kind, json.dumps(req.payload), receipt_hash, created_at),
        ).fetchone()

    return {
        "id": row[0],
        "created_at": row[1],
        "receipt_hash": receipt_hash,
        "qr_url": _resolve_qr_url(receipt_hash),
    }


@app.post("/transactions/transfer")
def transfer(req: MintReq):
    return mint(req)


@app.get("/receipt/{receipt_hash}")
def get_receipt(receipt_hash: str):
    with sqlite3.connect(DB_PATH) as conn:
        row = conn.execute(
            "SELECT id, kind, payload, receipt_hash, created_at FROM artifacts WHERE receipt_hash = ?",
            (receipt_hash,),
        ).fetchone()

    if row is None:
        raise HTTPException(status_code=404, detail="Receipt not found")

    return {
        "id": row[0],
        "kind": row[1],
        "payload": json.loads(row[2]),
        "receipt_hash": row[3],
        "created_at": row[4],
        "qr_url": _resolve_qr_url(row[3]),
    }


# Optional: run with `uvicorn api:app --reload`
