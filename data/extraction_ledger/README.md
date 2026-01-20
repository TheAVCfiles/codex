# Extraction Ledger Notion Import Pack

This folder contains Notion-ready CSV templates and setup guidance for the Extraction Ledger relational workspace. Import the CSVs in the order listed below, then wire the relations/rollups and formulas exactly as specified.

## Import order

1. `rates.csv`
2. `evidence_vault.csv`
3. `asset_log.csv`
4. `master_labor_axis.csv`

## Master Labor Axis (primary ledger)

**Properties (exact names + types):**

- **Activity/Asset** — Title
- **Track** — Select: `Track A (Instructional)` / `Track B (Architectural)`
- **Status** — Status: `Unpaid / Extracted`, `Partially Paid`, `Substantiated`
- **Date Range** — Date (range)
- **Market Role** — Relation → Rates
- **Proven Hours** — Number
- **Market Rate** — Rollup → Rates → `effective_rate`
- **Market Valuation** — Formula → `prop("Proven Hours") * prop("Market Rate")`
- **Fixation Flag** — Checkbox
- **Evidence ID** — Relation → Evidence Vault

**Entry template for Track B:**

- **Context:** “Studio collapsed due to COVID.”
- **Directive:** link the email/text requesting the pivot.
- **Result:** “Infrastructure created; currently in use (Asset ID: \_\_\_).”

## Rates (VALUATION_SLOTS_LOCKED)

**Properties:**

- **Role** — Title
- **base_rate_low** — Number
- **base_rate_high** — Number
- **base_rate_max** — Number
- **risk_multiplier** — Number
- **effective_rate** — Formula
- **valuation_notes** — Text

**Formula (effective_rate):**

```
if(
  not empty(prop("base_rate_max")),
  prop("base_rate_max"),
  round(
    ((prop("base_rate_low") + prop("base_rate_high")) / 2)
    * if(empty(prop("risk_multiplier")), 1, prop("risk_multiplier")),
    2
  )
)
```

## Evidence Vault

**Properties:**

- **Evidence ID** — Title
- **file_name** — Text
- **date** — Date
- **source** — Select (Email, Slack, Zoom, Drive, etc.)
- **description** — Text
- **hash_optional** — Text (SHA-256)
- **attachment** — Files
- **linked_labor** — Relation → Master Labor Axis

## Asset Log

**Properties:**

- **Asset ID** — Title
- **asset_type** — Select
- **created_date** — Date
- **creator** — Text
- **first_use** — Date
- **reuse_count** — Number
- **Market License Fee** — Number
- **monetized_flag** — Checkbox
- **evidence_ref** — Relation → Evidence Vault
- **Total Extracted Value** — Formula

**Formula (Total Extracted Value):**

```
prop("Market License Fee") * prop("reuse_count")
```

## Required views

1. **Extraction Gap** — Board view grouped by Track; filter Track = `Track B (Architectural)`.
2. **Metadata Timeline** — Timeline grouped by Evidence ID; filter Proven Hours > 0 (optional).
3. **Replacement Cost** — Table with Market Valuation sum in footer.

## Forensic Block (add inside each Master Labor Axis page)

```
FORENSIC BLOCK
HASH: <SHA-256>
AUTHOR: Allison
ORIGIN: <original filename>
MODIFIED: <ISO timestamp>
```
