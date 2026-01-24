# Fall Taxonomy v0.1

## 1) AXIS.DRIFT

Slow degradation until collapse (precision lost over time).
Preventers: monitoring, budgets, drift tests, rollback discipline.

## 2) TIME.LIE

Schedulers, leap seconds, timezones, clock skew.
Preventers: monotonic time, time fuzzing, defensive calendars.

## 3) HANDOFF.FAIL

Deployments, permissions, ownership mismatches.
Preventers: staged rollouts, least privilege, explicit ownership rules.

## 4) COUPLING.SNAP

Tiny dependency breaks huge system.
Preventers: pinning, vendoring, integrity checks, dependency budgets.

## 5) REGEX.DOOMSDAY

Worst-case complexity / catastrophic backtracking.
Preventers: safe regex libraries, timeouts, fuzz tests, static checks.

## 6) STATE.GHOST

Old codepaths/flags wake up and do violence.
Preventers: flag lifecycle, dead code removal, deploy gates.

## 7) CACHE.HALLUCINATION

Stale truth behaves like reality.
Preventers: cache invalidation strategy, freshness policies, provenance tags.

## 8) POLICY.LEAK

The system reveals what it must not.
Preventers: StagePort gates, redaction modes, notification safety.
