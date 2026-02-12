# Core Case Base — Verification-Gated Command Layer

**Purpose**
Create a single command layer that keeps case operations evidence-first, verification-gated, and handoff-safe across legal, advocacy, and forensic workstreams. This document is a workflow and control surface, **not legal advice**.

---

## 1) Verification-gated damages tracking

Use a strict confidence model for every monetary line item:

- **C0** — claim exists but artifact is missing.
- **C1** — single-source artifact supports the claim.
- **C2** — multiple independent artifacts corroborate the claim.

Only include **C1/C2** amounts in running totals. Keep C0 values in a separate hypothesis ledger.

**Required fields per line item**

```csv
claim_id,category,amount_min,amount_max,jurisdiction,evidence_ids,verification_status,last_reviewed,notes
```

**Core rule:** if proof cannot be traced to an artifact ID, the amount does not enter verified totals.

---

## 2) Filing strike order (speed + survivability)

Prioritize filings by expected speed of relief and evidence readiness:

1. **NY DOL wage claim** (fastest wage path when NY work is documented).
2. **NY OVS compensation** (economic loss with safety-aware intake).
3. **CT DOL claim** (parallel for CT work periods).
4. **IRS 3949-A / 211 stack** (after income-reporting mismatch is documented).
5. **IP licensing/back-pay demand** (after use grid reaches C2 on core assets).

For each path, track:

- intake status,
- blocking evidence gaps,
- deadline clock,
- next operator action.

---

## 3) Workstream output contracts

Standardize outputs so each operator hands forward cleanly:

- `forensic_evidence_summary.csv` — canonical artifact log.
- `hours_worked_ledger.csv` — verified labor hours only.
- `unpaid_amounts_ledger.csv` — rate-backed unpaid totals.
- `ip_public_use_comp_grid.csv` — asset reuse with valuation ranges.
- `filing_readiness_board.csv` — per-jurisdiction readiness and blockers.
- `handoff_manifest.md` — latest status, risks, and next actions.

Every output should include a `generated_at` timestamp and source artifact references.

---

## 4) Handoff guardrails (no drift)

Before handoff, perform a guardrail check:

1. **Evidence integrity:** artifact IDs resolve and hashes are present.
2. **Narrative integrity:** no claim statements without linked artifacts.
3. **Math integrity:** totals equal sum of C1/C2 rows only.
4. **Scope integrity:** legal strategy items are labeled informational, not advice.
5. **Safety integrity:** public packets exclude sensitive location/contact data.

If any check fails, mark packet **HOLD** and record remediation steps.

---

## 5) Operator cadence

Use this repeatable cycle:

1. Ingest new artifacts.
2. Update verification status (C0/C1/C2).
3. Recompute verified totals.
4. Advance filing board by jurisdiction.
5. Publish updated handoff manifest.

This cadence keeps the case base stable under pressure and prevents unsupported claims from entering external filings.
