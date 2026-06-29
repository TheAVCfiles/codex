# Agents.md — StagePort Core MVP

## Position

There are no fake autonomous agents here. There are bounded workers with explicit roles.

## 1. Session Agent

Creates and updates session lifecycle records.

## 2. Primitive Agent

Accepts or derives movement primitives and stores them as sequence data.

## 3. FSM Agent

Applies AURE transition logic:
GLISSADE -> JETE -> FERMATA -> CODA

## 4. Scoring Agent

Runs PyRouette draft scoring using TES / PCS / GOE logic.

## 5. Review Agent

Human reviewer validates or overrides primitives and scores.

## 6. Receipt Agent

Builds final payload, hashes it, writes receipt metadata.

## 7. Audit Agent

Appends all relevant system and human actions to the session timeline.

## Rule

Human review remains the authority gate in MVP.
No autonomous promotion without explicit policy later.
