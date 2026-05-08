# STATUS

## Repository Status

| Field | Value |
| --- | --- |
| Repository | TheAVCfiles/codex |
| Governance category | MEMOS / governed memory infrastructure |
| Current status | GOVERNANCE-SEED |
| Visibility posture | private or controlled-public pending review |
| Commercial posture | not yet monetized |
| Safety posture | provenance-first; publish only after file gate |
| Last reviewed | 2026-05-08 |
| Reviewer | AVC / operator review |

## Status Meaning

`GOVERNANCE-SEED` means this repository has begun formal governance alignment but is not yet enterprise-complete.

It has:

- a MEMOS governance strategy
- a root provenance gate
- this status file

It still needs the full promoted-repo gate completed before public/client-facing use.

## Promotion Readiness Checklist

| Required file | Status | Notes |
| --- | --- | --- |
| `README.md` | TODO | Must clearly state what the repo is, who it serves, and how to use it. |
| `PROVENANCE.md` | DONE | Root provenance gate added. |
| `STATUS.md` | DONE | Current live heartbeat file. |
| `LICENSE.md` | TODO | Must clarify permitted use, restrictions, and IP posture. |
| `CHANGELOG.md` | TODO | Must track meaningful changes. |
| `ONBOARDING.md` or `USAGE.md` | TODO | Must explain safe use and setup. |
| `PAYMENT.md` or `NONCOMMERCIAL.md` | TODO | Must clarify whether the repo is commercial, demo, internal, or noncommercial. |

## Current Operating Priorities

1. Complete the required enterprise file gate.
2. Create or designate a central MEMOS provenance ledger.
3. Tag source archives before asset promotion.
4. Classify repositories into Archive, Enterprise, or Room layers.
5. Add branch protection and security scanning where available.

## Allowed Status Values

- `RAW-ARCHIVE`
- `GOVERNANCE-SEED`
- `PROMOTION-CANDIDATE`
- `ENTERPRISE-READY`
- `ROOM-INTERFACE`
- `DEMO`
- `MONETIZE`
- `PRIVATE-ONLY`
- `LEGAL-HOLD`
- `DEPRECATED`

## Upgrade Rule

Do not move this repository to `ENTERPRISE-READY` until the required file gate is complete and provenance records exist for promoted assets.
