# GlitchPort Scorecard v0.1

Purpose: classify “small causes / massive falls” incidents and derive preventable invariants.

## Score = Impact × Coupling × Speed

- Impact (0–5): how much reality it touches
- Coupling (0–5): how interconnected dependencies are
- Speed (0–5): how quickly failure propagates

Total: 0–125

## Fall Types (see FALL_TAXONOMY_v0.1)

- AXIS.DRIFT
- TIME.LIE
- HANDOFF.FAIL
- COUPLING.SNAP
- REGEX.DOOMSDAY
- STATE.GHOST
- CACHE.HALLUCINATION
- POLICY.LEAK

## Rule

Every incident write-up MUST end with:

- the invariant that would have prevented it
- the test that would catch it
- the policy that would have contained blast radius
