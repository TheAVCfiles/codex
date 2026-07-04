# Uber Eats Receipt Email Header Analysis (2021-09-07)

## Verdict

The message appears **authentic** and consistent with a legitimate Uber Eats transactional receipt.

## Key signals observed

- **SPF pass**: `smtp.mailfrom=em.uber.com` with sending IP `50.31.36.143`, and explicit `Received-SPF: Pass`.
- **DKIM pass**: `dkim=pass` with signing domain `uber.com`.
- **DMARC pass**: `dmarc=pass action=none header.from=uber.com`.
- **Microsoft composite auth pass**: `compauth=pass reason=100`.
- **Message path consistency**:
  - Delivery chain flows from Uber/SendGrid infrastructure into Microsoft 365 protection and mailbox hosts.
  - Return path domain aligns with Uber mail domain: `...@em.uber.com`.
- **Brand/domain alignment**:
  - `From: Uber Receipts <noreply@uber.com>`
  - `Message-ID: ...@mail.uber.com`
  - Header authentication references `uber.com` / `em.uber.com`.

## Risk notes

- Links in the HTML body route through tracking redirectors (normal for large transactional email providers), so users should still click cautiously.
- If the recipient did not place the order, the safer response is to sign in to Uber directly (not via email links), review account activity, and rotate password/session tokens.

## Practical takeaway

Based on header authentication and transport chain evidence, this email is very likely a legitimate Uber Eats receipt rather than a spoofed phishing message.
