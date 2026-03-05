# StagePort Google-Ready Reference Architecture

This document translates the StagePort stack into infrastructure language that cloud reviewers can parse quickly.

## 1) Platform Shape (Three Layers)

1. **Operating System Layer (Studio Governance)**
   - People, projects, roles, offers, compliance, and ledger supervision.
2. **Engine Layer (Specialized Compute)**
   - Py.rouette scoring, kinematics signal analysis, critique/risk engines.
3. **Economy Layer (Credential + Value Loop)**
   - Score -> credential -> badge/token -> opportunity -> repeat.

## 2) GCP-Mapped System Diagram

```mermaid
flowchart TD
    U[Users: Students • Faculty • Judges • Admins]
    FE[StagePort UI\nNext.js on Vercel]
    APIGW[StagePort API Gateway\nCloud Run + FastAPI]

    subgraph ENG[Engine Services]
      PY[Py.rouette Scoring Service]
      KIN[Kinematics / Signal Engine]
      JUDGE[AI Critique Panel\nVertex AI models]
      VERIFY[Verification Engine\nHuman + model checks]
    end

    subgraph DATA[Data + Ledger]
      PG[(Postgres / Cloud SQL or Neon)]
      LEDGER[(Sentient Ledger\nappend-only events)]
      CRED[Credential Issuer\nW3C VC-style records]
    end

    BQ[Analytics + Reporting\nBigQuery]

    U --> FE --> APIGW
    APIGW --> PY
    APIGW --> KIN
    APIGW --> JUDGE
    PY --> VERIFY
    KIN --> VERIFY
    JUDGE --> VERIFY
    VERIFY --> CRED
    CRED --> LEDGER
    APIGW --> PG
    LEDGER --> PG
    PG --> BQ
    LEDGER --> BQ
```

## 3) Core Lifecycle (Product Logic)

```text
practice -> score -> credential -> audit report -> token economy
```

Operationally:

```text
data ingestion -> analysis -> economic output -> governance update
```

## 4) Service Boundaries (Deployable Units)

- `stageport-ui`: frontend and operator dashboards.
- `stageport-api`: auth, RBAC, scheduling, and orchestration.
- `engine-pyrouette`: technical scoring of movement events.
- `engine-kinematics`: thresholds, hysteresis, and motion signals.
- `engine-judge`: style-aware critique pathways.
- `engine-verification`: evidence reconciliation + integrity caps.
- `service-credentials`: signed credential issuance and revocation.
- `service-ledger`: append-only financial/proof events.
- `service-reporting`: compliance exports (including Title IX-ready outputs).

## 5) Proof-of-Deployment Sequence

### Phase 1 — Working reference deployment

- Real login + role permissions.
- Real class/session objects.
- Real scoring event path to ledger.

### Phase 2 — Evidence capture

- Usage metrics and event throughput.
- Deployment logs and incident notes.
- Sample credential and compliance reports.

### Phase 3 — Partner-facing architecture pack

- System vision diagram.
- Cloud infrastructure diagram.
- Data flow + controls diagram.
- Installation/deployment runbook.

## 6) Architecture Invariants

- No credential without verifiable score evidence.
- No token/value event without ledger lineage.
- No governance report without replayable source records.
- Human oversight remains available at every verification checkpoint.
