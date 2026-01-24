# 2016 — left-pad (COUPLING.SNAP)

## What happened

A tiny npm package removal caused widespread build failures across the JavaScript ecosystem. Small dependency, massive coupling.

## Why it matters to M.O.M.

Memory/governance systems fail the same way when they depend on:

- unpinned policy modules
- vendor behavior changes
- “minor” libraries in the critical path (crypto, parsing, notifications)

## Score (Impact × Coupling × Speed)

- Impact: 4 (broke many production builds)
- Coupling: 5 (deep transitive dependency graph)
- Speed: 5 (failure propagated instantly)
  Total: 100/125

## Fall type

COUPLING.SNAP

## Preventable invariant

**Invariant:** All governance-critical dependencies MUST be pinned and integrity-verified.

## Test that would catch it

- Dependency audit test: fail build if any governance-critical package is unpinned.
- Integrity check test: hash verification of vendored critical modules.

## Policy to contain blast radius

- “Critical path budget”: governance boundary (StagePort + crypto) MUST use vendored or pinned dependencies only.
