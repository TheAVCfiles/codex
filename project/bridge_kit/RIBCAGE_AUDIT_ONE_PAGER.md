# StagePort Ribcage Audit (One-Pager)

## Purpose

This audit reports whether the studio environment sustains safe, consistent, and physically equitable access for all users by measuring geometry and throughput conditions (not identity categories).

## Scope

- Site: `[Studio Name / Building / Floor]`
- Audit window: `[Start]` to `[End]`
- Standard baseline: `>= 1,500 sq ft / sovereign user` (local policy configurable)

## Core Metrics

1. **Density Ratio**

   - Formula: `usable_sq_ft / concurrent_users`
   - Alert threshold: `< 1,500 sq ft / user`

2. **Isotropic Access Index**

   - Measures route parity to critical resources from all practical entry vectors.
   - Pass threshold: `>= 0.90`

3. **Friction Coefficient by Zone**

   - Operational drag score from path width, turning radius, obstacle frequency, and queue pressure.
   - Goal: maintain near-zero friction for high-priority pathways.

4. **Critical Lane Integrity**
   - Wheelchair turning zones unobstructed
   - Pin-up/crit zones visible from seated and standing horizons

## Findings Snapshot

- Density ratio: `[value]`
- Isotropic index: `[value]`
- Zones flagged: `[count]`
- Immediate mitigation required: `[yes/no]`

## Risk Posture

- **Low**: all thresholds passed; monitor weekly
- **Moderate**: one threshold breached; corrective action in 14 days
- **High**: two or more breaches; immediate remediation and follow-up audit

## Corrective Actions

1. `[Action / Owner / Due date]`
2. `[Action / Owner / Due date]`
3. `[Action / Owner / Due date]`

## Evidence Bundle

- `studio_isometric_map.pdf`
- `facility_density_log.csv`
- `SPC_PC8_Equity_Proof.json`
- `00_MANIFEST.txt` (SHA-256 seal)

## Sign-off

- Auditor: `[Name / role]`
- Timestamp: `[ISO-8601]`
- Signature hash: `[sha256]`
