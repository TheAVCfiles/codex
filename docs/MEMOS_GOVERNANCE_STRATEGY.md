# MEMOS Governance Strategy (May 8, 2026)

## Purpose

This document captures the current enterprise operating frame:

- Preserve raw R&D and provenance in source archives.
- Promote only governed, commercial-grade assets into the enterprise layer.
- Treat **MEMOS (Memory Operating System)** as the core category.

## Core Principle

**Clean front door, preserved roots.**

Enterprise repositories should be polished, but each promoted asset must retain chain-of-custody back to its source archive (repo, path, commit SHA, and promotion method).

## Operating Layers

1. **Source Archive Layer**

   - Raw experiments, abandoned branches, early drafts, and Codex dumps.
   - Preserve with `source-freeze-*` tags/releases before promotion.

2. **Enterprise Governance Layer**

   - Client-safe and investor-readable repositories.
   - Must include provenance, licensing, onboarding, and payment posture.

3. **Room Interface Layer**
   - User-facing digital rooms (public demos, private client rooms, cohort rooms).
   - Each room maps to a memory operation (intake, retrieval, export, evidence, etc.).

## Required Files for Promoted Repos

- `README.md`
- `PROVENANCE.md`
- `STATUS.md`
- `LICENSE.md`
- `CHANGELOG.md`
- `ONBOARDING.md` (or `USAGE.md`)
- `PAYMENT.md` (or `NONCOMMERCIAL.md`)

## Promotion Gate

An asset is promotion-ready only when all of the following are recorded:

- Source repository URL
- Source file path(s)
- Source commit SHA or tag
- Asset type and score
- Promotion reason
- Destination repository
- Visibility/safety review

## Asset Scoring Model

- **0** = trash
- **1** = archive only
- **2** = maybe useful
- **3** = reusable component
- **4** = product candidate
- **5** = canonical IP

Status options:

- `KEEP-RAW`
- `PROMOTE`
- `MERGE`
- `REWRITE`
- `PRIVATE-ONLY`
- `LEGAL-HOLD`
- `DEMO`
- `MONETIZE`

## MEMOS Category Definition

**MEMOS = governed memory infrastructure.**

Outputs like memoir, curriculum, product docs, legal appendices, and dashboards are treated as transformations of governed memory artifacts—not as the foundational system itself.

## Immediate Implementation Sequence

1. Freeze source states in archive repos using release tags.
2. Maintain a provenance ledger repository.
3. Promote via fork/transfer/mirror/subtree (no copy-paste lineage loss).
4. Add `PROVENANCE.md` before any polish/refactor.
5. Enforce branch protection and security scanning on enterprise repos.
6. Publish only repositories that pass the professional file gate.

## Strategic Sentence

> This repository ecosystem is a governed enterprise implementation layer derived from original, timestamped work preserved in source archives.
