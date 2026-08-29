# Implementation Plan — Phase 1 (public-spec only) + planned phases

Status: Phase 1 public specification only  
Repo: TheAVCfiles/codex  
Raw storage: PRIVATE_RUNOFF_REPO_TBD  
Writes: prohibited until separately approved

## Scope and constraint (Phase 1)
- Phase 1 is documentation-only and public; it publishes the repo-inspector spec, CapturePacket schema, Staging Policy, Talent Scout, and Structured Weakness Accommodation docs to codex.
- No code, no scripts, no workflows, no branch creation, no private-runoff repo creation in Phase 1.
- All raw Runoff storage remains `PRIVATE_RUNOFF_REPO_TBD` until a separate decision in Phase 2.
- Even private-repo writes are not allowed until Phase 2 chooses the private runoff repo and defines authorized operators. Phase 1 is documentation only.

## Phase-by-phase plan (overview)
- **Phase 0 (planning):** approve this draft package (this chat).
- **Phase 1 (public-spec PR in codex)** — the documents in this package:
  - `docs/REPO_INSPECTOR.md`
  - `docs/CAPTUREPACKET_SCHEMA.md`
  - `docs/STAGING_POLICY.md`
  - `docs/TALENT_SCOUT_LAYER.md`
  - `docs/STRUCTURED_WEAKNESS_ACCOMMODATION.md`
  - `docs/IMPLEMENTATION_PLAN.md` (this file)
  - Acceptance: these docs land in codex as the public doctrine surface only. They reference `PRIVATE_RUNOFF_REPO_TBD` (placeholder).
- **Phase 1a (Talent Scout / Applause Layer):**
  - `docs/TALENT_SCOUT_LAYER.md` documents ScoutSignal and Applause UX (already added in Phase 1 branch).
- **Phase 1b (Structured Weakness Accommodation):**
  - `docs/STRUCTURED_WEAKNESS_ACCOMMODATION.md` documents the partner-agent handoff doctrine and required handoff schema (this document).
- **Phase 2 (private-runoff selection & docs):**
  - Approve storage option (Option A: existing private repo; Option B: create new private `stageport-governance`).
  - Create private repo and add README, directory layout, access policy.
- **Phase 3 (read-only implementations):**
  - Implement repo-inspector read-only script and publish implementation as a read-only artifact (implementation may live in codex or an adjacent tooling repo).
  - Implement proposal generator as a read-only agent that annotates CapturePackets (no writes).
  - **Repo-inspector may emit ScoutSignals during read-only inspection.**
  - **Repo-inspector or agent code must produce Structured Weakness Accommodation handoffs when hitting capability boundaries.**
- **Phase 4 (private-runoff write flow & minimal capture client):**
  - After private repo exists and access is configured, implement one small, auditable write flow into `PRIVATE_RUNOFF_REPO_TBD` with preflight gating.
  - Implement minimal staging dashboard (read-only until Promote).
  - **Dashboard should show Applause Cards / Spotlight queue for human review and a Handoff queue for Structured Weakness Accommodation artifacts.**
- **Phase 5 (marking & promotion flows with governance):**
  - Implement reversible marking artifact creation under `marking/*` namespace (policy opt-in).
  - Implement Promote flow with human approvals, compliance checks, and audit commit conventions.
- **Phase 6 (scale & infra decisions):**
  - Consider S3/DB/search only if escape criteria are met; do not introduce before governance review.

## Phase 1 deliverables (exact content for future PR)
- `docs/REPO_INSPECTOR.md` (spec + example output)
- `docs/CAPTUREPACKET_SCHEMA.md` (JSON schema + examples + visibility fields)
- `docs/STAGING_POLICY.md` (non-destructive rules, preflight gate, autonomy matrix)
- `docs/TALENT_SCOUT_LAYER.md` (ScoutSignal schema and Applause UX)
- `docs/STRUCTURED_WEAKNESS_ACCOMMODATION.md` (handoff doctrine and schema)
- `docs/IMPLEMENTATION_PLAN.md` (this file; phases and acceptance criteria)
- Each doc must include the `PRIVATE_RUNOFF_REPO_TBD` placeholder and explicit admonition: "Do not store raw Runoff in codex."

## Acceptance tests (Phase 1)
- AT1: All Phase 1 docs present and clearly state codex is public and `PRIVATE_RUNOFF_REPO_TBD` is the private raw-runoff target.
- AT2: CapturePacket schema includes `visibility_class` and `public_safe` fields with default = `private_raw` and `public_safe=false`.
- AT3: Repo-inspector contract defines default branch discovery and visibility preflight rules.
- AT4: Implementation plan explicitly forbids writing raw Runoff to codex.
- AT5: Structured Weakness Accommodation doc is present and describes mandatory handoff fields and behavior.

## First-PR checklist (to be prepared, not executed)
- Draft docs in a branch or patch (but do NOT create them yet).
- Prepare PR description that emphasizes: spec-only, public codex, `PRIVATE_RUNOFF_REPO_TBD`, no raw data.
- Provide a reviewer checklist confirming default-branch detection and preflight / non-destructive rules.

## Risk & mitigation
- Risk: accidental upload of raw Runoff into codex.  
  Mitigation: codex docs explicitly ban raw data; preflight checks; human review before any PR creates or references CapturePackets.
- Risk: mistaken assumption about default branch names.  
  Mitigation: repo-inspector must detect default branch metadata.
- Risk: premature writes.  
  Mitigation: first PR is docs-only; write flows only in later phases after explicit approval.

## Governance & approvals (who vets writes)
- Only explicitly authorized operators (list to be defined in Phase 2) may run any write flows into `PRIVATE_RUNOFF_REPO_TBD`.
- Promotion requires human sign-off (legal/compliance if `canonical_public`).

## Open questions to be decided in Phase 2 (do not decide now)
- Which private repo to use (Option A existing, Option B new).
- Who are write-authorized agents and how service accounts are provisioned.
- Retention windows and archival policy specifics.

## End of Phase 1 plan
- This file set defines the public doctrine/spec only. No implementation actions occur until you explicitly approve the Phase 1 PR and then separately approve Phase 2 storage choices and operator policies.
