# THREAT_MODEL v1.0 — M.O.M.

Release: 2026-01-24  
Goal: identify how this system fails in reality (where attackers and mistakes live).

---

## 1) Assets

- Stored memories (payload + metadata)
- Consent contracts
- Coda continuity log
- Retrieval pipeline outputs
- Notification surfaces (highest leak risk)
- Integration connectors (email/calendar/webhooks/etc.)

---

## 2) Adversaries

- External attacker (data theft, prompt injection, supply chain)
- Insider (privileged misuse)
- “Curious developer” (logs everything, ships leaks)
- Vendor compromise (dependency or hosted service)
- Accidental user harm (wrong context exposure)

---

## 3) Attack surfaces

- Prompt injection via tool outputs or external content
- Notification previews / lock screen leakage
- Over-broad consent scopes (“everything, forever”)
- Silent overwrites / deleted audit logs
- Dependency compromise / unpinned versions
- Cross-tenant data bleed

---

## 4) Threats and mitigations

### T1: Consent bypass

**Risk:** storing or surfacing memory without permission  
**Mitigation:** StagePort mandatory gate; deny by default; Coda logging of decisions

### T2: Notification leakage

**Risk:** sensitive info exposed via push/email previews  
**Mitigation:** policy: no sensitive content in notifications; masked mode; safe summaries only

### T3: Prompt injection through integrations

**Risk:** external content coerces the agent to reveal secrets  
**Mitigation:** tool output sanitization; StagePort checks for injection markers; strict allowlists

### T4: Audit log tampering

**Risk:** attacker deletes evidence  
**Mitigation:** append-only log; integrity hashes; separate storage; periodic snapshots

### T5: Supply chain compromise

**Risk:** tiny dependency breaks trust  
**Mitigation:** pinning; integrity verification; dependency budget; vendor review

### T6: Cross-context exposure

**Risk:** memory from private domain leaks into public/work contexts  
**Mitigation:** consent scopes + corridor constraints; StagePort context enforcement

---

## 5) “Fail closed” doctrine

If any policy check is uncertain, StagePort MUST deny:

- write
- read
- nudge
- notify

Uncertainty is treated as risk, not “maybe it’s fine.”
