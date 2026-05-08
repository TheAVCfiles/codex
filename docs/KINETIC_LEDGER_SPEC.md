# Kinetic Ledger Specification

Date: 2026-05-08

## Purpose

The Kinetic Ledger is the canonical receipt and event-record layer for The House, StagePort, FounderOS, and related Global AVC Systems infrastructure.

The ledger exists to:

- preserve proof
- preserve timing
- preserve room state
- preserve payment state
- preserve operator review
- preserve induced performance records
- preserve exits
- preserve licensing boundaries

The Kinetic Ledger is not a surveillance engine.

It is a bounded proof system.

## Core Law

> If the room changes state, the ledger should be able to explain why.

## Event Types

Suggested canonical event types:

| Event Type | Meaning |
| --- | --- |
| ROOM_CREATED | Intake room established |
| PAYMENT_REQUESTED | Invoice/payment link issued |
| PAYMENT_RECEIVED | Payment confirmed |
| PAYMENT_FAILED | Payment failure recorded |
| PAYMENT_OVERDUE | Invoice overdue |
| AGREEMENT_SENT | Agreement delivered |
| AGREEMENT_ACCEPTED | Agreement signed/accepted |
| SCOPE_UPDATED | Scope modified |
| CHANGE_ORDER_REQUESTED | Change order initiated |
| CHANGE_ORDER_ACCEPTED | Change order approved |
| ROOM_ACTIVATED | Room moved to JETÉ |
| ROOM_PAUSED | Room moved to FERMATA |
| ROOM_CLOSED | Room moved to CODA |
| ROOM_RESET | Room archived/reset |
| ACCESS_GRANTED | Access expanded |
| ACCESS_REVOKED | Access removed |
| LICENSE_NOTICE_SENT | License/IP notice delivered |
| DRIFT_REVIEW | Drift review initiated |
| HYDRANT_REVIEW | Hydrant review initiated |
| EXPORT_GENERATED | Receipt/export generated |
| EVIDENCE_ARCHIVED | Evidence preserved |

## Canonical Ledger Fields

Every ledger object should support:

```json
{
  "event_id": "UUID",
  "timestamp": "ISO-8601",
  "room_id": "ROOM-ID",
  "client_id": "CLIENT-ID",
  "operator_id": "OP-ID",
  "event_type": "ROOM_ACTIVATED",
  "prior_state": "FERMATA",
  "new_state": "JETE",
  "payment_state": "Current",
  "agreement_state": "Signed",
  "scope_state": "Defined",
  "license_state": "Internal Use",
  "access_state": "Bounded",
  "drift_flags": [],
  "operator_review": true,
  "linked_invoice": "STRIPE-INVOICE-ID",
  "linked_receipt": "LEDGER-RECEIPT-ID",
  "evidence_refs": [],
  "operator_note": "Quorum satisfied. Activation approved."
}
```

## Ledger Philosophy

The Kinetic Ledger records:

- timing
- transitions
- approvals
- payment boundaries
- evidence continuity
- activation logic

The Kinetic Ledger does NOT attempt to:

- read private thoughts
- infer morality automatically
- monitor irrelevant behavior
- replace human judgment

## Bounded Witnessing

The system should count:

- events
- transitions
- approvals
- receipts
- exports
- room states

The system should avoid:

- invasive telemetry
- unnecessary personal profiling
- unrelated behavioral surveillance
- hidden extraction

## Payment Anchors

Suggested payment references:

- Stripe invoice ID
- Stripe payment intent ID
- internal invoice number
- room activation number
- sprint ID
- phase gate ID

## Receipt Objects

Suggested receipt types:

| Receipt | Meaning |
| --- | --- |
| Activation Receipt | Room moved to JETÉ |
| Pause Receipt | Room moved to FERMATA |
| Change Order Receipt | Scope/payment updated |
| Payment Receipt | Payment confirmed |
| Access Receipt | Access granted/revoked |
| Export Receipt | Deliverables/export generated |
| License Receipt | License scope confirmed |
| Closeout Receipt | Room closed/reset |

## Export Formats

Recommended export formats:

- JSON
- PDF summary
- signed hash receipt
- CSV event table
- append-only archive

## Evidence Preservation

Evidence references may include:

- agreements
- invoices
- screenshots
- exports
- deliverable hashes
- changelogs
- operator notes
- payment records
- access logs

Evidence references should remain bounded to business-relevant material.

## Drift Flag Examples

Suggested drift flags:

- CREATIVE_DRIFT
- CONFUSION_DRIFT
- PANIC_DRIFT
- EXTRACTION_DRIFT
- OBSTRUCTION_DRIFT
- COMPLIANCE_DRIFT
- PAYMENT_RISK
- LICENSE_AMBIGUITY
- SCOPE_COLLAPSE
- HYDRANT_BLOCK

Drift flags are review signals, not automatic guilt.

## State Transitions

Recommended allowed transitions:

```text
GLISSADE -> FERMATA
GLISSADE -> JETE
FERMATA -> JETE
FERMATA -> CODA
JETE -> FERMATA
JETE -> CODA
CODA -> RESET
RESET -> GLISSADE
```

## Human-in-the-Loop Rule

No irreversible action should occur solely because of automated scoring.

Human review is required before:

- permanent room closure
- escalation
- legal action
- payment dispute escalation
- access revocation of active clients
- extraction accusation

## Operator Notes

Operator notes should remain:

- factual
- concise
- non-inflammatory
- timestamped
- business-relevant

Avoid emotional speculation.

## Client Visibility

Clients may see:

- payment state
- room state
- agreement state
- next required action
- activation status
- pause status
- closeout/export status

Clients should not necessarily see:

- internal risk scores
- operator-only notes
- platform review notes
- legal escalation notes

## Final Compression

The Kinetic Ledger is choreography for proof.

Every room movement leaves a receipt.

Every receipt preserves timing.

Every timing record protects the room.
