# Forensic Alignment Phase — Principal Étoile Protocol

> **Scope note:** This document is an organizational and evidence-alignment template. It is **not** legal advice and does not create an attorney–client relationship. Use it to prepare materials for qualified counsel or agencies.

## Objective

Create a **single, auditable narrative** that converts subjective memory into **verifiable, third‑party artifacts** (bank records, invoices, tax transcripts, property records). The goal is to present a concise, neutral, and persuasive record suitable for IRS/DOL review or attorney intake.

## Operating Doctrine (Mythic + Neutral)

- **Signal over story.** Every claim ties to a dated, third‑party record.
- **Receipts are the spine.** Events are indexed by bank statement lines, not recollection.
- **Neutral voice.** Present facts first; reserve interpretation for counsel.
- **Chain of custody.** Each artifact is stored, labeled, and cross‑referenced.

---

## 1) Evidence Locker Map (Folder Structure)

```
/forensics
  /A_home_improvements
  /B_yankee_event
  /C_1099_discrepancy
  /D_stock_liquidations
  /E_daily_subsidy
  /F_property_records
  /G_texts_and_requests
  /H_inventory_and_assets
  /I_transcripts_IRS
  /J_timeline_master
```

**Rule:** Each file name begins with `YYYY-MM-DD_source_subject_description` and is logged in the Master Index.

---

## 2) Master Evidence Index (Template)

| ID    | Date       | Source         | Description                   |  Amount | Linked Event | File Path                                            | Notes                     |
| ----- | ---------- | -------------- | ----------------------------- | ------: | ------------ | ---------------------------------------------------- | ------------------------- |
| E-001 | 2021-06-03 | Bank Statement | Debit: Yankee Stadium Invoice | 7000.00 | Phase I      | /forensics/B_yankee_event/2021-06-03_bank_yankee.pdf | Match to stock sale S-004 |

---

## 3) Forensic Comparison Table (Draft)

| Phase | Event / Item         |     Amount | Destination of Funds | Evidence Type             | Link ID |
| ----- | -------------------- | ---------: | -------------------- | ------------------------- | ------- |
| I     | Yankee Stadium Event |    ~$7,000 | Event invoice        | Bank Statement vs Invoice | E-001   |
| II    | Home Improvements    |  ~$10,000+ | Flooring/Bath/Garden | Receipts + Bank           | E-0xx   |
| III   | Daily Subsidy        | ~$1,200/mo | Groceries/Household  | Grocery + Zelle           | E-0xx   |
| IV    | “Ghost” 1099         |    $17,841 | Tax liability        | IRS transcript + bank     | E-0xx   |

---

## 4) The Three Kill‑Zones (Evidence Requirements)

### Zone A — Home Improvements

**Goal:** Prove capital improvements to another’s property paid by you.

- Amazon/Home Depot receipts
- Contractor invoices
- Matching bank statement lines
- Any texts requesting the purchases

### Zone B — Yankee Stadium Event

**Goal:** Prove coercion or request to pay; negate “gift” framing.

- Event invoice + confirmation email
- Bank statement debit
- Any texts or emails requesting payment

### Zone C — 1099 Discrepancy

**Goal:** Prove circular flow with $0 net gain.

- IRS Wage & Income transcripts (year(s) in question)
- Bank statements showing reported deposits
- Matching outbound payments for business supplies within 48–72 hours

---

## 5) Timeline: Stock Liquidations vs. Subject Expenses

**Method:** For each stock sale, identify any relevant purchases within **72 hours**.

| Stock Sale ID | Date       |   Amount | Bank Deposit      | Matched Expense | Evidence | Notes           |
| ------------- | ---------- | -------: | ----------------- | --------------- | -------- | --------------- |
| S-001         | 2020-08-14 | 3,500.00 | Deposit confirmed | Home Depot      | E-0xx    | Pending receipt |

---

## 6) Neutral Statement of Facts (Skeleton)

> The claimant’s brokerage statements show a series of liquidations totaling approximately $55,000. Bank statements show these funds were followed by payments for property improvements and business expenses connected to the respondent. No written gift letter or promissory note exists. A 1099-NEC in the amount of $17,841 was filed under the claimant’s SSN, while bank statements indicate $0 net retention after immediate expenditures for the respondent’s business. The evidence suggests a circular flow of funds and unjust enrichment.

---

## 7) Chain‑of‑Custody Checklist

- [ ] Every file labeled with date + source + subject
- [ ] Source PDFs preserved unedited
- [ ] Screenshots include URL bar + date (if digital)
- [ ] Master Index updated for each new artifact
- [ ] Timeline table updated with each matched pair

---

## 8) Next Actions (Minimal Friction)

1. Pull **IRS Wage & Income Transcripts** (target years).
2. Export **bank statements** spanning stock sales and reported 1099 income.
3. Export **brokerage trade history** (liquidations only).
4. Collect **invoices/receipts** (Home Depot/Amazon/contractors).
5. Populate the **Master Evidence Index**.

---

## 9) Advocacy Narrative (Short, Neutral)

**One‑paragraph summary for agencies:**

> The claimant’s personal assets were liquidated and used to fund another party’s property improvements and business expenses without a contract or repayment. An IRS 1099-NEC was filed for income not retained, supported by bank records indicating immediate circular outflows. This packet presents a date‑aligned evidence ledger for review.

---

## 10) Notes to Counsel

- Confirm state‑specific statutes of limitation (NY/CT) and any tolling arguments.
- Evaluate unjust enrichment, conversion, and wage‑and‑hour exposure.
- Evaluate potential identity‑theft reporting for erroneous 1099.

---

## Appendix A — File Naming Convention

`YYYY-MM-DD_source_subject_description.ext`

Example: `2021-06-03_bank_yankee_invoice.pdf`

---

## Appendix B — Master Index Fields (CSV)

```
ID,Date,Source,Description,Amount,LinkedEvent,FilePath,Notes
```
