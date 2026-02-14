# AVC Economic Damages Pack Generator

This script generates the requested AVC economic damages document pack:

- Populates the `Timeline_Spine` sheet in the provided workbook.
- Generates three PDFs (damages exhibit, causation map, stress test).
- Bundles everything into a single zip archive.

## Dependencies

- `openpyxl`
- `reportlab`

## Usage

```bash
python scripts/create_avc_economic_damages_pack.py \
  --spine-path /path/to/AVC_Archival_Intelligence_Spine.xlsx \
  --output-dir dist/AVC_Economic_Damages_Pack_NYC_v1
```

## Outputs

The output directory will contain:

- `<base-name>_Spine.xlsx`
- `<base-name>_Damages_Exhibit.pdf`
- `<base-name>_Causation_Map.pdf`
- `<base-name>_Stress_Test.pdf`
- `<base-name>.zip`

Use `--base-name` to override the file prefix and archive name.
