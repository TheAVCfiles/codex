# StagePort × NAAB Bridge Kit (Pilot Starter)

This folder provides a minimal, implementation-ready starter for the Syracuse ENV-ARC pilot workflow described in the architecture notes.

## Included artifacts

1. `SPC_PC8_Equity_Proof.schema.json`

   - JSON Schema for a data-minimized, no-PII proof artifact.
   - Frames PC.8 evidence as **physical access friction** and isotropic access metrics.

2. `RIBCAGE_AUDIT_ONE_PAGER.md`

   - Dean-facing one-pager template for facility density and accessibility risk.

3. `build_condition6_bundle.py`
   - Script that generates a tamper-evident Condition 6 archive skeleton.
   - Produces manifest hashes for files to support auditability.

## Quick start

```bash
python project/bridge_kit/build_condition6_bundle.py
```

Output defaults to:

- `SYR_ENV_ARC_PILOT_2026/`
- `00_MANIFEST.txt` SHA-256 ledger
- Condition folders and placeholder artifacts

## Privacy posture

All templates follow a **maximum no-PII** posture:

- No demographic fields required.
- Only operational geometry/access telemetry and salted anonymized aggregates.
