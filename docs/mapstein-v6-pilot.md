# Mapstein v6 Pilot (Controlled Experiment)

This pilot keeps scope intentionally narrow:

1. `dataset page -> intake ledger`
2. `entities -> co-occurrence edges`
3. `edges -> bridge candidates`

## Commands

```bash
python scripts/mapstein/mapstein_v6.py harvest \
  --dataset DS07 \
  --source /path/to/dataset_page.html \
  --output output/mapstein/intake_log.csv
```

```bash
python scripts/mapstein/mapstein_v6.py bridge \
  --entities-csv /path/to/entities.csv \
  --output output/mapstein/bridge_report.json
```

```bash
python scripts/mapstein/mapstein_v6.py distort \
  --relationships-csv /path/to/relationships.csv \
  --output-dir output/mapstein/pass11
```

## Required CSV schema for bridge scoring

`entities.csv` must contain:

- `doc_id`
- `entity`

Each row means “entity appears in document.”

### `relationships.csv` schema for distortion scoring

Required columns:

- `subject`
- `verb`
- `object`

Optional columns used for timeline extraction:

- `date`
- `event_date`
- `doc` (year parsed from filename/text when present)

## Output guarantees

`intake_log.csv` includes deterministic control fields:

- dataset
- doc_id
- filename
- source_url
- source_hash
- ingest_date
- parse_status
- page_count
- notes

`bridge_report.json` includes:

- summary counts
- weighted co-occurrence edges
- ranked bridge candidates by a deterministic bridge score

`distort` outputs:

- `bridge_distortion_scores.csv`
- `corridor_layer_graph.gexf`
- `timeline_contagion_overlay.json`
