# The House — Room Governance Specification

Date: 2026-05-08

## Status

The House is the operating-room layer for Global AVC Systems, Inc. It sits between idea and proof, translating founder/client work into rooms, gates, payment states, agreement states, vendor records, evidence, and delivery posture.

## Core Line

> Book a room between idea and proof.

## Product Role

The House is not a generic CRM.

It is a governed operating console for:

- client suites
- room keys
- payment states
- agreements
- vendors
- W-9 requests
- evidence
- records
- templates
- Stripe links
- operator access
- corporate posture
- manual fallback systems

## Fire Code Doctrine

The House runs on fire-code logic.

Core rules:

- Exits are always unlocked.
- Leaving is never scored, shamed, or punished.
- Consent increases before speed increases.
- Acceleration without certainty is unsafe by construction.
- Any room may be gated, paused, closed, or exited without emotional interpretation.

## Velocity and Consent Law

> Speed only increases when certainty and consent increase.

A system that accelerates first and asks permission later is unsafe by construction.

Applied to client operations:

- no activation without payment state
- no deep work without agreement state
- no vendor routing without authorization
- no evidence handling without permission boundary
- no production posture without review

## Room State Model

| State | Meaning |
| --- | --- |
| Inquiry | Initial interest; no operating window opened. |
| Prepared | Room shell exists; access not yet active. |
| Deposit Paid | Partial activation; limited access may open. |
| Active | Payment, contract, and operator requirements current. |
| Gated | Payment, contract, or requirement missing. |
| Paused | Work stopped without closing the room. |
| Closed | Engagement complete. |
| Licensed | Ongoing rights/access governed by license terms. |
| Exited | Client or operator left the room. |

## Payment State Model

| State | Meaning |
| --- | --- |
| Not Requested | No payment request has been issued. |
| Requested | Payment link/invoice has been sent. |
| Deposit Paid Pending | Partial remittance received, activation not complete. |
| Current | Payment requirement satisfied. |
| Overdue | Payment due date passed. |
| Need Action | Operator must request, follow up, pause, or reconcile. |
| Paused for Payment | Work halted until account is current. |
| Closed Paid | Final paid state recorded. |

## Agreement State Model

| State | Meaning |
| --- | --- |
| Not Drafted | No agreement exists. |
| Drafted | Agreement prepared. |
| Under Review | Agreement sent or under review. |
| Approved | Terms accepted. |
| Signed | Fully executed. |
| Expired | Scope/window expired. |
| Superseded | Replaced by newer agreement. |

## Client Suite Object

A client suite should include:

- client name
- account ID
- contact
- email
- phase
- room ID
- room key
- payment state
- agreement state
- license state
- current unlock requirement
- portal link
- invite email
- stay summary export
- evidence records
- vendor records
- operator notes

## Vendor Object

A vendor record should include:

- vendor name
- contact
- email
- scope
- date/time window
- fee
- W-9 state
- payment state
- portal link
- request W-9 action
- contract/authorization notes

## Console Metrics

Dashboard cards may include:

- suites
- active rooms
- inquiries
- vendors
- evidence records
- payments needing action
- agreements under review
- W-9s not requested

## Client-Facing Payment Gate Copy

Use clear neutral language:

> Your room is prepared.
>
> Current state: Gated
>
> Reason: activation payment pending
>
> Next unlock: Block 1
>
> Amount required: $X
>
> Work resumes when room activation payment is complete.

## Operator Boundary Copy

Use when a client tries to personalize policy:

> This is not a personal mood. This is the room state. Once the requirement is complete, the next gate opens.

## Pricing Page Role

Pricing should not present services as vague consulting.

Pricing should present:

- room activation
- founder stack audit
- governance install
- proof packet
- infrastructure sprint
- enterprise buildout
- license access

## Systems Page Role

Systems page should track integrations and fallback state:

- Intercom + Fin AI
- GitHub
- Google Cloud
- Stripe
- Ramp
- Vercel
- PostHog
- Confluent
- manual fallback posture
- risk level
- data sensitivity

## Consent / Exit Doctrine Pack

Canonical text:

> Speed follows consent and certainty, never the other way around.
>
> Exits are idempotent: you can tap out early, again, and without a performance review.
>
> I do not weld doors shut because I trust the building. I trust hinges.
>
> Boring is underrated. Boring is safe.

## StudioOS Connection

The House inherits logic from studio operations:

- tuition due states
- class wall announcements
- teacher/mobile view
- room/studio management
- roster/money/operations tabs
- safe movement and safe administration

Studio operations become founder operations.

The same principle holds:

> The room is safe when the rules are legible before the correction is needed.

## Commercial Implication

The House is bread-and-butter infrastructure because it manages the full paid engagement lifecycle:

1. inquiry
2. room preparation
3. agreement
4. payment gate
5. activation
6. evidence capture
7. vendor routing
8. delivery
9. license state
10. closeout/export

## Final Compression

StagePort proves.

Kinetic Ledger verifies.

The House operates.

FounderOS packages.

Global AVC Systems gets paid.
