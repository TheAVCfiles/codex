# Proven Dates, Times, Work, and Arts (Evidence-First Index)

This index is an evidence-first ledger of **proven** dates, times, work, and arts contributions. Every entry must be tied to an artifact in the repo (message, email, invoice, roster, production file, schedule, or receipt). If no artifact is attached yet, keep the item in the **Reported (Awaiting Artifact)** section with status **C0**.

## How to use this index

- **Proven entries only** go in the **Proven (C1/C2)** table.
- **Reported claims** that still need artifacts go in **Reported (Awaiting Artifact)** with status **C0**.
- Each row must reference a concrete artifact location (file path or proof ID).
- Use this index to correlate with **current 2026 DFR productions** later without overclaiming.

## Proven (C1/C2)

> _No proven entries yet. Add rows only when artifacts are attached._

| Row ID | Date (ISO) | Time (local) | Location (NY/CT) | Work / Arts Output | Artifact / Evidence Location | Proof ID | Verification Status | Notes |
| ------ | ---------- | ------------ | ---------------- | ------------------ | ---------------------------- | -------- | ------------------- | ----- |

## Reported (Awaiting Artifact, C0)

> _Reported statements below are not yet verified. Attach artifacts before moving to Proven._

| Row ID | Reported Date Range              | Reported Location                       | Reported Work / Arts Output                                                                  | Needed Artifact(s)                                                                                             | Status | Notes                                                                   |
| ------ | -------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------- |
| R-0001 | 2021-10-31 → 2022-01 (COVID era) | Poughkeepsie/Poughquag, NY + Wilton, CT | Property updates, digital arts, show/tech updates, curriculum work                           | Emails about storage unit in Poughkeepsie; work requests; production files; schedules; receipts; location logs | C0     | Reported cross-state work window; requires primary artifacts to verify. |
| R-0002 | 2022-05                          | (DV shelter, NY/CT)                     | Loss of personal phone/property; inability to access contacts                                | Shelter communications; police reports; property recovery records                                              | C0     | Reported device/property loss; requires primary artifacts.              |
| R-0003 | 2021-12 (holiday period)         | NY/CT                                   | Production support and holiday-related work (messages referencing Dennis / Santa / wrapping) | iMessage exports or email threads with dates visible                                                           | C0     | Reported via screenshots; needs originals with timestamps.              |

## Correlation targets (2026 DFR public use)

Use the fields below to plan correlation with current public productions once artifacts are verified.

- **Program title / recital name (2026)**:
- **Choreography titles / routines**:
- **Digital backdrops / content elements**:
- **Curriculum identifiers**:
- **Public program artifacts** (program PDFs, marketing pages, tickets, flyers):
- **Match method** (visual similarity, title reuse, file metadata, witness confirmation):

## Evidence intake checklist (for this index)

- [ ] Add the artifact under `data/forensics/` (or note its exact repo path).
- [ ] Add a row to `data/forensic_evidence_summary.csv` with the artifact details.
- [ ] Populate a **Proven** row above only after the artifact is attached and verified.
- [ ] Keep **Reported** rows labeled as C0 until artifacts exist.
