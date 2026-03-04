# StagePort / DecryptOS — Reference Architecture Map

## Platform Shape (Three-Layer Model)

### 1) Operating System Layer (Governance Infrastructure)

StagePort OS is the institutional control layer for creative organizations.

**Primary domains**

- People and role governance (students, faculty, judges, admins)
- Studio/project operations
- Offer and class lifecycle
- Credentials and verification
- Ledger and reporting
- Safety + compliance surfaces (including Title IX-ready audit outputs)

### 2) Engine Layer (Composable Intelligence)

Specialized compute services plug into the OS as independent engines.

**Current engine family**

- **PyRouette**: movement scoring (movement vector + difficulty + execution weighting)
- **Glissé**: movement-to-graph computational primitives
- **Regime**: predictive risk bands and signals
- **GossipRAG**: retrieval and content prediction workflows
- **Verification Engine**: adjudication bridge between credential output and economic output

### 3) Economy Layer (Credential-to-Opportunity Loop)

Closed-loop value system where skill evidence becomes institutional and economic access.

**Canonical loop**

1. Practice / perform
2. Score
3. Certify
4. Badge / credential
5. Cast / teach / deploy opportunity
6. Repeat

This is implemented as an append-only event economy (Sentient Cents + token rails) rather than a single one-time certificate model.

---

## Google-Ready Cloud Translation

### Logical stack

1. **Experience**: Next.js/Vercel portals (studio dashboard, learner dashboard, judge panel)
2. **API**: Cloud Run services (FastAPI/Node service boundary)
3. **AI/Scoring**: Vertex AI + custom motion engines
4. **Data**: Postgres (Cloud SQL/Neon) for institutional records + ledger events
5. **Analytics**: BigQuery for aggregate reporting and governance metrics
6. **Delivery**: GitHub Actions CI/CD and environment-specific release tracks

### Runtime flow

```text
Users
  ↓
Barre Code / StagePort UI
(Next.js / Vercel)
  ↓
Stage Manager API
(Cloud Run)
  ↓
┌───────────────┬───────────────┬───────────────┐
│ Street Cred   │ Screen Cred   │ Stage Cred    │
│ verification  │ verification  │ verification  │
└───────────────┴───────────────┴───────────────┘
  ↓
Credential + Verification Engine
  ↓
Sentient Ledger (Postgres)
  ↓
Token rails (Street / Screen / Stage)
  ↓
Analytics + governance reporting (BigQuery)
```

---

## System Primitive

The system normalizes one reusable primitive:

**motion → score → credential → audit artifact → tokenized economy**

This primitive can run across dance/performance and transfer to adjacent embodied domains (athletics, culinary, simulation labs, physical craft training).

---

## Deployment Sequence (Leverage-First)

### Phase 1 — Production Proof

- Deploy a live studio instance
- Capture architecture diagrams, usage metrics, and release logs

### Phase 2 — Certification + Credibility

- Complete Google Cloud architect pathway
- Pair certification with live reference deployment evidence

### Phase 3 — Reference Architecture Pitch

- Position as cloud pattern, not only a product demo:
  - "Creative education infrastructure using Cloud Run + Vertex AI"

### Phase 4 — Marketplace Packaging

- Publish as a deployable StagePort studio OS package
- Shift from bespoke delivery to repeatable install model

---

## Institutional Design Principle

- **Authority is temporal** (role-based and time-bounded)
- **Proof is durable** (artifacts and ledger events are retained)

Operationally: people hold temporary permissions; the system preserves permanent records.
