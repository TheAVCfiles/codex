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
