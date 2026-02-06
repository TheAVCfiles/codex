# ZIPLOQ Run Output v0.1 (Evidence Spine + Narrative)

## What got run

This output records a first-pass ingestion of a ZIPLOQ evidence spine workbook, evidence summary export, and memo drafts. The run:

- Builds a **Master Evidence Index (MEI)** from currently attached artifacts.
- Writes a **narrative v0.1** anchored only to currently verified `C1` entries.
- Flags **discrepancy risks** so draft claims stay evidentiary, not inferential.
- Defines a **next-ingestion queue** required to complete money-flow mapping.

---

## 1) Master Evidence Index (current inventory)

> Verification status in this run:
>
> - `C1` = artifact captured and anchored.
> - `C0` = placeholder only (not yet attached in this export).

| ID      | V   | Date       | Time     | Source                             | Type                           | Summary                                                                               | Entities                                                  | Tags                                        | Local path                                                                                                  |
| ------- | --- | ---------- | -------- | ---------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| P1      | C1  | 2021-06-29 | 12:26 PM | iMessage                           | screenshot (timestamp visible) | Message indicating completion of facility/asset maintenance (`"watered everything"`). | Kristin Leggio Sedita                                     | asset_maintenance, on_site_labor            | `data/forensics/messages/msg_2021-06-29_1226_Maybe-Kristin-Leggio-Sedita_just-watered-everything.jpg`       |
| P2      | C1  | 2021-07-22 | 2:20 PM  | iMessage                           | screenshot (timestamp visible) | Message assigning a student to attend/observe class and describing skill level.       | Kristin Leggio Sedita                                     | instructional_directive, student_assignment | `data/forensics/messages/msg_2021-07-22_1420_Maybe-Kristin-Leggio-Sedita_little-girl-watch_attachments.jpg` |
| P3      | C0  | 2021-07-22 | 5:12 PM  | iMessage                           | screenshot (timestamp visible) | Not captured in current export.                                                       | Kristin Leggio Sedita                                     | —                                           | `data/forensics/messages/<ADD_FILE_FOR_2021-07-22_1712>.jpg`                                                |
| P4      | C0  | 2022-02-10 | 9:05 PM  | iMessage (group)                   | screenshot (timestamp visible) | Group message proposing/confirming duet planning with named participants.             | Christina Dance; Mika Danter                              | choreography_planning, curriculum           | `data/forensics/messages/<ADD_FILE_FOR_2022-02-10_2105>.jpg`                                                |
| P5      | C0  | 2022-02-11 | 11:24 AM | iMessage (group)                   | screenshot (timestamp visible) | Not captured in current export.                                                       | Christina Dance; Mika Danter                              | —                                           | `data/forensics/messages/<ADD_FILE_FOR_2022-02-11_1124>.jpg`                                                |
| PROC1   | C1  | —          | —        | GitHub PR / repo diff (screenshot) | screenshot (repo diff)         | Screenshot of process documentation describing evidence intake/checklist.             | —                                                         | process_method, evidence_intake             | `data/forensics/process/docs_proven-dates-times-work-arts_md_diff_intake-checklist.jpg`                     |
| DOC-001 | C0  | —          | —        | User memo                          | PDF                            | Narrative memo titled `Forensic Analysis of Systematic Asset Stripping and Labor...`  | Savatara; Dance Factory Ridgefield; Kristin Leggio Sedita | memo, analysis                              | `Savatara Scam.pdf`                                                                                         |
| DOC-002 | C0  | —          | —        | User memo                          | PDF                            | User-authored document containing structured forensic framework and filing strategy.  | —                                                         | memo, process                               | `PDF document 8.pdf`                                                                                        |
| DOC-003 | C0  | —          | —        | User notes                         | TXT                            | Text notes labeled `SavataraSCAM`.                                                    | Savatara                                                  | notes                                       | `SavataraSCAM.txt`                                                                                          |
| DOC-004 | C0  | —          | —        | User notes                         | TXT                            | Text notes labeled `Savaterror`.                                                      | Savatara                                                  | notes                                       | `Savaterror.txt`                                                                                            |
| DOC-005 | C0  | —          | —        | User notes                         | TXT                            | Text notes file `text 215`.                                                           | —                                                         | notes                                       | `text 215.txt`                                                                                              |
| KIT-001 | C0  | —          | —        | ZIPLOQ Evidence Kit v1             | Markdown                       | Process addendum for adding evidence index entries and populating labor logs.         | —                                                         | process, template                           | `ZIPLOQ_Evidence_Kit_v1_extracted/ZIPLOQ_Evidence_Kit_v1/EVIDENCE_INDEX_ADDENDUM_PROCESS.md`                |
| KIT-002 | C0  | —          | —        | ZIPLOQ Evidence Kit v1             | CSV template                   | Template CSV for logging unseen labor items (empty).                                  | —                                                         | template, unseen_labor                      | `ZIPLOQ_Evidence_Kit_v1_extracted/ZIPLOQ_Evidence_Kit_v1/unseen_labor.csv`                                  |
| KIT-003 | C0  | —          | —        | ZIPLOQ Evidence Kit v1             | CSV template                   | Template CSV for logging unpaid support labor (empty).                                | —                                                         | template, unpaid_labor                      | `ZIPLOQ_Evidence_Kit_v1_extracted/ZIPLOQ_Evidence_Kit_v1/unpaid_support_labor.csv`                          |
| KIT-004 | C0  | —          | —        | ZIPLOQ Evidence Kit v1             | CSV template                   | Template CSV for licensing claims / IP assertions (empty).                            | —                                                         | template, ip_ownership                      | `ZIPLOQ_Evidence_Kit_v1_extracted/ZIPLOQ_Evidence_Kit_v1/licensing_claims.csv`                              |
| KIT-005 | C0  | —          | —        | ZIPLOQ Evidence Kit v1             | Markdown                       | README for ZIPLOQ Evidence Kit v1 (instructions + next steps).                        | —                                                         | process                                     | `ZIPLOQ_Evidence_Kit_v1_extracted/ZIPLOQ_Evidence_Kit_v1/README.md`                                         |
| KIT-006 | C0  | —          | —        | ZIPLOQ Evidence Kit v1             | JSON                           | Manifest describing kit name, creation timestamp, and file list.                      | —                                                         | process, manifest                           | `ZIPLOQ_Evidence_Kit_v1_extracted/ZIPLOQ_Evidence_Kit_v1/manifest.json`                                     |
| SYS-001 | C0  | —          | —        | GitHub Actions logs                | ZIP                            | CI/log archive: `logs_56440185825.zip` containing CLA job logs.                       | —                                                         | system_log                                  | `logs_56440185825.zip`                                                                                      |

