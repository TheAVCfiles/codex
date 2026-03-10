# Mapstein Pass 8 — Bridge Scoring Output

Timestamp: 2026-03-08 20:41 ET

## What was executed

The pass consumed a graph centrality payload and produced `pass8_bridge_scores.csv` by:

1. parsing `top_bridges`
2. computing `channel_span` as `len(channels)`
3. computing `bridge_score = centrality + (channel_span * 0.1)`
4. appending `structural_anomalies` with a fixed `bridge_score` of `1.0`
5. exporting a normalized scoring table

## Bridge scoring results

| entity                | bridge_score | meaning                                  |
| --------------------- | -----------: | ---------------------------------------- |
| Jeffrey Epstein       |        1.294 | dominant multi-channel bridge            |
| jeevacation@gmail.com |        1.052 | transport + comms + finance routing node |
| NO TSA REQUIRED       |        1.000 | structural anomaly                       |
| SDNY                  |        0.612 | legal-comms institutional bridge         |
| St. Croix             |        0.489 | transport hub                            |
| Bard College / Bonds  |        0.445 | finance corridor                         |

## Immediate machine-priority targets

1. Epstein bridge cluster
2. jeevacation routing node
3. NO TSA REQUIRED aviation anomaly
4. SDNY legal-comms bridge
5. Bard bond finance corridor

## Next hard run (Pass 9)

Planned overlay inputs:

- timeline events
- bond spread changes
- institutional statements
- media signal

Intended dynamic chain:

`legal_event -> finance_reaction -> institutional_response -> narrative_shift`
