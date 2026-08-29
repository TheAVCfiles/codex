# Repo Inspector — read-only discovery contract

Status: Phase 1 public specification only  
Repo: TheAVCfiles/codex  
Raw storage: PRIVATE_RUNOFF_REPO_TBD  
Writes: prohibited until separately approved

## Purpose
- The repo-inspector is a read-only discovery agent spec published in codex (public) to enable agents to find likely staging destinations without interrogating the creator.
- It must discover repository metadata (including default branch), visibility, framework hints, and deploy hints, and return a ranked, confidence-scored list of candidate destinations and a recommended reversible Marking type.
- It must NOT write to any repo or service, and must NOT attempt to authenticate to external deployment providers.

## Inputs
- account_or_org: owner (string) or list of repo names (optional).
- optional context: CapturePacket id or small snippet for matching heuristics.

## Read-only rules
- Use GitHub REST API or GraphQL only in read-only mode.
- Discover default branch from repository metadata (do not assume "main", "master", or "root").
- Detect repository visibility (public/private) via API.
- Fetch package.json, vercel.json, netlify.toml, .github/workflows/*, docs, README hints where available — read only.
- Do NOT attempt to read secrets, external provider consoles, or any non-GitHub services.
- Return limited, evidence-backed results; avoid noisy or speculative matches.

## Output (JSON) — candidate list
Example output schema:

```json
{
  "inspector_version": "v0.1",
  "inspector_run_id": "uuid-v4",
  "run_at": "2026-08-29T12:00:00Z",
  "candidates": [
    {
      "repo": "owner/repo",
      "default_branch": "root",
      "visibility": "private",
      "recent_activity": "2026-08-28T12:34:56Z",
      "framework_hint": {
        "detected": "next",
        "evidence": ["package.json -> dependencies['next']"]
      },
      "deploy_hints": ["vercel.json@/path", ".github/workflows/deploy.yml@/path"],
      "likely_surface": "agent-demo",
      "confidence_score": 0.82,
      "rationale": "Active Next.js repo with Vercel metadata and recent commits; README mentions StagePort demo.",
      "recommended_marking_type": "branch-pr",
      "notes": ["contains mcp adapter", "demo surface referenced in README"]
    }
  ]
}
```

## Confidence & rationale
- Confidence should be computed from explicit evidence: file presence, active commits, recent PRs, explicit README declarations, and code pattern matching.
- Provide concise rationales per candidate, pointing to the files or metadata that produced the classification.

## Visibility preflight guidance (embedded)
- The inspector MUST include visibility with each candidate and highlight:
  - If candidate.visibility == "public", agents MUST block any write unless:
    - CapturePacket.visibility_class is "public_safe_demo" OR "canonical_public",
    - AND CapturePacket.public_safe == true,
    - AND a matching public_safe_approval exists,
    - AND the specific public write has been explicitly human-approved.
  - If candidate.visibility == "private", indicate whether it appears to be governance/enterprise vs prototype/demo (based on README and governance docs).

## Example inspector message (human style)
"I found three plausible destinations: Repo A (owner/A — Next.js with Vercel metadata; confidence 0.82; recommended: create reversible marking PR in marking/{capture-id}), Repo B (owner/B — older prototype; confidence 0.61), Repo C (owner/C — governance spine; confidence 0.45). Repo A and B are private; Repo C is public. Because this capture defaults to private_raw, do not write to Repo C unless explicitly approved."

## Implementation note (for Phase 2)
- The inspector is a public-spec artifact living in codex and must be implemented as a read-only script/tool later. Phase 1 publishes the spec and example outputs only.
