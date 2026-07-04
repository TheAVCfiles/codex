# PyRouette

PyRouette is a choreography-oriented domain-specific layer built on Python.

It encodes embodied movement principles (axis control, rotational sequencing, invariant enforcement, temporal structure) into parseable, testable syntax. The system treats movement as stateful transitions under constraint, allowing choreographic logic to be modeled, validated, and executed in computational environments.

## Compiler Model

```text
.rou source -> parser -> AST -> validator -> renderer -> credential artifacts
```

PyRouette treats choreography as source code:

- `.rou` files are structured input (not freeform prose).
- Parsing builds an AST for deterministic processing.
- Validation checks biomechanical + structural coherence before rendering.
- Rendering emits artifacts (SVG, JSON, timelines, training modules).

## Design Constraints

1. Every movement declares:
   - biomechanical requirements
   - spatial vector
   - balance state
   - count length
2. Validation must run before render.
3. Outputs must remain deterministic.
4. Credential scoring must be separable from parsing.

## Scope Clarification

PyRouette is **not**:

- a dance simulator
- a personality engine
- a metaphor layer

PyRouette **is**:

- a domain-specific compiler for embodied choreography.

## Initialization Invariant

PyRouette can treat foundational movement primitives as initialization states for a choreography runtime. In the current framing, the root primitive is:

```text
INIT_STATE = TENDU
```

From that invariant, higher-order phrases are modeled as constraint-preserving expansions:

```text
TENDU -> JETE -> PASSE -> DEVELOPPE -> ARABESQUE -> TURN
```

The modeling principle is that each node extends the geometry and timing envelope of the root state rather than introducing unrelated mechanics.

## Staged Learning / Compilation Analogy

Classical training phases map cleanly onto staged compilation:

```text
BARRE -> CENTER -> ACROSS THE FLOOR -> VARIATION
```

```text
LEXING -> PARSING -> COMPILATION -> EXECUTION
```

This gives PyRouette a pedagogically aligned runtime model where technical drills and computational passes share the same architecture.

## Runtime Pipeline (Video to Score)

A practical end-to-end pass can be implemented as:

```text
VIDEO
 -> POSE TRACKING
 -> MOVEMENT DETECTION
 -> ELEMENT TIMELINE
 -> PYROUETTE SCORER
 -> REPORT
```

### Minimum viable prototype

1. Extract pose landmarks from source video.
2. Derive geometric features (joint angles, extension, rotation velocity, center of mass trace).
3. Detect candidate primitives (`TENDU`, `JETE`, `ARABESQUE`, `TURN`) with threshold rules.
4. Convert detected segments into element ledger entries.
5. Apply scoring math:

```text
Raw_e = BV x DD x B
Score_e = Raw_e + GOE
TOTAL = TES + PCS - Deductions + Bonuses
```

## Why this architecture matters

This approach allows choreography to be represented as:

- a finite state machine (movement states + transitions)
- a geometric transform tree (root primitive + expansions)
- a transparent scoring ledger (TES/PCS decomposition)

In short: PyRouette functions as a motion interpreter where a small seed state can expand into full phrase structure, timing, and score artifacts.
