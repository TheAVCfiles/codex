# Core Case Base — Forensic Alignment Command Layer

**Purpose (not legal advice)**  
This is the **core command layer** for a single case build: one place to track verified damages, filing sequence, and evidence maturity without mixing speculation into claims.

---

## 1) Core posture

- **Evidence-first only**: every number must map to an artifact.
- **Verification codes**:
  - **C0** = reported, awaiting artifact
  - **C1** = single-source artifact present
  - **C2** = corroborated by independent artifacts
- **No unverified totals** in filing-ready packets.

---

## 2) Damages board (working, verification-gated)

> Enter each category separately; never collapse categories into one total unless each row is C1/C2.

| Damage ID | Category                                 | Estimated Amount (Low) | Estimated Amount (High) | Evidence Location | Verification | Notes                                        |
| --------- | ---------------------------------------- | ---------------------: | ----------------------: | ----------------- | ------------ | -------------------------------------------- |
| D-001     | Asset liquidation / savings depletion    |                        |                         |                   | C0           | Link broker statements, transaction logs.    |
| D-002     | Tax harm (1099 mismatch / ghost pay)     |                        |                         |                   | C0           | Link transcript + deposit mismatch proof.    |
| D-003     | Unpaid labor / misclassification         |                        |                         |                   | C0           | Link schedules, class logs, payment records. |
| D-004     | Unreimbursed business purchases          |                        |                         |                   | C0           | Link receipts + business-use message trail.  |
| D-005     | Displacement / forced relocation costs   |                        |                         |                   | C0           | Link lease/hotel/rental docs + timeline.     |
| D-006     | IP reuse / choreography / curriculum use |                        |                         |                   | C0           | Link proof-of-origin + public-use artifact.  |

---

## 3) Filing strike order (fastest-first)

1. **NY OVS + NY DOL** (fastest relief lane)
2. **CT DOL** (parallel labor lane)
3. **IRS identity-theft / false reporting lane** (only after mismatch evidence is C1/C2)
4. **IP/civil licensing lane** (only after proof-of-origin + use are C1/C2)

> Keep address handling privacy-safe: county/city where possible and confidential address status when applicable.

---

## 4) Workstream matrix (owner + output)

| Workstream               | Primary Output                       | Minimum Standard                |
| ------------------------ | ------------------------------------ | ------------------------------- |
| Evidence Intake          | `forensic_evidence_summary.csv` rows | Hash + timestamp + source path  |
| Timeline Spine           | Verified event rows                  | C1/C2 only in “Proven” timeline |
| Wage/Rate Reconstruction | `hours_worked_ledger.csv`            | Documented rate only            |
| IP Comparison            | Public Use Comparison Grid           | Proof-of-origin + use artifacts |
| Packet Build             | Advocate/counsel bundle              | No C0 in final claims section   |

---

## 5) Core handoff checklist

- [ ] `docs/single-case-spine.md` populated (Identity, Timeline, Work/IP sections)
- [ ] `docs/proven-dates-times-work-arts.md` updated (C0/C1/C2 separation)
- [ ] `docs/forensic-alignment-onepage.md` exported to PDF for intake
- [ ] Damages board rows upgraded from C0 to C1/C2 with links
- [ ] Final packet excludes speculative totals

---

## 6) Guardrails

- Do not claim criminal elements in summaries without artifact-backed facts.
- Keep “reported” and “proven” sections separate at all times.
- Prefer additive updates (append-only log behavior) for audit traceability.

**Status:** This file is the core command board. Populate it before filing packets.
