# SYSTEM_SPEC v1.1 — M.O.M.

Release: 2026-01-24  
Purpose: define a governed memory system where **consent, continuity, and containment** are enforceable.

---

## 0) Scope

This spec defines:

- data model: MemNode / Corridors / Coda / StagePort
- invariants (MUST / MUST NOT)
- lifecycle and boundary rules
- auditability requirements

This spec does NOT define:

- a specific vector DB, LLM vendor, or embedding method
- UX design details beyond governance requirements
- monetization (see `offer/`)

---

## 1) System overview

M.O.M. is a pipeline with a hard gate:

**Inputs → Candidate Memory → StagePort Gate → Store → Coda Log → Retrieval → StagePort Gate → Output**

StagePort appears twice because:

- you can leak on write (store forbidden data)
- you can leak on read (reveal forbidden data)

Fail mode: **fail closed** (no write, no recall, no nudge).

---

## 2) Objects

### 2.1 MemNode

A MemNode is a governed memory record.

**Fields (conceptual)**

- `id`: stable unique identifier
- `owner_id`: user identity / tenant key
- `created_at`, `updated_at`: timestamps (updated_at may change only via append operations)
- `payload_ciphertext`: encrypted payload
- `payload_schema`: declared schema/version for decoding
- `consent`: explicit consent contract
  - `scope`: allowed contexts (e.g., “work”, “health”, “creative”)
  - `revocable`: boolean
  - `expires_at`: optional
  - `source`: what generated it (user, import, inference, system)
- `salience`: 0..1 (priority weight)
- `masking`: exposure policy (masked/unmasked + rules)
- `tags`: typed labels for retrieval constraints
- `provenance`: citations/links to source evidence (when available)
- `integrity`: hashes/signatures for tamper detection

**Invariant M1 — Encryption at rest**
Payload MUST be stored encrypted. Decrypted payload MUST NOT be persisted outside controlled processing memory.

**Invariant M2 — Consent is required**
No MemNode may be persisted without an attached consent contract.

**Invariant M3 — Revocation is enforceable**
If consent is revoked, StagePort MUST treat the node as non-readable/non-surfaceable.

---

### 2.2 Corridors

Corridors are typed edges between MemNodes with traversal constraints.

**Fields (conceptual)**

- `from_id`, `to_id`
- `type`: e.g., `DERIVES_FROM`, `CONTRADICTS`, `TEMPORAL_NEXT`, `EVIDENCE_FOR`
- `constraints`:
  - allowed contexts
  - time windows
  - max traversal depth / hop limits
  - risk flags (e.g., “high sensitivity”)

**Invariant C1 — Typed traversal**
Every corridor MUST declare its type. Untyped edges are forbidden.

**Invariant C2 — Constraint enforcement**
Traversal MUST respect corridor constraints and StagePort policy.

---

### 2.3 Coda (Continuity Log)

Coda is append-only: it records changes and decisions.

**Events**

- `MEMNODE_CREATED`
- `MEMNODE_CONSENT_UPDATED`
- `MEMNODE_REVOKED`
- `MEMNODE_SALIENCE_UPDATED`
- `RETRIEVAL_DECISION`
- `NUDGE_DECISION`
- `STAGEPORT_DENY`
- `STAGEPORT_ALLOW`

**Invariant L1 — Append-only**
Coda MUST be append-only. Deletions/edits MUST be represented as new events, not mutation.

**Invariant L2 — Auditable decisions**
Every retrieval/nudge decision MUST have a corresponding Coda event including:

- decision (allow/deny)
- policy reason code(s)
- involved MemNode IDs (redacted if necessary)
- timestamp + caller identity

---

### 2.4 StagePort (Boundary Gate)

StagePort is the enforcement boundary that returns **ALLOW** or **DENY** with reasons.

**Checks (non-exhaustive)**

- consent validity + scope match
- masking rules for the current context
- sensitivity filters (e.g., user-defined “red lines”)
- prompt injection indicators in integration pathways
- notification safety constraints
- rate limits for nudges
- provenance/citation requirements (if policy demands)

**Invariant S1 — Fail closed**
If StagePort cannot verify policy, it MUST return DENY.

**Invariant S2 — Reason codes**
All decisions MUST return a machine-readable reason code.

---

## 3) Lifecycles

### 3.1 Write path

1. Candidate memory is formed (user input, import, system inference).
2. StagePort evaluates:
   - consent present?
   - data allowed?
   - scope?
3. If ALLOW:
   - encrypt payload
   - store MemNode
   - append Coda event(s)
4. If DENY:
   - do not store
   - append `STAGEPORT_DENY` with reason codes

### 3.2 Read path

1. Retrieval proposes nodes (search, embeddings, graph traversal).
2. StagePort filters the candidates.
3. Only StagePort-approved nodes can influence output.
4. Coda records what was attempted and what was allowed/denied.

---

## 4) Nudges (proactive surfacing)

Nudges MUST follow the Nudge Constitution (`RULESET_NUDGE_CONSTITUTION_v1.0.md`).
StagePort MUST evaluate nudge eligibility, not the application layer.

**Invariant N1 — No surprise nudges**
If the user has not explicitly enabled a nudge class, it MUST NOT occur.

---

## 5) Minimum implementation target (v0)

The first runnable implementation SHALL include:

- StagePort Gate (write + read)
- Coda append-only event log
- A minimal MemNode store (even a file-based store is acceptable)
- A denial path that never leaks content

See `docs/ROADMAP.md` and Issue #1.
