# Single Case Spine (Evidence-First, Non-Speculative)

This document is the **single case spine** for organizing all claims into one coherent, audit-ready base. It is **evidence-first** and **non‑speculative**: every statement must tie to a concrete artifact before it can be promoted to Proven.

## How to use this spine

- **Reported (C0)** = stated but not yet verified by artifacts.
- **Proven (C1/C2)** = anchored to artifacts in `data/forensics/` and logged in `data/forensic_evidence_summary.csv`.
- Use this spine to **coordinate the timeline, work outputs, money flows, and public-use correlations** without mixing narrative and proof.

---

## 1) Case identity + scope

- **Case name**:
- **Primary parties** (individuals + entities):
- **Geography** (NY/CT):
- **Time window**:
- **Primary work streams** (curriculum, choreography, digital assets, production support):
- **Public-use surface** (DFR/DFER productions, marketing, classes):

---

## 2) Timeline spine (evidence-first)

> Populate dates only when artifacts exist. Until then, keep items in Reported with C0.

### Proven (C1/C2)

| Row ID | Date (ISO) | Location | Event / Work Output | Artifact / Evidence Location | Proof ID | Verification Status | Notes |
| ------ | ---------- | -------- | ------------------- | ---------------------------- | -------- | ------------------- | ----- |

### Reported (C0)

| Row ID | Reported Date Range | Location | Reported Event / Work Output | Needed Artifact(s) | Status | Notes |
| ------ | ------------------- | -------- | ---------------------------- | ------------------ | ------ | ----- |

---

## 3) Work outputs (inventory)

> Each asset should be trackable as a discrete item (routine, curriculum block, digital backdrop, music edit, program copy, etc.).

| Work ID | Asset Type | Title / Identifier | Reported Origin Context | Needed Artifact(s) | Status |
| ------- | ---------- | ------------------ | ----------------------- | ------------------ | ------ |

---

## 4) Evidence log cross‑links

Use these sources to promote Reported items to Proven:

- `data/forensic_evidence_summary.csv` — authoritative evidence log.
- `data/forensics/` — artifact repository (statements, receipts, invoices, tax, messages).

When an artifact is added, update:

- **Evidence Location** (path or proof ID)
- **Verification Status** (C1/C2)
- **Notes** (what the artifact proves)

---

## 5) Public-use correlation (DFR/DFER)

> This section stays empty until you attach public-use artifacts (programs, flyers, videos, posts). It will later cross‑link to the Work Outputs inventory.

| Correlation ID | Work ID | Public Use Artifact | Date Observed | Use Surface | Match Strength (C0/C1/C2) | Notes |
| -------------- | ------- | ------------------- | ------------- | ----------- | ------------------------- | ----- |

---

## 6) Money + hours (strict, evidence‑only)

> Hours and amounts must be backed by schedules, rosters, invoices, 1099s, or payments. No estimates.

### Hours ledger (verified only)

| Row ID | Date | Work Type | Hours | Rate | Amount | Evidence Location | Verification Status |
| ------ | ---- | --------- | ----- | ---- | ------ | ----------------- | ------------------- |

### Payments ledger (verified only)

| Row ID | Date | Amount | Source | Evidence Location | Verification Status | Notes |
| ------ | ---- | ------ | ------ | ----------------- | ------------------- | ----- |

---

## 7) Required artifact checklist (to promote C0 → C1/C2)

- [ ] iMessage exports with timestamps (not just screenshots)
- [ ] Email threads referencing storage unit, work requests, or deliverables
- [ ] Schedules / rosters / class logs
- [ ] Invoices / payment records / 1099s
- [ ] Program PDFs / marketing materials / public posts showing reuse
- [ ] Original work files (choreo notes, music edits, digital backdrops)

---

## 8) Promotion rules (non‑negotiable)

- No claim moves to Proven without a concrete artifact.
- Each artifact must be logged in the evidence summary CSV.
- If a claim is disputed, add counter‑artifact(s) and preserve both in the record.
