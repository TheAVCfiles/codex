# Entity Relationship Ledger v1

This ledger converts the currently confirmed signals into a machine-sortable table for downstream graph analysis.

## Columns

- `entity_id`: Stable identifier for each node.
- `entity`: Canonical node label.
- `type`: Node class (`PERSON`, `EMAIL`, `ORGANIZATION`, `AIRCRAFT`, etc.).
- `corridors`: Pipe-delimited corridor tags for cluster slicing.
- `relationship`: Predicate describing the edge/action.
- `target`: Connected node or event.
- `target_type`: Type of connected node.
- `doc_ref`: Source document reference.
- `evidence_status`: `VERIFIED` for currently confirmed rows.
- `notes`: Short forensic context.

## Included baseline signals

- Top bridge node for the current graph state.
- Cross-channel email pivot across diplomacy, transport, and finance.
- Aviation entity ownership/billing signal.
- Legal, transport, and finance corridor anchor nodes.

Use `analysis/entity_relationship_ledger_v1.csv` as the canonical import for Excel/Sheets/SQL.
