# DeCrypt / MythOS as a Modular Signal Engine

## Core claim

**Claim:** “It’s an engine already used across worlds.”

This is testable with one question:

> Does the same runtime pattern execute multiple distinct domain packages?

If yes, the system is operating as an engine.

## What qualifies as an engine

An engine is a reusable runtime controller, not a finished app or a single UI.

A canonical loop:

1. `ingest(input)`
2. `interpret_or_score(input)`
3. `advance_state()`
4. `emit(output)`
5. `persist(optional)`

The runtime remains stable while domain packages (“worlds”) vary.

## What “worlds” are in this stack

A world is **content + rules** executed by a shared runtime pattern.

| World            | Content               | Rules                      |
| ---------------- | --------------------- | -------------------------- |
| Narrative rooms  | Scroll nodes / glyphs | Unlock + proof gates       |
| Ephemeris engine | Transit data          | Celestial math             |
| Regime engine    | Behavioral loops      | Scoring rules              |
| RAG prediction   | Signal data           | Inference logic            |
| MomentProtocol   | Event schemas         | Scoring + protocol updates |

Distinct domains, shared machine structure.

## Repeating runtime pattern across bundles

```text
signals/data
   ↓
controller/engine
   ↓
state transition
   ↓
render/emit
```

Observed module families repeatedly implement this loop:

- Regime engine modules (config load, signal processing, state updates, card/render output)
- Glissé kernel modules (event verification, lineage graph updates, emission)
- Ephemeris adapters (request, compute, result)
- MomentProtocol schema + scoring paths (event intake, score, protocol-state update)
- Prediction/RAG paths (load signals, infer, render)

## Why the kernel can be distributed

A critic may expect one monolithic `kernel.*` file. Modern architectures often use distributed kernels:

- controller logic
- state models
- verification modules
- schemas
- render layers

A distributed kernel is still a kernel when it enforces the same runtime contract.

## FSM evidence

When a UI explicitly reports:

- `FSM: ...`
- `State Machine Active`

that is direct evidence of an active finite-state runtime:

```text
state → transition → next_state
```

State labels can be technical (`STATE_A`) or choreographic (`JETE`, `GLISSE`, `FERMATA`) without changing execution semantics.

## Hardware loop evidence

A sensor pipeline like:

```text
floor tiles → edge node → OSC/Wi-Fi → fusion server → render/audio/haptics
```

is a cybernetic control loop (`body → compute → environment → body`), not a static webpage pattern.

## Cunning Mercy as transition modulation

“kinematics fields coupled to sentiment analysis” maps to:

```text
movement vectors + sentiment signals → transition bias
```

or formally:

```text
next_state = f(kinematics, sentiment, narrative)
```

This is an established control strategy: field-modulated transitions in a state machine.

## Cross-domain portability

The portable architecture is:

```text
signal → score → state → output
```

That pattern naturally supports choreography, prediction, narrative systems, protocol execution, and embodied sensing systems.

## One-sentence positioning

**DeCrypt / MythOS is a modular signal engine: a reusable state-machine runtime (controllers + schemas + verification) that executes multiple domain packages—narrative rooms, regime loops, ephemeris computations, and prediction systems. “Literary OS” is the metaphor; the mechanism is a state-driven engine.**
