# Oversight Matrix — Children’s Home of Poughkeepsie (NY)

_As-of framing timestamp: March 6, 2026, 2:15 PM ET._

## Objective

Connect licensing, funding, and operations across state and federal oversight lanes using a defensible, exportable structure.

## Priority records to connect licensing with funding and operations

1. OCFS facility license records.
2. OMH program certification records.
3. NYSED waiver renewal history.
4. Staff license roster.
5. Program descriptions tied to federal grants.
6. Clinical service logs.
7. Staffing levels by program (timestamped to March 6, 2026, 2:15 PM ET).

## Oversight matrix schema

Use this schema in a workbook tab named `Oversight_Matrix`:

| Agency / body                                     | Jurisdiction lane                              | What it oversees                                                                     | Records likely held                                                               | Flags it can answer                                    |
| ------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------ |
| NYSED Office of the Professions                   | State professional-practice authorization      | Professional service setting waivers and approved licensed disciplines               | Waiver approvals, waiver renewals/successors, discipline authorization lists      | `PROGRAM_SCOPE`, `TIMELINE_GAP`                        |
| NYS Office of Children and Family Services (OCFS) | State child welfare and residential operations | Residential/foster-related licensing, capacity, inspections, operating compliance    | Facility licenses, capacity approvals, inspections, incidents, corrective actions | `BENEFICIARY_COUNT`, `PROGRAM_SCOPE`, `CONTROL`        |
| NYS Office of Mental Health (OMH)                 | State mental-health authorization              | Mental-health program approvals and service scope (including CFTSS where applicable) | Program certifications, clinic/service approvals, scope authorizations            | `CLAIM_SUPPORT`, `REPORTING_MISMATCH`, `PROGRAM_SCOPE` |
| NYS Department of Health (DOH)                    | State health-service authorization             | Health-related licensing/certification within DOH jurisdiction                       | License/certification records by location and period, program approvals           | `VERIFY`, `PROGRAM_SCOPE`                              |
| HHS / ACF                                         | Federal funding and program oversight          | Grant awards, amendments, compliance monitoring, reporting expectations              | Notices of award, amendments, drawdown history, monitoring letters/reports        | `FUND_FLOW`, `NEG_ADJUSTMENT`, `CLAIM_SUPPORT`         |

## Immediate investigative flags from current source set

- `TIMELINE_GAP`: Public NYSED entry shown in source notes indicates a waiver period ending 2019-11-30; continuity requires post-2019 records.
- `PROGRAM_SCOPE`: State-authorized clinical/service scope should align with federally funded program categories.
- `CLAIM_SUPPORT`: Clinical logs, staff credentials, and staffing levels should reconcile with funded claims and reported services.
- `BENEFICIARY_COUNT`: Licensed capacity and staffing levels should reconcile to census/service volume.

## Minimal export pack

1. `Investigation_Master.xlsx` with tabs: `Entities`, `Events`, `Awards`, `Oversight_Matrix`, `Flags`.
2. `Evidence/` binder using stable IDs (example: `EV-LIC-001`, `EV-FIN-002`, `EV-PROG-003`).
3. `Flag_Log.csv` as the operational queue for follow-up requests.

## Recommended first request queue

1. NYSED waiver renewal/successor records after 2019-11-30.
2. OCFS facility licenses, capacity approvals, and inspection history.
3. OMH approval history (including CFTSS and clinic/service certifications, if any).
4. DOH licensing/certification records with service line, location, and effective periods.
5. Full ACF award files and amendment chains for identified awards.
6. Staff license roster by discipline and active date range.
7. Clinical service logs and staffing levels by program as of 2026-03-06 14:15 ET.

## Analytic integrity rule

Maintain strict separation between:

- raw evidence,
- structured records, and
- analytical flags.

That separation preserves defensibility and reduces interpretation drift.
