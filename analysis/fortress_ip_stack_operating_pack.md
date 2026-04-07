# Fortress IP Stack — Operating Pack (Draft v1)

_Date drafted: April 3, 2026 (UTC)_

> This document is a business-operations draft (not legal advice) intended for handoff to qualified counsel.

## 1) Operator Verdict

Your current assets support a premium rights strategy, but the stack needs immediate normalization:

1. **Rights conflict:** Public-facing materials mix CC BY, CC BY-NC, and proprietary language.
2. **Value leakage:** Premium implementation material appears too close to public artifact layers.
3. **Pipeline drift:** Current DOI posture is real and useful, but not yet an institutional publishing pipeline.

**Doctrine:** _Public proof stays thin. Paid access stays narrow. Secret core stays secret._

---

## 2) The Fortress IP Stack (6 Classes)

### Class A — Public Proof Shell

**Purpose:** Citation, discoverability, authority, date-stamping.

**Include:**

- Title, abstract, citation text
- Contributor identity (author/publisher/rights holder)
- DOI landing page metadata
- Redacted sample/teaser only

**Exclude:**

- Full implementation details
- Internal schemas, prompt logic, private datasets
- Source code and commercial playbooks

**Default rights posture:** Public-read/citation layer only.

### Class B — Paid Redacted Edition

**Purpose:** Commercial review access without implementation transfer.

**Include:**

- Polished but redacted PDF/edition
- Controlled appendices
- Watermarked evaluative copies

**Default rights posture:** Contract-only, no operational rights.

### Class C — Enterprise Methods Vault

**Purpose:** Main monetization layer.

**Include:**

- Full framework manuals
- Internal implementation guides
- Workshops/training materials
- Deployment playbooks

**Default rights posture:** Named-entity license with scope/term/seat controls.

### Class D — Secret Core

**Purpose:** Preserve repeatable unfair advantage.

**Include:**

- Taxonomies, scoring logic, transforms
- Prompt libraries and hidden lookup systems
- Proprietary datasets and pricing logic
- Internal architecture maps and operating protocols

**Default rights posture:** Not public; strict access control and logging.

### Class E — Counsel Hold / Patent Track

**Purpose:** Isolate potentially claimable invention material.

**Include:**

- Invention disclosures
- Provisional drafts
- Claim trees and prior-art notes
- Claim-support diagrams and flowcharts

**Default rights posture:** Counsel-controlled distribution only.

### Class F — Open Utility Code

**Purpose:** Public tooling, hiring signal, ecosystem goodwill.

**Include:**

- Non-core helper scripts/utilities
- Packaging/automation tooling that does not expose core logic

**Default rights posture:** Permissive licensing only for modules you are comfortable sharing broadly.

---

## 3) Rights Matrix Template (Per Asset)

For each asset, maintain one row with:

- `asset_id`
- `title`
- `asset_family`
- `asset_type`
- `author`
- `legal_owner`
- `publisher_imprint`
- `rights_holder`
- `classification` (A–F)
- `confidentiality_level` (public/confidential/restricted/crown_jewel)
- `chain_of_title_status`
- `copyright_status`
- `trademark_relevance`
- `patent_track_status`
- `trade_secret_status`
- `public_release_status`
- `doi`
- `orcid_linked`
- `license_family`
- `price_floor_usd`
- `canonical_filename`
- `version_number`
- `checksum_sha256`
- `source_location`
- `release_location`
- `redaction_status`
- `last_reviewed_date`
- `notes`

---

## 4) Canonical Work Registry (Minimum System of Record)

Create a single internal ledger with immutable history and status transitions:

`draft -> review -> deposit_ready -> published -> revised -> retired`

### Required governance controls

- Role-separated approvals (author, publisher/imprint operator, rights approver)
- Versioned metadata and file manifests
- Hashing for release artifacts
- Audit trail for every outward delivery

### Suggested folder model per work

```text
/works/WORK_ID/
  01_source/
  02_rights/
  03_metadata/
  04_release/
  05_proof/
  06_public/
```

`05_proof` should always contain:

- checksum file
- dated manifest
- publication/export receipt
- citation block
- release note

---

## 5) Release Gate (All 5 Required)

No public release until all pass:

1. **Title locked**
2. **License locked**
3. **Metadata locked**
4. **Files hashed**
5. **Citation text locked**

If one fails, release is blocked.

---

## 6) License Ladder (Commercial Policy Skeleton)

### Tier 1 — Paid Evaluation

- 14–30 day review
- Redacted materials only
- No implementation rights
- No redistribution
- No model training

### Tier 2 — Single-Use Professional

- One legal entity
- One use case / one team / one term
- No sublicensing or derivative commercialization

### Tier 3 — Enterprise Internal

- Named units/seats
- Internal implementation + training rights
- Audit rights + annual renewal

### Tier 4 — White-Label / Private-Label

- Highest non-exclusive tier
- Customization fee + approval rights
- Strict brand-use restrictions

### Tier 5 — Exclusive Field-of-Use

- Narrow exclusivity only
- Minimum annual guarantee
- Milestones + reversion rights

---

## 7) Contract Non-Negotiables (Policy)

- No free implementation pilots
- No broad perpetual exclusivity at standard pricing
- No sublicensing without explicit approval
- No AI training/fine-tuning on licensed materials
- No derivative framework ownership by client unless separately negotiated
- No benchmarking/public case study without consent
- Immediate suspension/termination on misuse

---

## 8) Delaware C-Corp Chain-of-Title Pack

Minimum document set:

1. Founder IP Assignment
2. Schedule of Assigned Works
3. Excluded Prior Works Schedule
4. Employee IP + Confidentiality Agreement
5. Contractor Assignment + NDA
6. Board approval of key inbound IP transfers
7. Trademark ownership schedule
8. Copyright registration log
9. Trade secret inventory register

---

## 9) 30-Day Cleanup Sequence

1. Freeze new public premium releases.
2. Normalize license language across all public-facing records.
3. Reclassify existing DOI artifacts as **Public Proof Shell** unless intentionally redacted.
4. Split open utility code policy from secret-core method policy.
5. Move invention-sensitive material into **Counsel Hold**.
6. Stand up the master registry and classify every asset A–F.
7. Enforce release gates before any new deposit.

---

## 10) Operating One-Liner

**DOI = proof. License = revenue. Secret = leverage.**
