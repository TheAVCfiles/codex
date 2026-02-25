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
