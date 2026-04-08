# Technical Specifications

## Overview

This repository contains a multi-layer prototype stack focused on movement intelligence, transparent scoring, and governance-aware reporting.

Primary layers:

1. **Language / notation layer** (`.rou`, choreography primitives)
2. **Scoring layer** (PyRouette technical + artistic scoring)
3. **Signal layer** (pose / sensor-derived evidence)
4. **Governance layer** (regime checks, policy gates, auditable outputs)
5. **Application layer** (reports, UI portals, JSON artifacts)

## System Architecture

```text
Routine Spec (.json / .rou)
        ↓
Scoring Engine (TES + PCS + deductions/bonuses)
        ↓
Signal Integrity (timing/axis/stability checks)
        ↓
Regime & Governance Gates (open/closed posture)
        ↓
Outputs (report, receipt, dashboard, archival artifact)
```

## Core Data Contract

Routine-level data should include:

- `elements[]`
  - `id` / label
  - `bv` (base value)
  - `dd` (difficulty multiplier)
  - `goe` (judge adjustment)
  - optional timing windows (`start`, `end`)
- `pcs` component values
- `weights` for component weighting
- optional `deductions` and `bonuses`
- provenance metadata (performer, capture context, version)

## Scoring Specification

Element-level computation:

- `Raw_e = BV_e × DD_e × B_e`
- `Score_e = Raw_e + GOE_add_e`

Technical score:

- `TES = Σ Score_e`

Program components:

- Weighted aggregate across:
  - Movement Quality (`MQ`)
  - Transitions (`TR`)
  - Performance/Presence (`PP`)
  - Composition (`CO`)
  - Interpretation/Musicality (`IM`)

Final score:

- `FINAL = TES + PCS − deductions + bonuses`

## Governance / Regime Layer

A regime engine gates whether the system should escalate, remain safe, or refuse action.

Minimum expected properties in a regime snapshot:

- statistical confidence indicator (`p_value` or equivalent)
- structure confirmation flag
- regime open/closed state
- action posture (e.g., safe/defensive/scale-up)

Principle: execution and policy are separate concerns.

- execution computes values
- governance decides when those values are actionable

## Timing & Sensor Integrity Requirements

For defensible movement analytics, enforce:

- monotonic timestamp normalization across sources
- jitter buffering/reordering for networked packets
- per-session calibration/baseline correction
- coordinate-frame alignment across capture devices

These are mandatory for claims that depend on timing precision, axis stability, or travel thresholds.

## Outputs

Expected machine and human-readable artifacts:

- routine score reports (TES/PCS/final)
- integrity summaries (stability/tremor/threshold flags)
- comparative analyses (legacy judging vs transparent scoring)
- dashboard state snapshots (regime + metrics + timestamp)

## Operational Constraints

- Prefer reproducible, scriptable runs from structured input files.
- Keep scoring math transparent and inspectable.
- Preserve auditability: each result should be traceable to input routine, versioned rules, and run context.

## Versioning

- Specification changes must be version-tagged in documentation.
- Any math, threshold, or schema changes should include migration notes for prior report comparability.
