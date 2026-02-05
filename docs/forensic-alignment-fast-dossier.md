# Forensic Alignment — Fast Dossier (NY/CT COVID‑Era, DV Context)

**Purpose**
Create a clean, evidence-first dossier that converts lived experience into an audit-ready, non‑speculative record for rapid action. This document is a **working spine** for counsel/advocates to attach evidence and calculate wages, damages, and relief pathways without re‑telling the story. It is **not legal advice**.

**Scope**

- NY/CT labor and tax‑adjacent claims during COVID‑era work.
- DV context (safety, confidentiality, and institutional handling).
- Evidence‑first: no assertions without artifacts.

---

## 0) Immediate triage (same‑day stabilization)

1. **Secure evidence first**

   - Preserve originals, copy into a processing vault, and hash every file. This keeps chain‑of‑custody intact and supports later filings. Follow the local‑first evidence kit workflow for strict control of originals and hashes.【F:docs/avc-local-evidence-kit.md†L3-L18】

2. **Start the statutory intake stream**

   - Use the Statutory Reservoir Ingest Schema to convert each artifact into a statutory‑tagged entry (artifact + statute + element). This keeps evidence aligned and non‑speculative.【F:docs/statutory-reservoir-ingest-schema.md†L1-L79】

3. **Build a single evidence log**
   - Populate a living evidence table (one row per artifact, all facts, no narrative) before any narrative package. This supports the “Archive” layer and keeps proof frozen and auditable.【F:docs/theater-model-stage-wings-archive.md†L1-L19】

---

## 1) Evidence‑first dossier structure (zero‑loss)

**Folder layout (local‑first, recommended)**

```
/data/forensics/
  originals/
  copies/
  metadata/
  packets/
  forensic_evidence_summary.csv
```

Use the local evidence kit workflow to generate the evidence timeline, JSON, and offline dashboard once files are staged locally.【F:docs/avc-local-evidence-kit.md†L14-L18】

**Evidence table (living CSV)**
Use a strict evidence log that maps each artifact to a statute and claim element (no narrative, no assumptions). The statutory ingest schema defines a canonical structure and status codes for verification.【F:docs/statutory-reservoir-ingest-schema.md†L1-L103】

**Minimum columns (copy‑ready)**

```
row_id,date,claim_brief,statute,element,evidence_type,evidence_location,hash_sha256,verification_status,confidence,notes
```

**Verification status**

- **C0** — Artifact missing.
- **C1** — Artifact present, single‑source proof.
- **C2** — Corroborated by multiple independent artifacts.【F:docs/statutory-reservoir-ingest-schema.md†L55-L103】

---

## 2) COVID‑era wage/work reconstruction (defensible method)

**Goal**: compute verified hours and unpaid amounts without over‑claiming.

**Inputs (evidence‑anchored)**

- Class schedules and lesson plans.
- Emails or texts requesting work or confirming deliverables.
- 1099s and payment records (deposits, Zelle, checks).
- Production artifacts (choreography files, digital backdrops, show programs).

**Method (minimal assumptions)**

1. **Verified teaching hours** = sum of scheduled class hours + rehearsals shown in schedules or calendar evidence.
2. **Verified production hours** = hours evidenced in project files or explicit “deliverable requested by date” emails.
3. **Admin/prep hours** = only count if explicitly evidenced (messages requesting prep or time logs). If no evidence exists, leave blank and mark C0.
4. **Rate applied** = use documented rate (e.g., 1099 stated rate) or explicit payment terms in writing. If the rate is implied, keep it in a separate “hypothesis” column and do not include in totals until verified.

**Output**

- A running **hours‑worked ledger** tied to evidence IDs, and a separate **unpaid‑amount ledger** tied to verified rates only.

This protects credibility and maximizes the use of corroborated evidence for claims. The Theater Model outlines a wage‑loss calculation framework that can be adapted once evidence is slotted and verified.【F:docs/theater-model-stage-wings-archive.md†L21-L78】

---

## 3) Fast‑path relief map (non‑speculative)

**Target: fastest viable relief without compromising safety**

1. **NY DOL wage claim** (primary, faster relief)

   - COVID‑era work performed from NY while in DV shelter is prioritized in the existing framework; this path supports liquidated damages and confidentiality measures.【F:docs/theater-model-stage-wings-archive.md†L225-L246】

