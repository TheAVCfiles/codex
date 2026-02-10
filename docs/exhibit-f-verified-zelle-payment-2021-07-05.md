# Exhibit F — Verified Zelle Payment (July 5, 2021)

## Purpose

This exhibit records a third-party authenticated payment event that links operational activity, creative deliverables, and compensation flow in a single evidentiary artifact.

## Core Fact Pattern (Header-Verified)

From the provided email headers and rendered message content:

- Sender mailbox: `DoNotReply@zellepay.com`
- Authenticated sender domain: `zellepay.com`
- Message authentication controls: **DKIM pass**, **SPF pass**, **DMARC pass**
- Sending infrastructure / operator context: **Early Warning Services, LLC** (Zelle network operator)
- Displayed payor name: **DANCE FACTORY RIDGEFIELD LLC**
- Recipient: Individual recipient account (Allison Van Cura)
- Payment amount: **$1,125.00**
- Payment date: **July 5, 2021**
- Message integrity markers present: **Message-ID** and **Network Message ID**
- Transport context: TLS-enabled production mail chain

## Evidentiary Significance

### 1) Corporate Payor Identity at Infrastructure Layer

The artifact is not just a screenshot or conversational claim. It is an authenticated payment notice transmitted through production email infrastructure with aligned anti-spoofing controls.

### 2) Temporal Correlation with Operational Reliance

When mapped to nearby events in the record:

- May 8, 2021: urgent operational dependency communications
- June to early July 2021: choreography and production delivery window
- July 5, 2021: payment issued

This sequence is consistent with post-delivery compensation behavior.

### 3) Memo Language as Accounting Signal

Memo text: **"Failed Zelle still catching up"**.

The phrasing can function as an indicator of delayed internal compensation handling rather than formal invoice processing language.

## Integrated Four-Layer Model

1. **Control Layer**: dependency + delegated production urgency
2. **IP Layer**: authored choreography publicly credited and commercially used
3. **Financial Outflow Layer**: recipient’s concurrent personal expenditures supporting operations
4. **Compensation Layer (Exhibit F)**: verified LLC-to-individual payment outside standard payroll artifacts

Together, these layers present a coherent systemic pattern for agency review.

## Neutral Investigative Conclusion (Draft)

The assembled record indicates that Dance Factory Ridgefield LLC exercised operational control over production-related labor, commercially used choreographic works attributed to Allison Van Cura, and transmitted compensation through peer-to-peer payment infrastructure rather than documented payroll channels, while operationally related personal expenditures were borne by the recipient during overlapping periods.

## Packaging Instructions (Tier-1 Anchor)

Store as: **Exhibit F — Verified Zelle Payment (July 5, 2021)**

Include:

1. Full raw email headers (unaltered)
2. Rendered message body export (PDF)
3. Highlighted fields:
   - Payor name
   - Amount
   - Date
   - Memo line
   - Authentication results (DKIM/SPF/DMARC)
4. Integrity notes:
   - Export source mailbox
   - Export timestamp
   - Hashes for exported files (SHA-256)

Suggested evidence tags:

- `corporate_payment`
- `off_payroll_compensation`
- `misclassification_indicator`
- `wage_smoothing_signal`

## Chain-of-Custody Addendum

- Preserve original `.eml` file where possible
- Avoid manual header reformatting
- Generate and store SHA-256 hash for each export artifact
- Capture extraction method in evidence log (tool + date + operator)
- Keep a read-only copy of the source artifact in archive storage
