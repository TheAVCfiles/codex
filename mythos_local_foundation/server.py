"""Minimal local MythOS API service."""

from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel, Field

from alignment_metrics import AlignmentInputs, compute_metrics

app = FastAPI(title="MythOS Local Foundation API", version="0.1.0")


class GenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="Local prompt text")
    max_tokens: int = Field(default=128, ge=1, le=4096)


class AlignRequest(BaseModel):
    integrity: float = Field(..., ge=0.0, le=1.0)
    coherence: float = Field(..., ge=0.0, le=1.0)
    drift: float = Field(..., ge=0.0, le=1.0)
    incidents: int = Field(default=0, ge=0)
    recoveries: int = Field(default=0, ge=0)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/generate")
def generate(payload: GenerateRequest) -> dict[str, str | int]:
    """Portable stub endpoint; wire to Ollama/vLLM/transformers as needed."""

    return {
        "provider": "local-stub",
        "max_tokens": payload.max_tokens,
        "output": f"[local-demo] {payload.prompt.strip()}",
    }


@app.post("/align")
def align(payload: AlignRequest) -> dict[str, float]:
    metrics = compute_metrics(
        AlignmentInputs(
            integrity=payload.integrity,
            coherence=payload.coherence,
            drift=payload.drift,
            incidents=payload.incidents,
            recoveries=payload.recoveries,
        )
    )
    return metrics
