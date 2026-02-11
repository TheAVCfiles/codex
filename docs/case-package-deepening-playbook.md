# Case Package Deepening Playbook (NY + CT + Federal Intake)

> **Purpose:** Build a fast, evidence-first packet that can recover immediate financial relief while preserving higher-value claims. This is a workflow document, not legal advice.

## 1) Immediate objective stack

1. **Stabilize cashflow quickly** through wage and victim-comp pathways that can be filed now.
2. **Preserve full-value claims** (misclassification, overtime, IP/public-use, retaliation, tax harm) by maintaining chain-of-custody and not overclaiming.
3. **Keep jurisdiction optionality** so filing in one lane does not poison another.

## 2) Jurisdictional chessboard (parallel lanes)

| Lane                     | Earliest practical use      | Core question                                                                  | Key statutes/rules to map                                                                                   | Output artifact                                 |
| ------------------------ | --------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| NY wage claim            | Immediate                   | Were hours worked in NY under control/direction and underpaid?                 | NYLL §§ 190-199-A (wage payment), NYLL § 663 (civil action), 12 NYCRR Part 142 (min wage/overtime baseline) | NY wage packet + hours/pay ledger               |
| CT wage claim            | Immediate/parallel          | Were hours worked in CT under direction/control and unpaid or underpaid?       | Conn. Gen. Stat. §§ 31-58 et seq., § 31-71a et seq., § 31-72                                                | CT wage packet + hours/pay ledger               |
| Federal labor floor      | Support lane                | Does FLSA overtime/minimum wage framework strengthen employee-status argument? | 29 U.S.C. §§ 206-207, 29 C.F.R. Part 541/Part 778 (as applicable)                                           | Federal-support memo (non-duplicative)          |
| DV economic harm support | Immediate if eligible       | Are documented losses tied to victimization and displacement?                  | NY Exec. Law § 620 et seq. (OVS framework), agency intake standards                                         | Victim compensation ledger                      |
| Tax/1099 mismatch lane   | After ledger reconciliation | Did information returns misstate earnings or conceal withheld pay?             | IRS Form 4852 / 3949-A workflows; publication-level guidance                                                | Tax discrepancy memo + statement reconciliation |
| IP/public-use lane       | After C1/C2 proof           | Was authored choreography/curriculum publicly used without license?            | Copyright authorship/ownership + implied license defenses (fact-specific)                                   | DFR Public Use Comparison Grid                  |

## 3) Evidence pipeline (non-negotiable)

1. Ingest artifacts into `data/forensics/*` with filenames that preserve date and source.
2. Hash each artifact and store the SHA-256 in `data/forensic_evidence_summary.csv`.
3. Keep one atomic row per claimable fact; no merged stories.
4. Force every row through defense-first review:
   - probable defense narrative,
   - best rebuttal artifact,
   - confidence score.

## 4) Recalculation method for losses (current and updateable)

### 4.1 Hours & Pay Ledger formulas

For each line item (class/rehearsal/private/admin):

- `verified_hours = end_time - start_time` (only if source artifact exists)
- `agreed_rate = written rate` (if missing, keep as hypothesis and exclude from final damages total)
- `expected_pay = verified_hours * agreed_rate`
- `actual_pay = matched deposits/payments for same period`
- `delta_unpaid = expected_pay - actual_pay`

### 4.2 Private lesson undercharge lane

Where evidence shows historical private rate >= `$100` and paid amount reflects `$50` docking pattern:

- `private_delta = (documented_market_or_historic_rate - documented_paid_rate) * verified_private_count`
- Keep this in a **separate bucket** until each private is individually corroborated by scheduling + payment + communication artifacts.

### 4.3 Overtime lane (state + federal comparison)

- Compute weekly totals first (`sum(hours by workweek)`).
- Any week over 40 hours enters overtime review queue.
- Apply the governing overtime multiplier only once employee status and regular rate are verified per week.

### 4.4 Inflation and present-value view

Maintain two totals to avoid controversy:

- **Nominal damages total** (date-of-loss dollars).
- **Inflation-adjusted analytical total** (CPI-adjusted) for negotiation narrative only.

## 5) DFR Public Use Comparison Grid (IP lane)

Minimum fields per asset row:

- Grid ID
- Asset type (choreo/curriculum/backdrop/music/program copy)
- Proof of origin artifact
- Public use artifact
- First and last observed use dates
- Match strength (C0/C1/C2)
- Compensation model (license/performance/settlement)
- Low/target/high valuation

**Rule:** Assign money values only to C1+ rows; reserve aggressive asks for C2.

## 6) 14-day execution plan

### Day 1-2: Intake freeze

- Build artifact manifest from screenshots, statements, calendars, and email exports.
- Populate first 50 rows in `data/forensic_evidence_summary.csv` as unverified placeholders.

### Day 3-5: Wage core

- Build weekly work ledger for 2019-2022 by geography (Wilton, Rye, Greenwich, remote/digital).
- Reconcile pay records and 1099 entries against ledger periods.

### Day 6-8: Rapid filing lane

- Generate NY + CT filing-ready summaries with only C1/C2 rows.
- Prepare OVS economic-loss subset with displacement and direct out-of-pocket items.

### Day 9-11: IP/public-use lane

- Build first 10 rows of DFR Public Use Comparison Grid from strongest-origin assets.
- Attach corroborating public artifacts (programs, flyers, reels, social captures).

### Day 12-14: Counsel handoff

- Package into agency-first brief + litigation reserve appendix.
- Add open-issues list showing what remains C0 and why.

## 7) Guardrails for credibility and safety

- Never claim a fact without an artifact.
- Keep protected address and safety-sensitive data redacted in outward-facing packets.
- Separate immediate relief filings from broader civil allegations to avoid intake overload.
- Preserve originals; work from copies.

## 8) Deliverables checklist (living)

- [ ] `data/forensic_evidence_summary.csv` populated with current evidence rows.
- [ ] Verified Hours & Pay Ledger (weekly).
- [ ] DFR Public Use Comparison Grid.
- [ ] NY wage packet (C1/C2 only).
- [ ] CT wage packet (C1/C2 only).
- [ ] OVS economic loss subset packet.
- [ ] Tax discrepancy memo (only after ledger reconciliation).
