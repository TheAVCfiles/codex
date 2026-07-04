# AVC Master Timeline + Dossier Matrix (Zero-Loss, Evidence-First)

**Purpose:** Consolidate case coherence into a singular timeline and a dossier matrix that preserves context without speculation. This document defines a **zero-loss** structure for ongoing ingestion, while keeping AI-derived notes and badges **ephemeral** and clearly separated from core evidence.

**Scope:** Timeline, dossier matrix, and the pack design needed to keep all chat evidence in a single, locally updatable ZIP.

---

## 1) Core Rules (Non‑Negotiable)

1. **Core evidence is append‑only.** No file replacement in the `01_CORE/` tree.
2. **All claims must map to Evidence IDs.** If no evidence ID exists, the row is labeled **PENDING**.
3. **AI outputs are overlays.** AI notes, edges, or badges never overwrite core evidence.
4. **Every AI overlay must expire.** Use `expires_at` for every AI-generated badge or edge.
5. **Chain of custody is primary.** Hash lists must be generated locally and stored in core index.

---

## 2) Master ZIP Pack (Zero‑Loss Design)

This is the **single, canonical ZIP** for all chat evidence. It preserves context while allowing local ingestion, upgrades, and ephemeral AI recognition layers.

```
AVC_NUCLEUS_MASTER/
├── 01_CORE/
│   ├── 01_EXHIBITS_RAW/            # Append-only evidence originals
│   ├── 02_INDEX/
│   │   ├── exhibits.csv            # Core evidence index
│   │   ├── hashes.sha256           # Hash ledger for 01_CORE
│   │   └── chronology.csv          # Single canonical timeline
│   └── 03_CONTEXT/
│       ├── chat_summaries/         # Raw chat exports or summaries
│       └── project_notes/          # Non-evidence context notes
├── 02_MANIFEST/
│   └── core.manifest.json          # Pack metadata + immutability rule
├── 03_OVERLAYS/
│   ├── 03_AI_NOTES/                # AI analysis, never authoritative
│   ├── 04_LINKS/                   # edges.json (ephemeral link layer)
│   └── 05_BADGES/                  # per-exhibit badge files
├── 04_UPGRADES/
│   └── YYYYMMDDTHHMMSSZ__*.json     # Upgrade manifests
└── 99_INBOX_DROP/                  # Local staging area (not core)
```

### 2.1 Core Manifest (Example)

```json
{
  "pack_type": "CORE",
  "pack_id": "AVC_NUCLEUS_CORE_20260208T010802Z",
  "created_at": "2026-02-08T01:08:02Z",
  "canonical_index": "01_CORE/02_INDEX/exhibits.csv",
  "hash_list": "01_CORE/02_INDEX/hashes.sha256",
  "immutability_rule": "01_CORE is append-only; no file replacement allowed"
}
```

### 2.2 Overlay Links (Ephemeral)

```json
[
  {
    "from_exhibit": "E0001",
    "to_exhibit": "E0010",
    "relation": "TEMPORAL_PROXIMITY_SUPPORTS",
    "note": "Video mentions Nutcracker; chat discusses IP reuse pattern",
    "confidence": 60,
    "layer": "AI_SUGGESTED_EPHEMERAL",
    "expires_at": "2026-03-10T00:00:00Z"
  }
]
```

### 2.3 Overlay Badges (Per‑Exhibit, Ephemeral)

```json
{
  "exhibit_id": "E0001",
  "badges": [
    {
      "type": "PROVENANCE",
      "value": "USER_DOCUMENT",
      "confidence": 100,
      "reason": "Provided in query; XML-structured video metadata"
    },
    {
      "type": "SENSITIVITY",
      "value": "LOW",
      "confidence": 90,
      "action": "NO_REDACTION_NEEDED"
    },
    {
      "type": "AI_RECOGNIZER_EPHEMERAL",
      "value": "VIDEO_METADATA_DETECTED",
      "confidence": 88,
      "model": "local-gen-ai",
      "expires_at": "2026-03-10T00:00:00Z",
      "reason": "Contains title, date, description with Nutcracker mention"
    }
  ]
}
```

### 2.4 Upgrade Manifests (Ephemeral Layer Control)

```json
{
  "pack_type": "UPGRADE",
  "upgrade_id": "20260208T010802Z__CHAT_NUCLEUS_v1",
  "applies_to_core": "AVC_NUCLEUS_CORE_20260208T010802Z",
  "created_at": "2026-02-08T01:08:02Z",
  "adds": ["03_OVERLAYS/03_AI_NOTES/"],
  "ai_generation": {
    "model": "local-gen-ai",
    "policy": "ephemeral",
    "expires_at": "2026-03-10T00:00:00Z"
  }
}
```

---

## 3) Single Canonical Timeline (Chronology)

This timeline is **the** authoritative sequence. Every row must map to evidence IDs or be marked **PENDING**.

**Chronology schema:**

| row_id | date (UTC) | event_summary | jurisdiction | claim_type | evidence_ids | confidence | status | notes |
| ------ | ---------- | ------------- | ------------ | ---------- | ------------ | ---------- | ------ | ----- |

**Rules:**

- **One row per event.** If multiple artifacts support the same event, list them all in `evidence_ids`.
- **No narrative in the timeline.** Narrative lives in the dossier matrix.
- **Confidence is numeric (0–100).** Defaults to 50 if unverified.

---

## 4) Dossier Matrix (Claims ↔ Evidence ↔ Status)

The matrix translates the timeline into a **case‑ready** structure. It is **non‑speculative** and **evidence‑anchored**.

**Matrix schema:**

| module_id | claim_module | claim_brief | evidence_ids | element_status | jurisdiction | risks/gaps | next_action |
| --------- | ------------ | ----------- | ------------ | -------------- | ------------ | ---------- | ----------- |

**Element status codes:**

- **C0:** No evidence attached (placeholder only)
- **C1:** Primary evidence exists (direct artifact)
- **C2:** Corroborating evidence exists (supporting artifacts)
- **C3:** Fully documented (primary + corroboration + chain of custody)

---

## 5) Coherence Layer (Explain the Case Without Losing the Record)

Use this structure for the written case explanation. It is factual, ordered, and traceable:

1. **Parties + Entities** (who/what/where)
2. **Work Performed** (dates, scope, roles, evidenced)
3. **Compensation + Financial Flows** (evidence‑anchored)
4. **Control + Dependency Signals** (messages, directives, schedules)
5. **IP/Authorship Evidence** (fixation + public use)
6. **Damages Framework** (calculation pending unless rates are documented)
7. **Remedies Requested** (neutral, evidence‑linked)

Every paragraph must cite Evidence IDs.

---

## 6) Chat Evidence Preservation (All Chats in ZIP)

All chat records should be stored as **raw exports** or **frozen summaries** inside:

```
01_CORE/03_CONTEXT/chat_summaries/
```

**Rules:**

- Each chat file gets an Evidence ID.
- If a chat summary is AI‑generated, store it in `03_OVERLAYS/03_AI_NOTES/` with an expiry.

---

## 7) Memnode Corridor Activation (Coda Write — Project Context)

**Coda:** This project is a preservation corridor. The record is preserved as‑is, without narrative drift. The spine is the timeline; the matrix is the proof map. The overlays exist to accelerate comprehension, not replace evidence. Every future action must honor the core: append‑only evidence, explicit hashes, and a clean, singular chronology.

**_End of Coda._**
