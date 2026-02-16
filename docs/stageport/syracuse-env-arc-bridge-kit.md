# Syracuse ENV-ARC Pilot — Built Environment Bridge Kit

This packet converts NAAB 2020 conditions into **data-minimized, tamper-evident artifacts** suitable for accreditation review.

## StagePort x NAAB cross-walk

| NAAB condition (2020)                           | Risk / gap                                       | StagePort subsystem         | Sovereign artifact                                                 |
| ----------------------------------------------- | ------------------------------------------------ | --------------------------- | ------------------------------------------------------------------ |
| 1. Program Identity (Mission & Self-Assessment) | Narrative drift across admin cycles              | Navel (Gravity)             | `RAW_INGEST_ANNUAL.hash` (timestamped curriculum gravity snapshot) |
| 2. Shared Values (EDI, Collaboration)           | Stayed DEI requirements create legal uncertainty | Heart (Relational)          | `ISOTROPIC_MAP_v1.pdf` (uniform access geometry)                   |
| 3. SPCs (PC.1–PC.8)                             | Opaque grading and subjective mastery            | Nervous System (ChoreoCode) | `SPC_MATRIX_HASHED.json` (threshold-scored portfolio matrix)       |
| 4. Public Information                           | Metric inflation                                 | Legs (Funnel)               | `RETENTION_FLOW.csv` (immutable progression telemetry)             |
| 5. Resources                                    | Facilities decay without continuous audit        | Ribcage (Defense)           | `STUDIO_DENSITY_AUDIT.md` (sq-ft-per-user audit + alerts)          |
| 6. Records                                      | Long-term archival loss                          | Sovereign Ledger            | `ARCHIVE_BUNDLE_2026.zip` (sealed cohort bundle)                   |

## Strategic wedge for PC.8 (Social Equity)

When policy language is legally sensitive, the safer proof path is **facility physics**:

- measure **friction of access** instead of personal demographics,
- prove **isotropic reachability** for critical zones,
- store only anonymized and hashed operational signals.

This keeps evidence practical, neutral, and defensible.

## Bridge kit structure

```text
SYR_ENV_ARC_PILOT_2026/
├── 00_MANIFEST.txt
├── 01_CONDITION_5_RIBCAGE/
│   ├── studio_isometric_map.pdf
│   └── facility_density_log.csv
├── 02_CONDITION_3_NERVES/
│   ├── SPC_PC8_Equity_Proof.json
│   └── SPC_PC5_Climate_Log.md
├── 03_CONDITION_6_LEDGER/
│   ├── student_portfolios/
│   └── grade_rubric_v1.lock
└── 04_GOVERNANCE/
    └── 28_day_conductor_log.txt
```

## Usage

Generate the full kit with:

```bash
python3 scripts/stageport/build_bridge_kit.py
```

The script writes a deterministic folder skeleton, injects a `SPC_PC8_Equity_Proof.json` scaffold, and creates `00_MANIFEST.txt` with SHA-256 digests for every generated file.
