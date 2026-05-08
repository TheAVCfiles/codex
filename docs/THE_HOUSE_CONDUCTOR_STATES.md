# The House — Conductor States

Date: 2026-05-08

## Status

This document translates the Rosetta Console / Stravinsky Protocol logic into The House client-room operating model.

It preserves the current scroll-state insight:

> The House is the conductor. StagePort is the ledger. Rosetta is the reason engine. FounderOS is the room protocol. Global AVC Systems is the institution.

## Core Operating Chain

```text
Signal -> Gate -> Human review -> Receipt -> Room state -> License/payment boundary
```

Every serious room event should move through this chain before activation, delivery, escalation, or exit.

## Core Law

> No JETÉ without quorum.
> No activation without payment.
> No delivery without scope.
> No reuse without license.
> No panic override without operator review.

## System Mapping

| Layer | Role |
| --- | --- |
| Global AVC Systems, Inc. | Corporate institution and contracting surface |
| The House | Client-room conductor and operating console |
| StagePort | Proof, credential, verification, and ledger surface |
| Rosetta Console | Reason engine: inputs -> gates -> timing -> sizing -> exits |
| FounderOS | Founder room protocol, offers, installs, sprints |
| Kinetic Ledger | Receipt, anchor, and evidence format |
| Intuition Labs R&D | Research, doctrine, experimental systems |

## Conductor State Model

| State | Meaning | Client Effect | Operator Effect |
| --- | --- | --- | --- |
| GLISSADE | Prep / intake / movement between states | Room forming; no full activation yet | Collect intake, assess scope, prepare gate |
| FERMATA | Hold / pause / review | Work paused; evidence preserved; no panic movement | Review payment, scope, trust, license, drift |
| JETÉ | Activation / proceed | Room opens; work proceeds within scope | Execute defined work under current agreement |
| CODA | Exit / close | Access closes; license boundaries remain | Close room, preserve record, stop work |
| RESET | Clean closeout / archive / next phase | Prior room complete; next gate may be offered | Export receipt, archive, propose next phase |

## Room Quorum

A room may move to JETÉ only when the quorum is satisfied.

Minimum quorum:

1. Payment state current or deposit accepted
2. Agreement state signed or expressly accepted
3. Scope state defined
4. License state clear
5. Access state bounded
6. Human operator review complete

If quorum fails, the correct state is FERMATA.

## FERMATA Is Not Failure

FERMATA means disciplined restraint.

Use FERMATA when:

- payment is pending
- payment is overdue
- scope is unclear
- client asks to renegotiate after signing
- extraction risk appears
- trust state is ambiguous
- access should not expand yet
- partner/platform policy requires review
- operator needs time to verify records

FERMATA protects the system from overfitting to panic.

## JETÉ Activation Rule

JETÉ is not enthusiasm.

JETÉ is activation under quorum.

The room may proceed when:

- payment is current
- agreement is current
- scope is current
- license terms are current
- access boundary is current
- operator intentionally activates the room

## CODA Exit Rule

CODA closes or exits the room.

Use CODA when:

- the engagement is complete
- payment fails and work must stop
- trust breaks
- extraction risk becomes too high
- client exits
- operator exits
- scope expires
- new phase requires new agreement

CODA is not punishment. It is clean closure.

## RESET Rule

RESET occurs after CODA when the record is complete.

RESET should include:

- closeout receipt
- room status export
- deliverables list
- access revocation / preservation note
- license boundary reminder
- next-phase offer if appropriate
- archive tag

## Reason Receipt Fields

Every conductor state change should be capable of producing a reason receipt.

Suggested fields:

```json
{
  "timestamp": "ISO-8601",
  "room_id": "ROOM-ID",
  "client_id": "CLIENT-ID",
  "prior_state": "FERMATA",
  "new_state": "JETÉ",
  "payment_state": "Current",
  "agreement_state": "Signed",
  "scope_state": "Defined",
  "license_state": "Internal Use Only",
  "access_state": "Bounded",
  "drift_flags": [],
  "operator_review": true,
  "operator_note": "Quorum satisfied. Room activated."
}
```

## Drift to State Mapping

| Drift Type | Default State |
| --- | --- |
| Creative Drift | FERMATA -> review -> possible change order |
| Confusion Drift | FERMATA -> educate -> written clarification |
| Panic Drift | FERMATA -> slow down -> state room terms |
| Extraction Drift | FERMATA -> harden gate -> possible CODA |
| Obstruction Drift | FERMATA -> hydrant review -> possible CODA |
| Compliance Drift | FERMATA -> platform/legal review |

## Payment to State Mapping

| Payment State | Room State |
| --- | --- |
| Not Requested | GLISSADE |
| Requested | GLISSADE or FERMATA |
| Deposit Paid Pending | GLISSADE or limited JETÉ |
| Current | JETÉ if all other quorum elements pass |
| Overdue | FERMATA |
| Need Action | FERMATA |
| Paused for Payment | FERMATA |
| Closed Paid | CODA -> RESET |

## Client-Safe Language

### FERMATA

> The room is in FERMATA: held for review. Work is paused while payment, scope, license, or access state is clarified.

### JETÉ

> The room has moved to JETÉ: activation confirmed. Work proceeds inside the current paid scope.

### CODA

> The room has moved to CODA: this engagement window is closing. Access and license boundaries remain governed by the written agreement.

### RESET

> The room has reset: records are preserved, current work is complete, and any next phase requires a new gate.

## Operator Language

Do not argue emotion.

State the room state.

Do not verbally renegotiate.

Issue a change order.

Do not keep working unpaid.

Move to FERMATA.

Do not accuse.

Preserve the receipt.

## Commercial Implication

This conductor model makes payment natural because activation is no longer framed as personal permission.

Activation is a room state.

A client does not "convince" the operator to proceed.

A client satisfies quorum.

## Final Compression

The House conducts.

Rosetta reasons.

StagePort proves.

Kinetic Ledger receipts.

FounderOS packages.

Global AVC Systems gets paid.
