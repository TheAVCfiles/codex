# Exhibit F — Verified Zelle Payment (November 20, 2020)

## Purpose

This exhibit preserves a machine-authenticated Zelle payment notice and aligns the record to the exact raw headers and HTML content provided.

## Corrected Core Facts (Header + Body Verified)

From the supplied raw email source:

- **From:** `"Zelle" <DoNotReply@zellepay.com>`
- **To:** `<alias1133@hotmail.com>`
- **Date header:** `Fri, 20 Nov 2020 05:20:13 GMT`
- **Subject:** `DANCE FACTORY RIDGEFIELD LLC sent you $1325.00`
- **Amount shown in HTML body:** `$1325.00` (`"DANCE F. has sent you $1325.00. Enjoy!"`)
- **Memo-style period shown in body:** `nov 2 to nov 15`
- **Message-ID present:** `<S6305POWAcsNPtN5G7j0002e5a6@s6305powa.prodew.int>`
- **Network Message ID present:** `0cb29277-3281-409d-20fb-08d88d13f741`

## Authentication and Transport Integrity

The same source shows aligned anti-spoofing/authentication and transport controls:

- `Authentication-Results` reports:
  - **SPF: pass**
  - **DKIM: pass** (`header.d=zellepay.com`)
  - **DMARC: pass** (`header.from=zellepay.com`)
  - `compauth=pass`
- `Received-SPF: Pass` with sender `smtp2.earlywarning.com (199.47.139.181)`
- TLS hop data present in `Received` headers (Microsoft SMTP Server, TLS 1.2 cipher lines)
- Early Warning infrastructure indicators present (`smtp2.earlywarning.com`, Proofpoint/EWS chain)

## Evidentiary Significance (Constrained to Source Facts)

1. **Corporate payor display is explicit in subject/header metadata** (`DANCE FACTORY RIDGEFIELD LLC`).
2. **Payment amount and period marker are visible in rendered body** (`$1325.00`, `nov 2 to nov 15`).
3. **Message provenance is technically corroborated** through SPF/DKIM/DMARC pass results and intact message identifiers.

## Prior Draft Corrections Applied

This revision corrects previously misstated fields by anchoring the exhibit to the provided source:

- Corrected payment date to **November 20, 2020** (was previously written as July 5, 2021).
- Corrected amount to **$1325.00** (was previously written as $1,125.00).
- Corrected memo/period language to **"nov 2 to nov 15"** (replacing prior unsupported memo text).

## Packaging Instructions

Store as: **Exhibit F — Verified Zelle Payment (November 20, 2020)**

Include in packet:

1. Raw `.eml` source export (unaltered)
2. Full header block (verbatim)
3. Rendered HTML-to-PDF output showing subject/body amount and period marker
4. Hash manifest (SHA-256) for each exported artifact
5. Evidence log entry with export method, date, and operator

Suggested tags:

- `corporate_payment`
- `authenticated_email_record`
- `zelle_transfer_notice`
- `compensation_timeline_input`

## Chain-of-Custody Notes

- Preserve original byte-level source before redaction.
- Redact recipient aliases only in derivative copies, not master evidence.
- Record each transformation (raw export → PDF render → annotated copy).
- Keep master copy read-only and hash-verified.
