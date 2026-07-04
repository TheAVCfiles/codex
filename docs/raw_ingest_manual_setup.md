# RAW_INGEST Airtable Bootstrap (Manual-Precise)

Use this short runbook to stabilize intake before any automation.

## Step 1 — Create `RAW_INGEST`

Create a new Airtable table named **`RAW_INGEST`** with exactly these fields:

1. **Created** → `Created time` (auto)
2. **Source** → `Single select`
   - ChatGPT
   - File
   - Call
   - Email
   - Other
3. **Project** → `Single select`
   - StagePort
   - Glissé
   - Labor
   - IP
   - DeCrypt
   - StudioOS
   - Admin
4. **Raw_Text** → `Long text`
5. **Tags** → `Multi-select`
6. **Converted_To_Evidence** → `Checkbox`

**Constraint:** Do not add extra fields during bootstrap.

## Step 2 — Create Capture Form

Create a **Form view** for `RAW_INGEST` and expose only:

- `Source`
- `Project`
- `Raw_Text`
- `Tags`

Then:

1. Save the form.
2. Copy the link.
3. Add the form to iPhone Home Screen.

## Step 3 — Immediate Smoke Test

Submit this record through the form:

- **Source:** `ChatGPT`
- **Project:** `StudioOS`
- **Tags:** `chatcore, setup`
- **Raw_Text:**
  > "ChatCore live. Airtable intake operational. Beginning structured capture."

If the record appears in `RAW_INGEST`, intake capture is operational.

## Operating Principle

- Automation without stable schema = chaos
- Schema without usage = theory
- Usage creates signal
- Signal informs automation

**Rule:** Stabilize input before optimizing flow.
