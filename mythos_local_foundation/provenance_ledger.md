# Provenance Ledger (Local-First)

Use this process to preserve local provenance for prompts, model outputs, and alignment evaluations.

## 1) Canonicalize the record

Store each event as a normalized JSON object:

```json
{
  "ts_utc": "2026-01-01T12:00:00Z",
  "actor": "researcher@local",
  "event": "align_eval",
  "payload": {
    "A_t": 0.82,
    "E_sac": 0.04,
    "V_cont": 0.79
  }
}
```

## 2) Hash the record

Use SHA-256 over the canonical JSON bytes:

```bash
cat entry.json | openssl dgst -sha256
```

## 3) Timestamp locally

Append an ISO-8601 UTC timestamp and hash to your ledger file (`ledger.log`):

```text
2026-01-01T12:00:00Z sha256:... align_eval
```

## 4) Chain entries (recommended)

Include `prev_hash` in each next record to form an append-only chain.

## 5) Optional notarization

Periodically anchor the latest hash into an external timestamping system (if available).

## 6) Retention

- Keep raw records under encrypted local storage.
- Keep `ledger.log` under version control for immutable audit history.
