# Talent Scout / Applause Layer — surfacing buried brilliance

Status: Phase 1 public specification only  
Repo: TheAVCfiles/codex  
Raw storage: PRIVATE_RUNOFF_REPO_TBD  
Writes: prohibited until separately approved

## Purpose
- The Talent Scout (Applause) Layer is a discovery-and-attention subsystem in the staging architecture. It exists to identify artifacts in Runoff or repo surfaces that are unusually valuable, innovative, reusable, commercially promising, or conceptually original.
- Its role is to route elevated human attention (Applause) without granting authority to publish or canonicalize.
- This is documentation-only for Phase 1. No implementation or data changes occur in this phase.

## Principle
- Do not let extraordinary work remain visually indistinguishable from ordinary runoff.
- The Scout/Applause Layer increases signal salience: it highlights, annotates, and routes for human review.
- Applause is attention, not authority.

## Responsibilities
During repo inspection, staging, dedupe analysis, or provenance review, the Scout layer shall:
1. Detect buried-gem candidates using evidence-based heuristics.
2. Produce a human-readable explanation of why the artifact matters.
3. Translate flat code or scattered fragments into plain significance language.
4. Preserve source lineage and evidence (artifact refs and provenance chain).
5. Recommend a staging state (wings, marking, surface, backstage, canon_candidate).
6. Avoid false promotion — Applause must not automatically promote an artifact.
7. Never delete or overwrite less-polished ancestors merely because a stronger version exists.

## ScoutSignal (ApplauseEvent) schema (documentation only)
Fenced JSON example — this schema documents the ScoutSignal structure; ScoutSignals are append-only observations and route attention only.

```json
{
  "scout_signal_id": "uuid-v4",
  "created_at": "2026-08-29T12:00:00Z",
  "artifact_ref": "owner/repo:path@commit",
  "linked_capture_id": "optional-capturepacket-id",
  "detected_by": "repo-inspector|agent|human",
  "signal_type": [
    "technical_invention",
    "architecture_pattern",
    "commercial_wedge",
    "expressive_breakthrough",
    "reusable_component",
    "governance_primitive",
    "product_seed",
    "evidence_anchor"
  ],
  "applause_level": "spark|strong|spotlight|standing_ovation",
  "why_it_matters": "Plain-language explanation of what is unusually valuable.",
  "evidence_refs": [
    "repo/path/file.ext@commit",
    "pull_request_url",
    "test_result_or_doc_ref"
  ],
  "recommended_staging_state": "wings|marking|surface|backstage|canon_candidate",
  "confidence_score": 0.0,
  "risk_notes": "Why this should not be promoted automatically.",
  "human_review_required": true
}
```

## Display & human workflow (Applause Card)
When a ScoutSignal is generated, agents surface an Applause Card in the staging dashboard (or review queue) with the following fields:
- What I found (artifact summary)
- Why it matters (plain language)
- What makes it unusual (technical/commercial/expressive signals)
- Where it came from (artifact refs & lineage)
- What it might become (suggested opportunities)
- What not to do yet (risk / guardrails)
- Recommended next staging move (wings/marking/surface/backstage/canon_candidate)

## Anti-patterns
- Do not use the Talent Scout Layer as an applause machine. Signals must cite evidence and be specific.
- Distinguish emotional or rhetorical excitement from signal-worthy technical or architectural reuse value.

## Evidence & provenance
- ScoutSignals must include evidence_refs and link to the provenance_chain of CapturePackets or repo artifacts.
- ScoutSignals are not promotion; they are routed to human reviewers for elevated consideration.

## Phase 1 note
- This document is Phase 1 public specification only. Implementation is planned in later phases (Phase 3 and Phase 4/5 references in IMPLEMENTATION_PLAN.md). No code, data, or infrastructure changes occur in Phase 1.
