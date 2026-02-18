import csv
import hashlib
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from tempfile import NamedTemporaryFile
from typing import Any

# --- CONFIG ---
DAILY_OUTDIR = Path("daily_outputs")  # Where your τ, structural ledger CSVs live
REGIME_JSON = Path("daily_overlay_regime.json")

# Expected CSV schemas (from your daily run)
TAU_CSV = DAILY_OUTDIR / "tau_analysis_latest.csv"  # Columns: tau, ci_lower, ci_upper, p_value, etc.
STRUCTURAL_CSV = (
    DAILY_OUTDIR / "structural_ledger_latest.csv"
)  # Columns: event_date, weight, proximity_days, etc.
PERMUTATION_CSV = (
    DAILY_OUTDIR / "event_study_permutation_summary.csv"
)  # Optional: p_value columns from permutation output

REQUIRED_KEYS = [
    "regime_favorable",
    "max_gain_factor",
    "structural_weight",
    "tap_p_value",
    "tau_status",
    "risk_level_bias",
]


def _read_rows(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        return []

    with path.open("r", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def _safe_float(value: Any, *, default: float) -> float:
    try:
        if value is None:
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def _effective_p_value(tau_rows: list[dict[str, str]], permutation_rows: list[dict[str, str]]) -> float:
    """Pick a conservative p-value across available summaries (fail-closed)."""
    candidates: list[float] = []

    for row in tau_rows:
        p_val = _safe_float(row.get("p_value"), default=float("nan"))
        if p_val == p_val:  # NaN guard
            candidates.append(p_val)

    for row in permutation_rows:
        for key in ("p_value", "best_p_value", "tap_p_value"):
            p_val = _safe_float(row.get(key), default=float("nan"))
            if p_val == p_val:
                candidates.append(p_val)

    if not candidates:
        return 1.0

    # Conservative aggregation: use the largest observed p-value so a single
    # weak significance read keeps the gate closed.
    return max(0.0, min(1.0, max(candidates)))


def _tau_signal(tau_rows: list[dict[str, str]], p_value: float) -> tuple[bool, str]:
    if not tau_rows:
        return False, "NO_EDGE"

    row = tau_rows[0]
    ci_lower = _safe_float(row.get("ci_lower"), default=0.0)
    ci_upper = _safe_float(row.get("ci_upper"), default=0.0)

    # Strict sign check: CI must be entirely positive or entirely negative.
    ci_excludes_zero = (ci_lower > 0 and ci_upper > 0) or (ci_lower < 0 and ci_upper < 0)
    tau_significant = ci_excludes_zero and p_value < 0.05
    return tau_significant, "CI_EXCLUDES_ZERO" if tau_significant else "NO_EDGE"


def _structural_signal(struct_rows: list[dict[str, str]]) -> tuple[bool, int]:
    if not struct_rows:
        return False, 75

    recent_weights = [
        _safe_float(row.get("weight"), default=0.0)
        for row in struct_rows
        if abs(_safe_float(row.get("proximity_days"), default=999.0)) <= 7
    ]
    max_weight = max(recent_weights, default=0.0)
    return max_weight >= 80, int(max_weight)


def _write_json_atomic(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with NamedTemporaryFile("w", encoding="utf-8", dir=path.parent, delete=False) as tmp:
        json.dump(payload, tmp, indent=2)
        tmp.write("\n")
        temp_name = tmp.name
    Path(temp_name).replace(path)


def compute_regime() -> None:
    """Build the daily regime gate from raw outputs."""
    tau_rows = _read_rows(TAU_CSV)
    permutation_rows = _read_rows(PERMUTATION_CSV)
    struct_rows = _read_rows(STRUCTURAL_CSV)

    p_value = _effective_p_value(tau_rows, permutation_rows)
    tau_significant, tau_status = _tau_signal(tau_rows, p_value)
    struct_confirmed, tap_weight = _structural_signal(struct_rows)

    regime = {
        "last_update_utc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "expires_utc": (datetime.now(timezone.utc) + timedelta(hours=24))
        .isoformat()
        .replace("+00:00", "Z"),
        "regime_favorable": struct_confirmed and tau_significant,
        "max_gain_factor": 0.5 + 0.5 * (tap_weight / 100.0),
        "structural_weight": tap_weight,
        "tau_status": tau_status,
        "risk_level_bias": "LONG_BIAS" if tau_significant and struct_confirmed else "NEUTRAL",
        "tap_p_value": p_value,
    }
    regime["hash"] = hashlib.sha256(
        json.dumps({k: regime[k] for k in REQUIRED_KEYS}, sort_keys=True).encode("utf-8")
    ).hexdigest()

    _write_json_atomic(REGIME_JSON, regime)
    print(
        f"✅ REGIME WRITTEN: {regime['regime_favorable']} | "
        f"Tap Weight: {tap_weight} | P={p_value:.4f} | Bias: {regime['risk_level_bias']}"
    )


if __name__ == "__main__":
    compute_regime()
