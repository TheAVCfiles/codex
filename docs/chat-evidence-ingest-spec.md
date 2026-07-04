# Chat Evidence Ingest Spec (Timestamped Extraction)

This spec defines a minimal, auditable flow from unstructured chat content to structured evidence records.

## 1) Canonical lanes

1. **RAW_INGEST** (upstream, unfiltered, never normalized in-place)
2. **EVIDENCE** (downstream, structured, claim-oriented)

Always preserve lane order:

- Raw text is captured first.
- Structured evidence is derived second.
- Evidence links back to its originating raw record.

## 2) `#evidence` capture block

Use this exact template when promoting material from RAW_INGEST into EVIDENCE:

```text
#evidence
Title:
Date:
Source:
Link:
Authored By:
Proves:
Related To:
Tags:
Extracted At:
Derived From:
```

### Field notes

- **Date**: event or document date (if known)
- **Extracted At**: timestamp when this evidence card was created from raw ingest
- **Derived From**: RAW_INGEST record ID, URI, or primary key

## 3) Airtable table design

### Table: `RAW_INGEST`

- `Timestamp` (created time)
- `Raw Input` (long text)
- `Source` (single line text, optional)
- `Converted?` (checkbox)

### Table: `EVIDENCE`

- `Title` (single line text)
- `Date` (date)
- `Source` (single select or single line text)
- `Link` (URL or attachment)
- `Authored By` (single line text)
- `Proves` (long text)
- `Related To` (linked record or single line text)
- `Tags` (multi-select)
- `Extracted At` (created time or datetime)
- `Derived From` (link to `RAW_INGEST`)

## 4) Timestamp policy

Use two independent timestamps:

- **Origin timestamp** (`Date`): when the original source event/document occurred.
- **Extraction timestamp** (`Extracted At`): when it was converted into structured evidence.

If origin date is unknown:

- leave `Date` blank (or use an explicit `Unknown` convention), and
- still populate `Extracted At` automatically.

## 5) Example normalized card

```text
#evidence
Title: AVC_Liquidity_Wall_and_Unlocks_v1
Date: 2025-11-10
Source: PDF
Link: https://...
Authored By: Allison Van Cura
Proves: Defines unlock logic and pricing posture.
Related To: Liquidity Strategy / StagePort Licensing
Tags: liquidity, licensing
Extracted At: 2026-02-14T00:00:00Z
Derived From: RAW_INGEST:rec_01J...
```

## 6) Promotion rule (RAW -> EVIDENCE)

Promote only when content does at least one of the following:

- proves a specific claim,
- anchors a date,
- confirms authorship,
- confirms use, or
- confirms payment/non-payment.

Everything else stays in RAW_INGEST.
