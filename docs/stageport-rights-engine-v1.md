# StagePort Rights Engine v1

## Objective

Build a defensible, licensable kernel that powers multiple wrappers (StudioOS, Civic, DevOpps) while preserving founder optionality and producing independent liquidity.

## 1) Optionality Structures

### Path A — Exit-First OpCo

- Single OpCo owns product + IP.
- Best for VC speed and clean M&A.
- Tradeoff: minimal persistent royalty rights post-exit.

### Path B — Royalty Spine

- HoldCo owns kernel IP and licenses operators.
- Best for durable participation and multi-operator economics.
- Tradeoff: lower acquisition simplicity and tougher financing narratives.

### Path C — Hybrid (Default)

- HoldCo owns kernel, ontology, signing keys, export authority.
- OpCo owns distribution, wrappers, implementations, support.
- OpCo pays HoldCo metered license fees + royalties.

## 2) Rights Containers

### HoldCo (IP owner)

- Kernel source code + private signing keys.
- Scoring weights, policy tables, ontology, secret prompts.
- License policy engine + revocation list.

### OpCo (operator)

- White-label implementation code.
- Client onboarding, billing, support.
- Analytics dashboards (non-secret layer).

### Optional Royalty Pool

- Receives pre-defined share of kernel-metered revenue.
- Distributes by contributor split schedule.
- Survives OpCo sale/reorg.

## 3) Metering Model (3-axis)

1. Studio base fee (predictable floor).
2. Seat packs (expansion).
3. Credential events (badge/transcript/export issuance).

Primary royalty trigger: credential events.

## 4) Kernel Enforcement Pattern

- HoldCo issues signed license tokens.
- Wrappers verify token and enforce:
  - feature flags
  - seat limits
  - credential permissions
- Metering events emitted for protected actions:
  - `badge_issued`
  - `assessment_scored`
  - `transcript_exported`
  - `verification_requested`

Invalid/expired token -> degraded mode only, no authoritative credential issuance.

## 5) Governance Spine (Fail-Closed Mechanism)

### 5.1 Core Record

Each strategic action is logged as an append-only **Governance Cue**:

- cue_id (SHA-256)
- timestamp
- decision_type
- structural_integrity_index (SSI)
- active_state
- witness_quorum
- risk_allocation_tier
- invariant_results

### 5.2 Structural Integrity Index (SSI)

`SSI_t = 10 * sigmoid((1/Z) * sum(w_i * s(e_i) * exp(-k * delta_t)))`

Where:

- `e_i`: recent events
- `s(e_i)`: invariant alignment score
- `w_i`: event weights
- `k`: temporal decay
- `Z`: normalization constant

Thresholds:

- SSI >= 9.0: coherent
- 7.5 <= SSI < 9.0: stressed but stable
- SSI < 7.5: forced escalation

### 5.3 Escalation FSM

States:

- `IDLE`
- `ACTIVE`
- `STRESS`
- `FAULT`
- `RECOVERY`

Transitions:

- ACTIVE -> STRESS if SSI < 7.5
- STRESS -> FAULT if SSI < 5.0 or witness_quorum < 3
- FAULT -> RECOVERY only after invariant revalidation

### 5.4 Fail-Closed Action (Required)

System response on protected decision attempt:

```text
GOVERNANCE BREACH: Proposed acceleration violates invariant A-01.
Escalation to FAULT state. Capital deployment suspended pending remediation.
No human override allowed without invariant revalidation.
Decision prevented before deployment.
```

### 5.5 Conditional Risk Law

Permitted risk is constrained by integrity, not optimism:

- If SSI >= 9.0 and false-escalation probability < 0.05, max risk tier = 1.5% capital.
- Else max risk tier = 0.25% capital.

## 6) Contract Stack (Minimum Legal Rails)

1. Kernel License Agreement (HoldCo -> OpCo/operator)
   - field-of-use, metering, audit rights, revocation terms
2. Platform MSA (OpCo -> Studio/licensee)
   - studio data ownership; platform kernel authority retained
3. Creator Royalty Addendum
   - eligibility events, split math, payout cadence
4. White-label/Reseller Addendum
   - fixed + margin model, resale boundaries, QC requirements

## 7) 90-Day Liquidity Plan (Independent of Existing Licensee)

Target: $20k-$40k collected cash.

Offer stack:

- Install Sprint (2 weeks): $5k-$9.5k
- Domain Pack License: $2.5k-$7.5k
- Template/Artifact Packs: $49-$199
- Pro Subscription: $49/mo

Example booking mix:

- 3 x $7,500 installs = $22,500
- 2 x $2,500 licenses = $5,000
- 50 x $99 templates = $4,950
- Total = $32,450

## 8) Empirical Validation Pathway

### Phase 1 — Single-Startup Pilot

- Implement Governance Spine in one safety-tech operator.
- Log 12 months of strategic decisions.
- Measure escalation latency + invariant breach frequency.

### Phase 2 — Comparative Study

- Compare against one non-structured governance company.
- Measure override frequency, incident severity, capital volatility.

### Phase 3 — Cross-Industry Replication

- Robotics
- Biotech
- Autonomous systems

## 9) Limitations

- Conceptual architecture; no longitudinal dataset yet.
- Requires accurate invariant specification to function safely.
- Derived from cross-domain constraint modeling; empirical calibration pending.
- May not generalize to low-consequence startups.

## 10) Core Contribution

1. Formal mapping from embodied constraint primitives to executable governance mechanisms.
2. Deterministic escalation architecture for founder-safe safety-tech governance.
3. Risk allocation constrained by structural integrity metrics.

## 11) Non-Negotiables

- Never assign kernel IP into OpCo.
- Never share private signing keys with operators.
- Never allow investor veto over HoldCo licensing architecture.
- Never permit silent failures on protected actions.

## 12) Immediate Decisions to Lock

1. Primary royalty unit: credential-event default.
2. Enforcement mode: offline-capable verification + periodic call-home sync.
3. Default deal shape: non-exclusive operator license with field-of-use boundaries.
