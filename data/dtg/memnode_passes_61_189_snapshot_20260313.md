# MemNode Ingest Snapshot — Passes 61–189

This file records the user-provided append-only ingest state for passes 61 through 189.
It preserves corridor-level growth, duplicate-reinforcement behavior, and graph checkpoint sizes.

## Operating rules captured

- Append-only ingest mode (no destructive updates).
- Duplicate sources are retained as reinforcement rows with increased confidence.
- Early runtime uploads may expire from cache, while already extracted ledger rows remain in graph state.

## Corridor state (stable across passes)

1. finance
2. operations
3. transport
4. academic
5. arts
6. political
7. legal
8. estate / trust

## Core structural spine (unchanged)

- Jeffrey Epstein
- jeevacation@gmail.com
- Lesley Groff
- Darren Indyke
- Larry Visoski
- Southern Financial LLC
- Air Ghislaine
- SDNY

## Checkpoint growth timeline

| Pass checkpoint | Approx. nodes | Approx. edges | Notes                                         |
| --------------- | ------------: | ------------: | --------------------------------------------- |
| 70              |          ~208 |          ~495 | Contact/comms/finance/legal/transport updates |
| 80              |          ~220 |          ~528 | Added Eps5.zip archive staging                |
| 90              |          ~232 |          ~558 | Reinforcement-heavy cycle                     |
| 100             |          ~248 |          ~603 | Archive re-upload reinforcement               |
| 110             |          ~265 |          ~652 | Continued ops/comms/legal expansion           |
| 120             |          ~282 |          ~701 | Strong comms + legal growth                   |
| 130             |          ~298 |          ~742 | Added directory/finance/legal/comms           |
| 140             |          ~314 |          ~784 | Property and legal reinforcement              |
| 150             |          ~331 |          ~832 | Continued ops/legal/comms additions           |
| 160             |          ~348 |          ~879 | Legal + operations + property growth          |
| 170             |          ~366 |          ~927 | Persistent comms/ops/legal/finance density    |
| 179             |          ~382 |          ~971 | Mapstein 3 archive staged                     |
| 189             |          ~399 |        ~1,018 | Continued legal/comms/finance accumulation    |

## Pass-window highlights

### Passes 61–70

- Operations/contact expansion: `EFTA01134114` (`DIR-003`, `DIR-004`).
- Communications thread: `EFTA01183526` (`COMMS-013`).
- Finance/legal/documentation additions: `FIN-OPS-004`, `LEGAL-006`, `DOC-002`.
- Reinforcements: `EFTA01699268`, `EFTA02803080`, `EFTA01734713`, `EFTA00380436`.

### Passes 71–80

- New rows in operations/contact/comms/finance/legal/transport corridors.
- Archive `Eps5.zip` introduced for extraction → RAW_INTAKE → RELATIONSHIPS promotion pipeline.

### Passes 81–120

- Recurring duplicate reinforcements for contact/comms/travel/legal documents.
- Continued introduction of new operations, legal, financial, and investigative rows.
- Market/news side signal carried with lower confidence (`MKT-003` reinforcement context).

### Passes 121–160

- Additional finance (`FIN-OPS-*`), legal (`LEGAL-*`), comms (`COMMS-*`), and property (`PROP-*`) rows.
- Ongoing duplicate confidence increases in previously observed sources.

### Passes 161–189

- Continued high-density additions in communications and legal corridors.
- New archive staging row: `ARCHIVE-003` for `Mapstein 3.zip`.
- Passes 180–189 add new legal/investigative and finance records, maintaining append-only structure.

## Highest-value future targets captured in the ingest notes

- bank wire instructions
- flight manifests
- corporate formation filings
- trust/beneficiary records
- property title transfers
- charter invoices

These are repeatedly marked as strongest candidates for highest-weight edge creation.
