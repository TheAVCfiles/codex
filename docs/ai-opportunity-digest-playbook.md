# AI Opportunity Digest Playbook

This playbook defines a reusable format for producing a weekly AI/ML opportunities digest without repetition, hype, or unverifiable claims.

## 1) Modes

### Standard Mode

Includes:

- Free/discounted education
- Fellowships and scholarships
- Grants and non-dilutive funding
- Tool/cloud/API credits
- Paid learning and professional programs

### Capital-Only Mode (NY + US)

Includes only:

- Non-dilutive grants
- Stipend fellowships
- Accelerator funding
- Venture/scaling programs
- Cloud/tool credits with direct monetary value
- Institutional capital channels

Excludes:

- Coursework-only links
- Generic listicles without funding terms
- Repeated opportunities unless materially updated

## 2) Entry Quality Bar

Each opportunity must include:

1. Official source link.
2. Current status (open, rolling, expected cycle, closed/archived).
3. Funding amount or credit range (if disclosed).
4. Eligibility summary (geo, stage, org type, individual/company).
5. Deadline or review cadence.
6. One-sentence strategic fit (why this matters for monetization).

If one of the items above is unknown, mark it explicitly as `Not published`.

## 3) Weekly Output Structure

Use this exact section order:

1. **Top 3 Priority Opportunities** (fastest ROI / nearest deadlines)
2. **New This Week** (not present last run)
3. **Updated This Week** (same program, new deadline/terms)
4. **Rolling Opportunities** (always-open channels)
5. **Action Queue (7-day)** (concrete next actions)
6. **Deadline Radar (30/60/90 days)**

## 4) Anti-Duplication Rules

- Keep a canonical registry keyed by normalized program name + host org.
- Do not re-list unchanged opportunities in `New This Week`.
- If repeated for visibility, move to `Rolling Opportunities` and label as `No change`.
- If a program appears in two categories, keep one primary listing and cross-reference.

## 5) Verification Checklist (Pre-Publish)

- [ ] Every item has an official link.
- [ ] Deadlines are ISO format (`YYYY-MM-DD`) or marked `Rolling`.
- [ ] Funding/credit value is numeric or `Not published`.
- [ ] Eligibility is explicit and non-ambiguous.
- [ ] Duplicate scan completed against last report.
- [ ] Any closed program is moved to an archive section.

## 6) Compact Digest Template

```md
# Weekly AI Opportunity Digest — <DATE>

Mode: <Standard | Capital-Only (NY + US)>

## Top 3 Priority Opportunities

1. <Program> — <Funding> — Deadline: <YYYY-MM-DD/Rolling>
   Official: <URL>
   Eligibility: <1 line>
   Why now: <1 line>

## New This Week

- <Program> ...

## Updated This Week

- <Program> — Update: <deadline change / funding change / reopened>

## Rolling Opportunities

- <Program> — Rolling — <Funding/Credits>

## Action Queue (7-day)

- [ ] <Action 1>
- [ ] <Action 2>
- [ ] <Action 3>

## Deadline Radar (30/60/90 days)

- 30d: ...
- 60d: ...
- 90d: ...
```

## 7) Tone Constraints

- Prefer precise and factual language over motivational copy.
- Avoid promises like "locked" or "scheduled" unless integrated with an actual scheduler.
- Treat each digest as an execution brief: clear, timestamped, and verifiable.
