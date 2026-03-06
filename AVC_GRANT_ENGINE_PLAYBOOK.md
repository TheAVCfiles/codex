# AVC Grant Engine Playbook

A practical, reusable packet system for high-volume grant submissions.

## 1) Master folder

Create this directory structure:

```text
AVC_GRANT_ENGINE/
├── core_assets/
│   ├── master_project_overview.pdf
│   ├── bio_allison_van_cura.pdf
│   ├── systems_architecture_diagram.png
│   └── project_timeline.pdf
├── dtg_module/
│   ├── decrypt_overview.pdf
│   ├── screenshots/
│   └── interactive_demo.html
├── mythos_module/
│   ├── mythos_framework.pdf
│   └── narrative_engine_diagram.png
├── betta_module/
│   ├── research_summary.pdf
│   ├── preregistration.pdf
│   └── experimental_design.png
└── export_packets/
```

## 2) Core docs used across most applications

- **Project overview (2 pages)**
  - what the system is
  - why it matters
  - what next phase builds
- **Bio**
  - founder + studio framing
- **Architecture diagram**
  - one-page ecosystem map
- **Timeline**
  - year-by-year milestones and next deployment phase

## 3) Modular exports (per opportunity)

Use the same source materials to generate project-specific ZIP packets.

### Example: DeCrypt packet

```text
DecryptTheGirl_GrantPacket.zip
├── overview.pdf
├── bio.pdf
├── architecture_map.png
├── screenshots/
└── interactive_demo.html
```

### Example: Betta packet

```text
Betta_Enrichment_Lab_GrantPacket.zip
├── research_summary.pdf
├── preregistration.pdf
├── experimental_design.png
└── bio.pdf
```

## 4) 10-15 minute submission workflow

1. Select the target opportunity.
2. Copy only relevant module(s) + core docs into `export_packets/<grant_name>/`.
3. Validate filenames and page limits.
4. Zip and upload.
5. Log submission date, portal URL, and response ETA.

## 5) Funding matrix (avoid overlap)

Track each award by scope so there is no double-billing.

| Grant/Funder | Scope funded      | Dates | Notes              |
| ------------ | ----------------- | ----- | ------------------ |
| A            | Platform build    | Q1-Q2 | engineering only   |
| B            | Research protocol | Q2-Q3 | studies + analysis |
| C            | Public exhibition | Q3-Q4 | launch + audience  |

Rule: multiple grants are normal; overlapping payment for the **same exact expense** is not.

## 6) Strategic framing for reviewers

Use one system, multiple doorways:

- **Arts framing:** interactive literary operating system
- **Media-tech framing:** narrative infrastructure platform
- **Safety/governance framing:** authorship and identity protection system

## 7) Weekly operating cadence

- Monday: identify 3-5 new opportunities
- Tuesday: export packet variants
- Wednesday: submit 1-3 applications
- Thursday: update funding matrix + evidence folder
- Friday: follow-ups and pipeline review

## 8) Founder evidence folder (authorship + provenance)

Maintain a parallel archive:

```text
AVC_Founder_Record/
├── ORIGIN/
├── ARCHITECTURE/
├── PROTOTYPES/
├── PUBLICATIONS/
└── LEGAL_DEFENSE/
```

Add a top-level `README` stating the archive exists to establish authorship, chronology, and system lineage prior to collaboration or commercialization.

## 9) Universal one-sentence lab description

> Intuition Labs develops narrative infrastructure that allows people to encode, protect, and publish lived experience as structured digital systems.

Keep this line consistent across grants, residencies, and consulting materials.

## 10) Minimal submission checklist

- [ ] Overview tailored to funder language
- [ ] Work samples match proposal claims
- [ ] Timeline includes concrete phases
- [ ] Budget aligns with stated scope
- [ ] Packet naming and formats validated
- [ ] Funding matrix updated
- [ ] Evidence folder updated with dated export copy
