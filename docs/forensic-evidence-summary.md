# Forensic Evidence Summary (Living Table)

This file is the audit-facing guide for maintaining the living evidence table in `data/forensic_evidence_summary.csv`. The purpose is zero-loss traceability: every claim in the table must point to a source artifact (statement, receipt, invoice, transcript, or message log). If a source is missing, the entry stays **Unverified** until the artifact is attached. This prevents hallucination and makes updates safe to scrutinize.

## How to use the table (zero-loss protocol)

1. **Do not edit facts without a source.**  
   If you don’t have the artifact, mark **Verification Status = Unverified** and add a follow-up task.
2. **Every row must map to evidence.**  
   The “Evidence Location” column is mandatory once verified; it should reference a path or filename in this repo.
3. **Never collapse multiple claims into one row.**  
   If two receipts or transactions exist, they get separate rows. Granularity beats narrative.
4. **Angle ≠ claim.**  
   “Angle/Approach” is the lens for analysis (unjust enrichment, circular transaction, identity theft), not a legal conclusion.
5. **Defense-first framing.**  
   Each row must list the most likely defense narrative, then the counterpoint grounded in artifacts.

## Recommended folder layout for artifacts

If you want strict traceability, use a structure like:

```
data/forensics/
  statements/
  receipts/
  invoices/
  tax/
  messages/
```

Then reference these paths in the “Evidence Location” column.

## Verification rubric (scrutinizing for hallucination)

- **Verified**: Artifact is attached in repo and date/amount match the row.
- **Partially verified**: Artifact exists but missing cross-link (e.g., receipt exists but bank transaction not yet matched).
- **Unverified**: Placeholder only; no source attached.

**Confidence** should drop to **Low** unless both the source and the cross-link exist.

## Angles & approaches (keep them distinct)

Use these as analytical lenses to avoid overclaiming:

- **Direct capital transfer**: Stock liquidation aligns with a specific outgoing payment.
- **Unjust enrichment**: Funds increase another party’s property or business without contract.
- **Circular transaction**: Funds are paid to you and immediately routed back to the payer’s benefit.
- **Identity theft**: Tax reporting shows income you did not retain.
- **Pattern evidence**: Separate incident supporting common scheme when corroborated.

## Update checklist (every time you add a row)

- [ ] Add the artifact file to `data/forensics/` (or note its exact location).
- [ ] Record exact date, amount, and vendor.
- [ ] Add cross-link (statement ↔ receipt ↔ message).
- [ ] Mark verification status and confidence.
- [ ] Note the defense narrative and rebuttal evidence.

## Why this table is the backbone

This keeps the story out of your head and inside a verifiable ledger. It is a mirror, but one made of receipts—not memory. Use it to move cleanly from “narrative” to **audit-ready proof**.
