# StagePort / StudioOS — Governed Founder Stack

This repo implements a **governed founder operating system**: doctrine → behavior → receipts → dashboard visibility.
Everything important becomes a **hash + ledger entry**. No silent state changes.

## Quick Start (Replit)

Implementation rule:
Make the smallest possible code changes. Prefer adding metadata components, static files, and new routes over editing existing visual components. Do not refactor the app.

- Start the application from Replit (Run).
- Open the web preview and navigate to `/`.

## Key Concepts

- **Doctrine**: system documents with versioned IDs (append-only doctrine).
- **Behavior**: founder operational state machine (IDLE/BUILDING/THROTTLED/ESCALATED) + Regime Engine (velocity governor).
- **Receipts**: append-only ledger entries (hash + eventType + timestamp).
- **Journey**: founder onboarding progression (CRISIS → LAB_ACTIVATION → RECEIPTS → STAGECRED → CAPITAL) with persistence.

## Routes

### Core

- `/` — Home
- `/founder` — Founder Dashboard (documents count, ledger count, system links, founder journey card, operational machine card)
- `/founder/onboarding` — Founder Onboarding Flow (5-step governed journey)
- `/startup-studios` — Startup StudiOS page (conservatory OS positioning + corridors + dependability protocol)

### Navigation Integrity

This project uses `wouter`. Links must follow safe semantics:

- ✅ `<Link href="/x"><a className="...">Text</a></Link>`
- ✅ `<Link href="/x"><a><Button ... /></a></Link>`
- ❌ Avoid styling `<Link>` directly if it breaks click-through.

## Founder Journey (Governed Onboarding)

The onboarding journey is a five-step FSM:

- CRISIS
- LAB_ACTIVATION
- RECEIPTS
- STAGECRED
- CAPITAL

State persists via `localStorage` and advances only when the current step is **notarized**:

- The step action generates a hash (via `/api/documents/hash`)
- The hash is notarized to the ledger (via `/api/ledger/notarize`)
- The next state is saved

Ledger documentId used:

- `founder_journey`

## Founder Operational Machine + Regime Engine

Operational states:

- IDLE
- BUILDING
- THROTTLED
- ESCALATED

Events:

- START_BUILD
- THROTTLE
- OVERDRIVE
- RESET

Each valid transition:

1. hashes transition string
2. writes ledger entry with `eventType = event`
3. refreshes ledger queries

Ledger documentId used:

- `founder-machine`

Regime Engine:

- `velocity > 75 => OVERDRIVE`
- Otherwise SAFE

## Ledger + Document APIs

### Documents

- `GET /api/documents`

  - Returns all governance documents
  - Includes seeded document: `founder_reality_kit_v1`

- `POST /api/documents/hash`
  - Input: `{ "text": "string" }`
  - Output: `{ "sha256": "hex-string" }`

### Ledger

- `GET /api/ledger`

  - Returns all ledger entries

- `GET /api/ledger/:documentId`

  - Returns entries for a specific documentId

- `POST /api/ledger/notarize`
  - Input: `{ documentId: string, hash: string, eventType?: string }`
  - Behavior:
    - eventType is now exposed and persisted (defaults to "NOTARIZE" when absent)

## Seeded Doctrine

On server startup, the system seeds one governance document:

- `founder_reality_kit_v1`
- Title: “AVC Welcome Founder Reality Kit”
- Status: ISSUED
- sha256: deterministic server-side hash of the issuance string

This ensures `/api/documents` returns at least one canonical doctrine asset immediately.

## Pricing (AVC Governance Install)

Pricing UI has been updated to reflect real AVC tiers:

1. **Systems Triage™ — $12,000**

   - Required gate (30-day assessment)
   - boundaries, IP posture, compliance risk, go/no-go decision

2. **Governance Install™ — Standard — $25,000** (HIGHLIGHTED)

   - 90-day fixed-scope
   - provenance + investor-safe governance receipts

3. **Governance Install™ — Regulated / Gov-Safe — $35,000**

   - enhanced assurance
   - compliance-sensitive, offline/air-gap documentation
   - counsel-ready artifacts

4. **Institutional / Studio-Wide License — $50,000–$75,000 + $15,000–$50,000/yr**
   - multi-project coverage
   - reusable primitives

Add-on:

- **Interim Governance Architect — $8,000–$20,000/month**
  - executive oversight + risk gating (no execution/delivery)

Policy statement:

- Equity is never required and never substitutes for cash.
- No discounts for urgency, exposure, or future promises.

## Test Checklist (Manual)

✅ App boots

- `/` loads

✅ Navigation

- Header + footer links click through
- No broken nested Link/Button patterns

✅ Documents

- `GET /api/documents` returns seeded document

✅ Ledger

- `POST /api/ledger/notarize` accepts optional `eventType`
- `GET /api/ledger/:documentId` returns receipts

✅ Founder Onboarding

- completing a step writes a ledger entry to `founder_journey`
- refresh persists current onboarding state

✅ Dashboard

- founder journey card shows state + progress
- operational state card transitions create ledger entries for `founder-machine`
- ledger UI refreshes after transitions

## Graceful Degradation Policy (Build Discipline)

- Additive changes only; preserve existing functionality.
- If ledger notarization fails, UI must not claim success.
- Append-only ledger: never mutate past entries.
- Version bumps are intentional (no auto-increment).

## Repo Safety

- No force pushes.
- Preserve append-only ledger philosophy in documentation and implementation.
- Docs must reflect shipped behavior.
- If push fails, commits remain local; retry push later without rewriting history.

Return a final checklist showing each route/file created or modified, and list any files changed.
