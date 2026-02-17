# RAW_INGEST quickstart (Airtable)

## 1) Create the intake table

Create a table named `RAW_INGEST` with this exact schema:

1. `Created` → **Created time** (auto)
2. `Source` → **Single select**: `ChatGPT`, `File`, `Call`, `Email`, `Other`
3. `Project` → **Single select**: `StagePort`, `Glissé`, `Labor`, `IP`, `DeCrypt`, `StudioOS`, `Admin`
4. `Raw_Text` → **Long text**
5. `Tags` → **Multi-select**
6. `Converted_To_Evidence` → **Checkbox**

Keep this table minimal and stable before adding any automation.

## 2) Create a mobile intake form

Create a **Form** view from `RAW_INGEST` and show only:

- `Source`
- `Project`
- `Raw_Text`
- `Tags`

Then copy the form URL and add it to your iPhone home screen.

## 3) Smoke test record

Submit this record through the form:

- Source: `ChatGPT`
- Project: `StudioOS`
- Tags: `chatcore, setup`
- Raw_Text: `RAW table live. Airtable intake operational.`

## Optional CLI capture helper

Use `scripts/stageport/push_raw_ingest.py` to create records directly through the Airtable API.

```bash
export AIRTABLE_TOKEN="..."
export AIRTABLE_BASE_ID="..."
python scripts/stageport/push_raw_ingest.py
```

The script maps fields using the canonical `RAW_INGEST` names (`Source`, `Project`, `Raw_Text`, `Tags`).

## Weekly Sunday rinse report

Use `scripts/stageport/sunday_rinse.py` to generate a weekly `GOSSIP_RAG_YYYYMMDD.md`
with hash/semantic conflict checks.

### Option A: from Airtable pending records

```bash
export AIRTABLE_PAT="..."
export AIRTABLE_BASE_ID="appS16p6gJO5U78JS"
export AIRTABLE_TABLE="Table 1"
export AIRTABLE_PENDING_VALUE="Todo"
export AIRTABLE_PROCESSED_VALUE="Done"
python scripts/stageport/sunday_rinse.py --output-dir output --mark-processed
```

### Option B: from local JSON records

```bash
python scripts/stageport/sunday_rinse.py --weekly-json weekly_records.json --vault-csv artifact_index.csv
```

Expected input fields can include canonical names (`title`, `proves`, `sha256`) or
Airtable-friendly names (`Title`, `Raw_Text`, `Raw Content`, `MemJar`, `SHA-256 Seal`).

For Airtable fetch mode, the script reads `AIRTABLE_PAT` (or `AIRTABLE_TOKEN` / `AIRTABLE_KEY`) and
parses Airtable-shaped records from `records[].fields`.
For schemas where `MemJar` is a single-select category, raw text is taken from
`Name` / `Raw_Text` / `Raw Content` first, then `MemJar` as a fallback.
Use `AIRTABLE_MAX_RECORDS` (default `200`) to control pagination limits.
