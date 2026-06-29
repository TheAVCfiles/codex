# PRD.md — StagePort Core MVP

## Product

StagePort Core

## One-line

A choreography infrastructure system that converts movement sessions into structured primitives, scored evaluations, and provable receipts.

## Problem

Embodied intelligence is valuable but poorly measured, weakly documented, and hard to monetize or defend. Studios, choreographers, and adjudicators still rely on memory, notes, PDFs, rankings, and opaque judgment.

## Users

- Studios
- Choreographers
- Adjudicators
- Training programs
- Movement researchers

## Jobs to be done

- Capture a session
- Represent movement as primitives
- Record state transitions
- Compute a defendable score
- Validate or override the draft
- Mint a receipt that can be archived or exported

## MVP Scope

- Invite-only auth
- Session create/upload/archive
- Primitive stream input
- AURE FSM transitions
- PyRouette score draft
- Reviewer validation
- Receipt finalization with hash
- Export JSON evidence bundle

## Non-goals

- General AI assistant
- Social/community features
- Consumer creator platform
- Full sensor-floor integration
- Credential token economy
- Bedrock workflows

## Core User Flow

Admin creates session -> source uploaded or primitives entered -> processing pipeline runs -> reviewer validates -> receipt finalizes -> archive/export.

## Success Metrics

- 90%+ session completion
- reviewer time < 2 min/session
- low override rate
- first pilot renewal
- cloud spend inside budget

## Risks

- overly broad wedge
- weak primitive definitions
- unreliable scoring rules
- excessive video retention cost
- security sloppiness around media assets

## Product Decision

Start with scoring + provenance. Expand later.
