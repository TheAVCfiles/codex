# Staging Policy — non-destructive human-source hydraulics

Status: Phase 1 public specification only  
Repo: TheAVCfiles/codex  
Raw storage: PRIVATE_RUNOFF_REPO_TBD  
Writes: prohibited until separately approved

## Principle (top of doc — mandatory)
The purpose of this system is not to make the creator cleaner. The purpose is to let high-bandwidth source material remain native while downstream agents preserve, route, test, and stage it safely.

## Policy summary
- `codex` is the public doctrine/spec surface. It contains the rules, schema, and the repo-inspector spec only.
- `PRIVATE_RUNOFF_REPO_TBD` is the future private append-only raw capture store for Runoff.
- Do not put raw Runoff or backstage content into `codex` (public) by default.
- Staging is non-destructive: move → relabel → archive → supersede → link.
- Never: delete → overwrite → flatten → regenerate raw sources.

## Preflight & write gating (strict)
Agents must run the preflight check before any write:

1. Resolve target repo visibility and default branch via GitHub API.
2. If target repo visibility == "public" then block the write unless ALL of the following are true:
   - `capture.visibility_class` is `public_safe_demo` OR `canonical_public`;
   - `capture.public_safe` is `true`;
   - `capture.public_safe_approval` exists (fields: `approved_by`, `approved_at`, `rationale`);
   - the human has explicitly approved that specific public write (a recorded promotion action).
   If any of these are not met, the write must be BLOCKED and an explanatory provenance event must be appended to the CapturePacket.
3. If target repo visibility == "private" and the agent has explicit workspace policy permission, the agent may proceed per the autonomy matrix.
4. All attempts (success or failure) must add a provenance event to the CapturePacket.

## Visibility classes & meaning
- `private_raw`: default for all new captures. Not public. Requires explicit approval to publish.
- `internal_backstage`: internal but still sensitive; limited group access.
- `public_safe_demo`: content scrubbed/approved for public demo surfaces.
- `canonical_public`: authoritative public artifact (requires legal/compliance checks).
- `legal_hold`: frozen; cannot be modified or promoted without legal clearance.
- `client_confidential`: client-owned data with contractual constraints.

## Public-write gate (exact)
A public write is permitted only when all of these are true:
- `visibility_class` ∈ {`public_safe_demo`, `canonical_public`};
- `public_safe == true`;
- `public_safe_approval` exists and contains `approved_by`, `approved_at`, and `rationale`;
- The specific public write has been explicitly human-approved (promotion action recorded in provenance).

Agents must enforce this gate strictly. Any attempt to write to a public repo that does not satisfy all four items is blocked.

## Marking & reversible operations
- Marking artifacts live in `marking/*` namespace or should be created as draft PRs and must:
  - Reference the CapturePacket id.
  - Be reversible (branch deletion or closing PR).
  - Be clearly labeled as "MARKING DRAFT — REVERSIBLE".
- Creation of marking artifacts by agents is allowed only if workspace policy permits; default is propose-only (no writes).

## Promotion & canonization (human authority)
- Promotion to CANON (merge into authoritative branch, publish to production) requires explicit human approval, completion of the compliance checklist, and a recorded provenance event.
- Promotion must record commit/PR references that include capture id and promotion event id.

## Audit & provenance
- Every agent and human action appends an event to `provenance_chain`. Events include `actor`, `timestamp`, `action`, `details`, and `evidence_refs`.
- The governance repo/audit log must remain append-only. Use git history to reinforce provenance.

## Retention & archival
- Default retention for `private_raw` is configurable by governance (e.g., 1 year) — specified in `PRIVATE_RUNOFF_REPO_TBD` README when created.
- Archival is an explicit action that creates a new archive artifact and links to the original capture.id. The original remains preserved.

## Safety & client confidentiality
- Client-confidential captures require contractual controls; store only in `PRIVATE_RUNOFF_REPO_TBD` and flag as `client_confidential`. Do not expose to public surfaces.

## Anti-pattern: laundering raw process into polish
Do not use this system to launder raw process into polish. Public artifacts must retain source lineage; backstage material must remain reconstructable. The system is designed to preserve provenance, not erase it. Always prefer linking back to raw CapturePackets rather than rewriting source history.

## Operational checklist (for agents)
- Always run repo-inspector (read-only) to gather candidate destinations and visibility before proposing any writes.
- Do not author any write into `codex` with raw content.
- When in doubt, default to preserving and refusing to write to a public surface.
- Even private-repo writes are not allowed until Phase 2 chooses the private runoff repo and defines authorized operators; Phase 1 is documentation only.
