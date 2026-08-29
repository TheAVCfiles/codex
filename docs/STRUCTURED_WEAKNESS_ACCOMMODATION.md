# Structured Weakness Accommodation — partner-agent handoff doctrine

Status: Phase 1 public specification only  
Repo: TheAVCfiles/codex  
Raw storage: PRIVATE_RUNOFF_REPO_TBD  
Writes: prohibited until separately approved

## Purpose
- Document the partner-agent handoff pattern: when an agent hits a capability boundary, it must produce an explicit, auditable handoff rather than a silent failure.
- This document captures the doctrine demonstrated in PR #444: Copilot prepared the branch and docs; ChatGPT opened the draft PR after explicit human authorization; human authority remained intact.

## Definition
Structured Weakness Accommodation is a system design rule requiring agents to convert limitations into explicit, auditable handoffs rather than dead ends, silent failures, or vague refusals.

## Why capability boundaries are not failures
- A capability boundary is an interface limitation, not a mistake. Declaring it transparently preserves safety and choreographs multi-agent collaboration.
- Treating boundaries as handoffs allows specialized agents to play to their strengths and preserves human authority for actions that require explicit approval.

## Required handoff fields
Agents must produce the following JSON-shaped handoff when they stop at a capability boundary:

```json
{
  "handoff_id": "uuid-v4",
  "origin_agent": "copilot",
  "capability_boundary": "cannot_create_pull_request_from_current_environment",
  "completed_work": [
    "created branch",
    "committed docs",
    "preserved documentation-only scope"
  ],
  "blocked_action": "open draft pull request",
  "prepared_artifacts": [
    "branch ref",
    "commit sha",
    "changed-file list",
    "PR title",
    "PR body",
    "safety constraints"
  ],
  "next_agent_action": "create draft PR via available GitHub connector after human authorization",
  "do_not_change": [
    "do not merge",
    "do not add workflows",
    "do not add scripts",
    "do not add raw Runoff",
    "do not create private repo"
  ],
  "human_authority_required": true
}
```

## Example (this PR)
- Completed work: Copilot created branch `phase-1/public-staging-specs` and committed the Phase 1 docs as documentation-only changes.
- Blocked action: Copilot could not open the draft PR from its environment.
- Handoff: Copilot returned a structured handoff containing branch ref, commit SHA, changed-file list, PR title/body, and safety constraints.
- Next agent action (ChatGPT): opened the draft PR after explicit human authorization.
- Human authority: PR is draft, not merged, and subject to human review.

## Rules for agents
1. Never hide limitations. If an agent cannot perform an action, it must produce a Structured Weakness Accommodation handoff as soon as possible.
2. The handoff must be auditable (include commit SHA, branch ref, changed-file list, and timestamp) and preserved in provenance records.
3. The next agent may execute only the blocked action explicitly authorized by a human. No implicit escalation.
4. Handoffs must include explicit `do_not_change` constraints; agents must preserve those constraints.
5. Handoffs are not promotion events. They are instructions and evidence for the next actor.

## Human & governance rules
- Humans control authority for any write actions that change durable, canonical state (PR open/merge, repo creation, production deploys, financial/legal actions).
- Agents enable the human to act by preparing clear, minimal artifacts and by refusing to proceed past their capability boundary without explicit human approval.

## Display & provenance
- Each handoff must be visible in the staging dashboard or audit log as an independent artifact with its `handoff_id`, origin agent, and a link to prepared artifacts (branch, commit).
- Handoffs must be append-only entries in the governance provenance ledger and must not overwrite previous records.

## Anti-patterns
- Do not convert a capability boundary into blame or vague refusal. Do not say simply "I can't." Produce the handoff.
- Do not auto-escalate or auto-execute blocked actions without explicit human authorization.

## Phase 1 note
- This is documentation-only content to be included in Phase 1 specs. No code, PR merges, or repo creation is implied by this document.
