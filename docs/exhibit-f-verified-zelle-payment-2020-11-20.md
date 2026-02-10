# Exhibit F — Verified Zelle Payment Records (Nov 2020 + Jan 2021)

## Purpose

This exhibit preserves machine-authenticated Zelle payment notices and aligns the record to the supplied raw headers/body content.

## Record A — November 20, 2020

- **From:** `"Zelle" <DoNotReply@zellepay.com>`
- **To:** `<alias1133@hotmail.com>`
- **Date header:** `Fri, 20 Nov 2020 05:20:13 GMT`
- **Subject:** `DANCE FACTORY RIDGEFIELD LLC sent you $1325.00`
- **Amount in body:** `$1325.00` (`DANCE F. has sent you $1325.00. Enjoy!`)
- **Period marker in body:** `nov 2 to nov 15`
- **Message-ID:** `<S6305POWAcsNPtN5G7j0002e5a6@s6305powa.prodew.int>`
- **Network Message ID:** `0cb29277-3281-409d-20fb-08d88d13f741`

## Record B — January 19, 2021

- **From:** `"Zelle" <DoNotReply@zellepay.com>`
- **To:** `<alias1133@hotmail.com>`
- **Date header:** `Tue, 19 Jan 2021 08:07:50 GMT`
- **Subject:** `DANCE FACTORY RIDGEFIELD LLC sent you $625.00`
- **Amount in body:** `$625.00` (`DANCE F. has sent you $625.00. Enjoy!`)
- **Period marker in body:** `dec 28 2020 to jan 10 2021 adjusted for overpayment for sat dec 19 2020`
- **Message-ID:** `<S6305POWAPUR4UV6rJ8002091bd@s6305powa.prodew.int>`
- **Network Message ID:** `344a1f44-a877-49c5-0f59-08d8bc5151d1`

## Shared Authentication/Transport Signals

Both records include:

- `Authentication-Results` showing **SPF pass**, **DKIM pass**, **DMARC pass**, `compauth=pass`
- `Received-SPF: Pass` with sender `smtp2.earlywarning.com (199.47.139.181)`
- Multi-hop `Received` chains with TLS 1.2 ciphers
- Early Warning infrastructure indicators (`smtp2.earlywarning.com`, EWS/protection chains)

## Evidence Artifacts Added (Raw Source Appendices)

- `docs/evidence/raw/zelle-2020-11-20-raw.eml.txt`
- `docs/evidence/raw/zelle-2021-01-19-raw.eml.txt`

These files preserve the exact “messy” header/source material in archive form for chain-of-custody workflows.

## Packaging Instructions

Include in packet:

1. Raw source files above
2. Header-focused extraction (for fast review)
3. Rendered HTML-to-PDF outputs
4. SHA-256 hashes for all versions
5. Evidence log entry for each export/transform step

Suggested tags:

- `corporate_payment`
- `authenticated_email_record`
- `zelle_transfer_notice`
- `compensation_timeline_input`
- `payment_period_adjustment_signal`

## Chain-of-Custody Notes

- Preserve original byte-level exports before redaction.
- Redact recipient aliases only in derivative copies.
- Record each transformation path and hash each artifact.
- Keep master source copy read-only.
