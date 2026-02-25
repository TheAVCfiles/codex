# Vaganova → System Operator Manual (StagePort / Studio.OS)

This manual translates Vaganova technique into engineering primitives so the metaphor is testable, auditable, and repeatable.

## 1) Canonical Technique → System Mapping

| Vaganova term  | Engineering translation                              | Primary artifacts                                                        | Validation                                                    | SLO / metric                                 | Automatic remediation                                            |
| -------------- | ---------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| **Tendu**      | Smallest executable unit of choreography/transaction | Single-step flow modules, decoder micro-actions, atomic command handlers | `tendu` micro-tests in CI + contract tests                    | `<1%` micro-action failure rate per release  | Auto-rollback to previous known-good action + emit trace event   |
| **Aplomb**     | Stability and vertical coherence under load          | Watchdog loop, circuit breakers, SpringBoard health checks               | Resilience and chaos tests, restart drills                    | MTTR `<30s`; error budget burn alerts        | Immediate safe-state entry, isolated restart, append audit event |
| **Épaulement** | Expressive context propagation through state         | Context/state machine, role-aware rendering, intent envelopes            | Integration tests for legal transitions and context integrity | `100%` disallowed transitions blocked        | Reject transition, preserve prior state, log reason code         |
| **Fermata**    | Hold/release semantics and controlled pause          | Mercy Gate policies, timeout governors, operator interrupt controls      | Safety-interrupt simulations + timeout tests                  | `100%` mercy interrupts settle to safe-state | Freeze movement, drain queue, produce signed incident artifact   |
| **Glissé**     | Smooth transitions between steps                     | UX transition engine + transactional handoff checks                      | UI transition snapshots + transaction consistency tests       | Zero dropped handoffs in happy path suite    | Reconcile state and replay idempotent step                       |
| **Sus-sous**   | Tightened closure before elevation                   | Preflight checks, invariant validation, lock discipline                  | Pre-commit invariant tests + lock contention tests            | No invariant violations at release cut       | Block deploy, auto-open corrective task                          |

## 2) CI Pattern: “If you can tendu, you can dance”

Create a dedicated CI stage that treats each micro-action as the unit of confidence.

### Required checks

1. **Tendu unit test lane**: every micro-action has deterministic pass/fail.
2. **Trace emission lane**: every tendu action emits OTLP span metadata.
3. **Truth-temperature lane**: each action records diagnostic confidence (`low`, `medium`, `high`) based on assertion coverage + runtime health.
4. **Rollback lane**: failed tendu action must prove automatic rollback path.

### Reference CI skeleton (GitHub Actions style)

```yaml
name: tendu-ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  tendu-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install deps
        run: pnpm install --frozen-lockfile
      - name: Run tendu micro-tests
        run: pnpm test:tendu
      - name: Validate trace emission
        run: pnpm test:tendu:traces
      - name: Validate rollback contracts
        run: pnpm test:tendu:rollback
```

### Telemetry payload contract

```json
{
  "event": "tendu.executed",
  "action_id": "decoder.step.normalize_input",
  "trace_id": "<otlp-trace-id>",
  "truth_temperature": "high",
  "latency_ms": 38,
  "result": "pass",
  "rollback_available": true,
  "operator_context": "studio_owner"
}
```

## 3) Archival lineage backlog (Beacon closure plan)

| Gap                                | Deliverable                                              | Owner role                 | Due     | Acceptance criteria                                  |
| ---------------------------------- | -------------------------------------------------------- | -------------------------- | ------- | ---------------------------------------------------- |
| Founding year ambiguity            | Signed provenance memo + two corroborating records       | Archivist + legal reviewer | 14 days | Memo archived, hashes logged, citation-ready summary |
| Program archive incompleteness     | Scanned programs with OCR + metadata index               | Archive operations         | 21 days | 95% legible OCR, searchable by date/venue            |
| Oral history missing               | Recorded interviews (teachers/directors) with transcript | Oral history lead          | 30 days | 3+ interviews, consent forms, transcript timestamps  |
| Bardavon performance timeline gaps | Public timeline with linked artifacts                    | Research associate         | 10 days | Every entry has source artifact and custody hash     |

## 4) Safety/Ethics checklist (release gate)

A release is **blocked** if any item fails:

- Mercy Gate interrupt test proves deterministic safe-state transition.
- Torque/load simulation suite includes threshold + over-threshold scenarios.
- Etheos Scorer outputs are attached to build artifacts.
- Title-IX/ethics ledger view renders and exports for auditor mode.
- Audit table includes operator ID, action ID, timestamp, reason code, and remediation path.
- “Mercy drill” script is run at least once per release candidate and signed off.

## 5) Immediate collaborator handoff

Use this package for the next sprint:

1. This operator manual as canonical spec.
2. Add `test:tendu`, `test:tendu:traces`, and `test:tendu:rollback` commands.
3. Create auditor dashboard stories for ethics ledger visibility.
4. Create archival tickets from the backlog table with named assignees.
