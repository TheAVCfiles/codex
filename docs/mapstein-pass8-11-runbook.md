# Mapstein Pass 8–11 Runbook

This runbook captures the staged workflow demonstrated in the latest analysis notes.

## Pass 8: Bridge Scoring

- Parse graph centrality JSON (`top_bridges`, `structural_anomalies`).
- Compute `channel_span = len(channels)`.
- Compute `bridge_score = centrality + (channel_span * 0.1)`.
- Append anomaly nodes with fixed bridge score (`1.0`) and `note` field.
- Export CSV: `pass8_bridge_scores.csv`.

## Pass 9: Full Corpus Topology (High Recall)

- Iterate EFTA PDFs and extract text.
- Detect entities (emails, proper-name spans, years).
- Detect observable verbs with regex pattern map:
  - `EMAILS`, `TRAVELS_TO`, `PILOTS`, `PAYS`, `FILES`, `PUBLISHES`, `MANAGES_PROPERTY`, `SUPERVISES`.
- Generate triples (`subject`, `verb`, `object`, `doc`).
- Build `MultiDiGraph`, export `graph_pass9.gexf`.
- Export `relationships_pass9.csv`, `centrality_pass9.json`, `doc_stats_pass9.csv`.

## Pass 10: Precision Compression

- Input: `relationships_pass9.csv`.
- Alias collapse (trim, normalize whitespace, remove commas, title case).
- Keep only core observable verbs.
- Remove self loops.
- Rebuild graph and compute:
  - Betweenness centrality (bridge scoring)
  - Degree centrality
- Export:
  - `relationships_pass10_filtered.csv`
  - `graph_pass10_clean.gexf`
  - `bridge_scores_pass10.csv`
  - `pass10_summary.json`
  - `pass10_precision_outputs.zip`

## Pass 11: Constraint / Legislative Overlay

- Build corridor-to-regime mapping dataset with fields:
  - `corridor`, `regime`, `jurisdiction`, `regulatory_density`, `why_it_matters`, `source_note`
- Export:
  - `legislation_overlay.csv`
  - `legislation_overlay.json`
  - `pass11_legislation_summary.json`
  - `pass11_legislation_overlay.zip`

## Recommended Pass 12 Direction

- Corridor overlap mapping from anchor node (`Jeffrey Epstein`) to selected targets.
- Compute all shortest paths and edge traversal frequency.
- Export ranked arterial edges for overlap analysis.

## Operational Principle

Prioritize **observable action verbs** and suppress interpretive/soft links (for example: `DISCUSSES`, `LIKELY_LINKED_TO`) until stronger deterministic support exists.
