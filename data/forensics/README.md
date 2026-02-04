# Forensic Evidence Summary (Living Table)

This folder anchors the evidence workflow that feeds `data/forensic_evidence_summary.csv`.
Each row in the CSV must map to a source artifact (statement, receipt, invoice, transcript,
message log). If an artifact is missing, keep the row **Unverified** and add a follow-up task.

## CSV column schema (authoritative)

Use the exact header row below. Do not rename columns without migrating existing data.

```
row_id,claim_brief,angle/approach,date,amount,vendor / counterparty,file_id,evidence_location,sha256,created_time,modified_time,extracted_text_snippet,verification_status,confidence,defense_narrative,rebuttal_evidence,notes / next actions
```

## Zero-loss protocol

1. **Do not edit facts without a source.** If the artifact is missing, mark **Verification Status = Unverified**.
2. **Every row must map to evidence.** The “Evidence Location” column is mandatory once verified.
3. **Never collapse multiple claims into one row.** Keep rows granular and atomic.
4. **Angle ≠ claim.** The “Angle/Approach” column is the analytic lens, not a legal conclusion.
5. **Defense-first framing.** Record the most likely defense narrative, then rebut with artifacts.

## Recommended artifact layout

```
data/forensics/
  statements/
  receipts/
  invoices/
  tax/
  messages/
```

## Verification rubric

- **Verified**: Artifact is attached in repo and the date/amount match the row.
- **Partially verified**: Artifact exists but missing cross-link (e.g., receipt without bank match).
- **Unverified**: Placeholder only; no source attached.

**Confidence** should be **Low** unless both the source and cross-link exist.

## Update checklist

- [ ] Add the artifact file under `data/forensics/` (or note its exact location).
- [ ] Record exact date, amount, and vendor.
- [ ] Add cross-link (statement ↔ receipt ↔ message).
- [ ] Mark verification status and confidence.
- [ ] Note the defense narrative and rebuttal evidence.
