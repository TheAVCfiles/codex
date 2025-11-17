# Data directory

This folder stores DecryptTheGirl (DTG) working datasets used by the project tooling.

- `dtg_constellations.json` — narrative graph entries (surface, cipher, echo) and constellation summaries. Entries use stable `id`, `title`, `mode`, `content`, `links`, and `tags` fields to make it easy to ingest into vector stores or dashboards.
- `AVC_IP_MasterLedger_v1.csv` — placeholder master ledger for IP proof events.
- `DecryptTheGirl_Analytics.csv` — normalized analytics batch export headers.
- `DecryptTheGirl_Deploys.csv` — deployment event export headers.
- `proof_ledger.json` — sample proof ledger entries for local testing.

When adding new DTG narrative nodes, keep the `links` arrays synchronized across related entries and record any roll-up constellation in the same file for traceability.