2. **NY OVS (victim compensation)**

   - Supports economic loss tied to documented harm and DV context. This path is flagged as a fast‑money option in the current theater‑model workflow.【F:docs/theater-model-stage-wings-archive.md†L106-L115】

3. **CT DOL claim**

   - Secondary path for CT‑based work or misclassification; this is already framed as a parallel option in the workflow notes.【F:docs/theater-model-stage-wings-archive.md†L225-L246】

4. **IRS identity‑theft + fraud pattern (if 1099 misreporting exists)**
   - Use the IRS workflow sequence for “ghost pay” only after evidence shows a mismatch between reported income and actual net deposits.【F:docs/theater-model-stage-wings-archive.md†L267-L287】

**Privacy / safety adjustment**
Use confidential address protections and safe contact addresses in filings; keep disclosures limited to county/city of work rather than current location. The workflow explicitly notes this privacy‑safe approach for NY DOL and OVS filings.【F:docs/theater-model-stage-wings-archive.md†L111-L138】

---

## 4) Evidence‑anchored narrative control (no overreach)

When the facts are messy, **narrative must be anchored only to artifacts**. Use this rule:

- **If no artifact, don’t claim it.**
- **If there is an artifact, index it and attach it to a statutory element.**

The statutory ingest schema enforces this by requiring artifact IDs, statutes, and elements for every entry.【F:docs/statutory-reservoir-ingest-schema.md†L1-L103】

---

## 5) Fast‑build packet checklist (what to compile first)

**Priority set (highest evidentiary value)**

1. **1099s + payment records** (to show misclassification or underpayment).
2. **Schedules and class logs** (to establish hours).
3. **Production files** (choreography, backdrops, music edits).
4. **Messages requesting work** (requests, deadlines, confirmations).
5. **DV / safety documentation** (orders of protection, shelter correspondence) — for confidentiality requests and safety context.

This ordering keeps the packet aligned with wage claims, compensation, and confidentiality without over‑relying on narrative. The theater‑model archive already frames these items as high‑impact for fast relief pathways.【F:docs/theater-model-stage-wings-archive.md†L106-L137】

---

## 6) Deliverables to produce next (automatable)

1. **forensic_evidence_summary.csv** (living log).
2. **evidence_manifest.json** (hashes + metadata).
3. **red_flag_report.pdf** (top legal‑risk items and urgent safety artifacts).
4. **hours_worked_ledger.csv** (verified hours only).
5. **unpaid_amounts_ledger.csv** (only when rate evidence exists).

These outputs are compatible with the evidence kit and statutory ingest schema, ensuring chain‑of‑custody and non‑speculative reporting.【F:docs/avc-local-evidence-kit.md†L14-L18】【F:docs/statutory-reservoir-ingest-schema.md†L1-L103】

---

## 7) Guardrails (protect credibility)

- **No legal advice**: keep this dossier factual and evidence‑linked.
- **No external claims** unless backed by an artifact.
- **Mark hypotheses** as hypotheses; never blend them into verified totals.

This aligns with the statutory ingest schema’s guardrails and keeps the dossier credible for counsel, agencies, and compensation programs.【F:docs/statutory-reservoir-ingest-schema.md†L8-L13】

---

## 8) Quick start (minimal steps)

1. Stage evidence into `/data/forensics/originals/`.
2. Hash and inventory files (local‑first).【F:docs/avc-local-evidence-kit.md†L14-L18】
3. Create the living evidence CSV using the schema above.
4. Slot each artifact into a statutory entry (C0/C1/C2).
5. Build the hours‑worked ledger from only verified schedules/messages.

---

**Status:** Ready to populate. Once artifacts are staged, this dossier can be converted into a case packet without altering narrative or adding assumptions.

---

## Appendix: One‑page relief + evidence intake (print‑ready)

If you need a one‑page, print‑ready intake for advocates or intake teams, use:

- **`docs/forensic-alignment-onepage.md`** — a compact, evidence‑first relief sheet with the same guardrails and privacy‑safe defaults.
- The one‑pager includes manual PDF export steps (Print → Save as PDF).

## Appendix: Single case spine (evidence‑first base)

- **`docs/single-case-spine.md`** — the single, coherent case backbone that all artifacts and timelines attach to.
