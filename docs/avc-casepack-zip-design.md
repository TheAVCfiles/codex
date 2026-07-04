# AVC Casepack — Zero‑Loss Zip Design (Local Ingestion + Ephemeral Badging)

## Purpose

Create a portable, updateable zip pack that:

- **Loses zero context** (every artifact is anchored to provenance and meaning).
- **Ingests locally** (works offline, no external services required).
- **Supports information upgrades** (new files and improved metadata can be appended without rewriting history).
- **Uses ephemeral badges** to signal data state and AI‑assisted interpretation without corrupting originals.

This design preserves the integrity of original evidence while enabling structured growth, auditability, and local AI augmentation.

---

## Design Principles (Non‑negotiable)

1. **Originals are immutable.** Never edit or overwrite primary artifacts.
2. **Every artifact has a single canonical record.** One row in the index per artifact, with a stable ID.
3. **Context is layered, not embedded.** Interpretive notes live outside originals.
4. **Upgrades are additive.** New metadata or derived files are appended, not merged into originals.
5. **Badges are ephemeral.** Badges label _state_ (e.g., “needs review”) and can expire or rotate without altering evidence.

---

## Zip Pack Layout (v1)

```
AVC_CASEPACK_v1/
├── 00_README_FIRST/
│   ├── START_HERE.md
│   ├── PACK_MANIFEST.json
│   └── FOLDER_TREE.txt
│
├── 01_INDEX/
│   ├── exhibit_index.csv
│   ├── exhibit_index.json
│   └── schema_exhibit_index.json
│
├── 02_EXHIBITS/
│   ├── RAW/               # untouched originals
│   ├── SOURCE_EXPORTS/     # .eml, .msg, pdf originals
│   └── DERIVATIVES/        # crops, redactions, OCR outputs
│
├── 03_METADATA/
│   ├── artifact_notes/     # one file per exhibit ID
│   ├── entity_map.csv
│   ├── timeline.csv
│   └── financial_ledger.csv
│
├── 04_CHAIN_OF_CUSTODY/
│   └── chain_of_custody.md
│
├── 05_BADGES_EPHEMERAL/
│   ├── badge_registry.csv
│   ├── badge_policy.md
│   └── badge_snapshots/
│
└── 99_INBOX_UNSORTED/
    └── DROP_NEW_FILES_HERE/
```

### What each layer does

- **Index**: The single source of truth. Every artifact gets one row with stable ID, file path, hash, and basic descriptors.
- **Exhibits**: The evidence itself (originals + derived copies).
- **Metadata**: Context upgrades (notes, claims mapping, timeline placements).
- **Chain of custody**: Immutable, human‑readable log of handling actions.
- **Badges**: Ephemeral state flags and AI‑assist signals (non‑evidentiary). They can be refreshed or revoked without affecting evidence.

---

## Canonical Artifact ID Format

```
EX-<DOMAIN>-<YYYY>-<NNN>
```

Examples:

- `EX-FIN-2020-001`
- `EX-COMMS-2021-014`
- `EX-IP-2022-003`

IDs never change. If a file is replaced with a better export, link the new export as a **derivative** and note it in metadata.

---

## Exhibit Index (Minimal Fields)

**Required fields** in `01_INDEX/exhibit_index.csv`:

- `exhibit_id`
- `category`
- `source_filename`
- `pack_path`
- `sha256`
- `capture_date`
- `source_channel` (email, sms, web, etc.)
- `description` (neutral, observational)

**Optional fields** (recommended):

- `jurisdiction`
- `entities`
- `related_ids`
- `notes_ref`

---

## Ephemeral Badge System (Local AI Support)

Badges **must never** be stored in the exhibit index. They live in `05_BADGES_EPHEMERAL/`.

### Badge intent

Badges signal the _state of interpretation_ or _workflow readiness_ — not evidence quality.

### Example badge states

- `needs_review`
- `hash_verified`
- `ocr_ready`
- `duplicate_candidate`
- `timeline_anchor`
- `legal_hold`

### Badge record structure

```
badge_id, exhibit_id, badge_type, issued_at, expires_at, issuer, note
```

### Ephemeral identity (badged recognition)

- **Issuer** can be a local agent name (e.g., `local-ai`) or human initials.
- **Badge snapshots** can be rotated weekly (store under `badge_snapshots/`).
- If a badge expires, it’s preserved in snapshots for audit, but no longer active.

Badges are a _signal layer_ for local AI tools to prioritize, annotate, or surface items without altering evidence.

---

## Information Upgrades (Zero‑Loss Workflow)

1. **Drop new files** into `99_INBOX_UNSORTED/DROP_NEW_FILES_HERE/`.
2. **Assign new exhibit IDs** and add rows to the index.
3. **Hash files**, record in index, and move into `02_EXHIBITS/RAW/`.
4. **Add context** via `03_METADATA/` (notes, entity map, timeline, ledger).
5. **Issue badges** for processing state (optional).

No step edits or replaces originals. All changes are additive and audit‑friendly.

---

## Local AI Ingestion Path

A local AI assistant can ingest:

- `01_INDEX/exhibit_index.*`
- `03_METADATA/*`
- `05_BADGES_EPHEMERAL/*`

This allows the AI to:

- Build or refine timelines.
- Detect gaps or inconsistencies.
- Surface missing provenance.
- Highlight high‑value exhibits.

**Constraint:** The AI must not write into `02_EXHIBITS/RAW/` or overwrite index rows.

---

## Guardrails (Safety + Admissibility)

- **No silent edits**: every modification leaves a trace in chain of custody.
- **No badge back‑propagation**: badges never alter evidence or index content.
- **No narrative injection**: interpretive narratives live outside the pack or in clearly labeled analysis folders.

---

## Practical Next Steps

- If you want this turned into a live pack, I will generate:
  - `PACK_MANIFEST.json`
  - `schema_exhibit_index.json`
  - `badge_policy.md`
  - baseline `exhibit_index.csv`
- Then we can ingest the current evidence set in batches with zero data loss.

The pack becomes a sovereign container: portable, verifiable, and ready for local AI support without sacrificing evidentiary integrity.