---

## 2) Chronology (what can be dated now)

- **2021-06-29 12:26 PM** (`P1`, `C1`): `"Just watered everything"` (on-site labor / facility-maintenance anchor).
- **2021-07-22 2:20 PM** (`P2`, `C1`): student-assignment directive with attachments (instructional operations anchor).
- **2021-07-22 5:12 PM** (`P3`, `C0`): placeholder only; screenshot still needed.
- **2022-02-10 9:05 PM** (`P4`, `C0`): duet-planning message; screenshot still needed.
- **2022-02-11 11:24 AM** (`P5`, `C0`): placeholder only; screenshot still needed.

---

## 3) Narrative v0.1 (evidence-anchored)

### Chapter 1 — The House That Needed “Help”

On June 29, 2021 at 12:26 PM, a message in the thread labeled `"Maybe: Kristin Leggio Sedita"` reads: `"Just watered everything."` In this packet, that message is treated as an on-site labor and time anchor, showing task reporting within an active operations loop rather than isolated volunteering.

**Evidence anchor:** `P1` (`C1`).

### Chapter 2 — The Studio Runs on Directives

On July 22, 2021 at 2:20 PM, the same thread includes an instructional directive that a child would come `"watch today"`, with media attachments listed. This is logged as operational control evidence: student assignment, class logistics, and instruction documentation.

**Evidence anchor:** `P2` (`C1`).

### Chapter 3 — The Creative Workstream

On February 10, 2022 at 9:05 PM, a group iMessage indicates `"mika is on board"` and proposes duet action. This is logged as choreography planning evidence, pending full capture.

**Evidence anchor:** `P4` (`C0`, placeholder only).

### Scope note

The larger financial and statutory claims currently appearing in memo drafts remain **allegation-level** until corresponding bank, brokerage, tax, and payment artifacts are attached and indexed to concrete IDs.

---

## 4) Discrepancy & risk flags

1. **Hard-number claims without artifacts**
   - Monetary figures should either point to attached artifacts or be explicitly marked `to be verified`.
2. **Statute references**
   - Use conditional phrasing (`potentially implicated`, `counsel to confirm applicability`) until a formal elements table is complete.
3. **OVS language precision**
   - Avoid promising compensation categories or caps without explicit source alignment and jurisdiction checks.
4. **Residency-fraud proof hierarchy**
   - Treat geolocation as supporting context; prioritize filings, payroll records, tax forms, and official address records.

---

## 5) Ingestion requirements (to convert narrative into accounting)

### A) Money spine

- Brokerage statements + trade confirms + `1099-B` artifacts.
- Bank ledgers (`CSV` + monthly PDF statements).
- Zelle/Venmo/Cash App exports or equivalent timestamped records.
- Tax artifacts (`1099-NEC`, notices, related correspondence).

### B) Receipts spine

- Home-improvement receipts and contractor invoices.
- Household subsidy receipts.
- Event/luxury spend records tied to timeline.
- Hardware and production-equipment receipts.

---

## 6) Suggested mailbox sweep (collection protocol)

Run four date-bounded email searches (2019–2022):

1. **Payments**
   - `("zelle" OR "venmo" OR "cash app" OR "cashapp" OR "chime" OR "hvfcu" OR "hvcfcu") (kristin OR dennis OR savatara OR ridgefield)`
2. **Taxes / 1099**
   - `("1099" OR "1099-nec" OR "w-9" OR "ein" OR "taxes" OR "irs") (savatara OR ridgefield OR kristin)`
3. **Receipts / merchants**
   - `("home depot" OR "lowe" OR "michaels" OR "hobby lobby" OR "stew leonard" OR "yankee" OR "fabfitfun")`
4. **Roles + wage terms**
   - `("COO" OR "pay back" OR "late pay" OR "$50/hr" OR "$75/hr" OR "$40/hr" OR "check") (kristin OR savatara OR ridgefield)`

Minimum-capture format: export message header + body + visible date/time, then filename using date-first convention.
