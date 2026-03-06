# Tendu as Initialization State (Movement DSL Note)

## Core invariant

**Init: if you can tendu, you can dance.**

In systems language, this defines a reliable boot state for movement computation:

```text
INIT_STATE = TENDU
```

A valid tendu already proves core constraints are online:

- axis alignment
- weight transfer
- direction vector
- foot articulation
- timing control

If those primitives hold, expanded vocabulary can be derived as progressive constraint extensions.

## State expansion model

One practical expansion chain:

```text
TENDU
 -> JETE
 -> PASSE
 -> DEVELOPPE
 -> ARABESQUE
 -> TURN
```

Each downstream action should be validated as an extension of the root invariant, not as a disconnected command.

## Pedagogy as compilation pipeline

Class structure maps cleanly to staged execution:

```text
BARRE            -> primitive syntax
CENTER           -> phrase composition
ACROSS THE FLOOR -> runtime execution
VARIATION        -> full program
```

This can be treated like a learning compiler:

```text
lexing -> parsing -> compilation -> execution
```

## DSL scope heuristic

Ballet's finite primitive vocabulary (roughly a few hundred base units, depending on classification) sits in a useful DSL range:

- too few primitives: low expressivity
- too many primitives: unstable grammar
- bounded, composable primitives: high expressive reliability

## Engine framing

A choreography runtime can be designed around three linked planes:

- **space** (pose, direction, stage coordinates)
- **time** (meter, tempo, phrase windows)
- **energy** (attack, sustain, release, intensity)

For a minimal demo, use seed expansion:

```text
INPUT:  tendu
OUTPUT: full choreography expansion
```

The demo should show one stable invariant unfolding into phrase-level behavior.
