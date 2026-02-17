import json
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd

# --- CONFIG ---
DAILY_OUTDIR = Path("daily_outputs")  # Where your τ, structural ledger CSVs live
REGIME_JSON = Path("daily_overlay_regime.json")

# Expected CSV schemas (from your daily run)
TAU_CSV = DAILY_OUTDIR / "tau_analysis_latest.csv"  # Columns: tau, ci_lower, ci_upper, p_value, etc.
STRUCTURAL_CSV = DAILY_OUTDIR / "structural_ledger_latest.csv"  # Columns: event_date, weight, proximity_days, etc.


def compute_regime() -> None:
    """Build the daily regime gate from raw outputs."""
    p_value = 1.0

    # 1) Load τ stats
    if TAU_CSV.exists():
        tau_df = pd.read_csv(TAU_CSV)
        ci_lower = tau_df["ci_lower"].iloc[0]
        ci_upper = tau_df["ci_upper"].iloc[0]
        p_value = float(tau_df["p_value"].iloc[0])
        tau_significant = (ci_lower > 0 or ci_upper < 0) and p_value < 0.05
    else:
        tau_significant = False  # Conservative fallback

    # 2) Load Structural Ledger (Proximity Face Interceptor)
    if STRUCTURAL_CSV.exists():
        struct_df = pd.read_csv(STRUCTURAL_CSV)
        recent_events = struct_df[struct_df["proximity_days"].abs() <= 7]
        max_weight = float(recent_events["weight"].max()) if not recent_events.empty else 0.0
        struct_confirmed = max_weight >= 80
        tap_weight = int(max_weight)  # Tap Weight = highest structural in window
    else:
        struct_confirmed = False
        tap_weight = 75  # Fallback

    # 3) Assemble regime
    regime = {
        "last_update_utc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "regime_favorable": struct_confirmed and tau_significant,
        "max_gain_factor": 0.5 + 0.5 * (tap_weight / 100.0),
        "structural_weight": tap_weight,
        "tau_status": "CI_EXCLUDES_ZERO" if tau_significant else "NO_EDGE",
        "risk_level_bias": "LONG_BIAS" if tau_significant and struct_confirmed else "NEUTRAL",
        "tap_p_value": float(p_value),
    }

    # Write to JSON (live runner reads this)
    REGIME_JSON.write_text(json.dumps(regime, indent=2), encoding="utf-8")
    print(
        f"✅ REGIME WRITTEN: {regime['regime_favorable']} | "
        f"Tap Weight: {tap_weight} | Bias: {regime['risk_level_bias']}"
    )


if __name__ == "__main__":
    compute_regime()
