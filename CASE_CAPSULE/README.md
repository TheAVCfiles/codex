# CASE_CAPSULE — Zero-Loss Nucleus (Local-First Evidence Pack)

Purpose: preserve context without mutation, enable local ingestion, and allow **ephemeral AI overlays** without contaminating the core record.

This folder provides a **template-only** nucleus you can copy into a new case pack. The core rule is **immutability**: originals never change; every enhancement becomes an overlay or upgrade.

## Principles

- **Zero loss:** never discard context; store raw + notes + linkages.
- **Immutable core:** originals and their hashes do not change.
- **Additive overlays:** OCR, AI notes, badges, and relationship edges are additive and revocable.
- **Explicit confidence:** facts and gaps are visibly marked.
- **Local-first:** works on a local drive; no external services required.

## Markup Convention (Required)

Use these tokens to keep every edit reviewable:

- `[[RED]]...[[/RED]]` = edits/changes made by a human editor.
- `[[GREEN]]...[[/GREEN]]` = evidence needed or missing context.

These tokens are intentionally plain-text so they survive ZIPs, CSVs, and PDF exports.

## Canonical Pack Layout (Template)

```
AVC_CASEPACK/
  00_README/
    README.md
    FOLDER_TREE.txt

  01_CORE/                       # IMMUTABLE
    01_EXHIBITS_RAW/             # originals only (never edited)
    02_INDEX/
      exhibits.csv               # append-only evidence index
      hashes.sha256              # hash list (one line per file)
    03_CUSTODY/
      chain_of_custody.md
      capture_notes.csv
    04_METADATA/
      manifest.core.json
      entities.json
      glossary.json

  02_CAS/                        # optional content-addressable store
    sha256/
      ab/cd/<sha256>.<ext>

  03_OVERLAYS/                   # MUTABLE / ADDITIVE ONLY
    01_DERIVATIVES/              # crops, redactions (new files only)
    02_TRANSCRIPTS/              # OCR/text extractions
    03_AI_NOTES/                 # AI summaries and tags
    04_LINKS/                    # artifact relationships
    05_BADGES/                   # recognition + confidence badges

  04_UPGRADES/
    YYYY-MM-DD__AI_EXTRACT_v1/
      upgrade.manifest.json
      overlay.additions/

  05_EXPORTS/
    counsel_packet.pdf
    timeline_onepage.pdf
    exhibit_book.pdf
```

## How to Use These Templates

1. Copy `templates/` into your new case pack.
2. Populate `01_CORE/02_INDEX/exhibits.csv` and `hashes.sha256` **append-only**.
3. Store originals in `01_CORE/01_EXHIBITS_RAW/` and never overwrite them.
4. Place AI outputs in `03_OVERLAYS/` or `04_UPGRADES/` only.
5. Mark edits and missing context using the red/green tokens above.

## Local Ingestion (No Code Required)

- Drag originals into `01_CORE/01_EXHIBITS_RAW/`.
- Add a row per artifact to `exhibits.csv`.
- Calculate hashes with your local tool and append to `hashes.sha256`.
- If you generate OCR or AI notes, write them into `03_OVERLAYS/`.

If you later need a “clean export” for counsel, assemble only `01_CORE` + selected overlays into `05_EXPORTS/`.
