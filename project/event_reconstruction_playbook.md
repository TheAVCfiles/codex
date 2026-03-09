# Event Reconstruction Playbook

This playbook captures a detector-style method for turning scattered records into structured, testable event hypotheses.

## 1) Build an Event Grid

For each record, map four axes:

- **Time** (timestamp, date range, sequence position)
- **Location** (place, route, jurisdiction)
- **People** (senders, recipients, witnesses, operators)
- **Resources** (money, travel, logistics, supporting artifacts)

Each row should represent one observable record, not an interpretation.

## 2) Cluster Signals into Candidate Events

Group records that co-occur across the grid:

- planned meeting clusters
- travel clusters
- transfer/payment clusters
- witness-observation clusters

A cluster strengthens when independent sources point to the same event.

## 3) Reconstruct Tracks (Before → During → After)

For each candidate event, build an ordered chain:

`message -> booking -> movement -> meeting -> transfer -> follow-up`

Treat each arrow as a hypothesis with confidence based on evidence density.

## 4) Compare Against Repeating Patterns

Check whether reconstructed tracks align with known recurrent structures, such as:

- recruitment loops
- travel cycles
- social introduction chains
- support/payment structures

Repeated pattern matches increase confidence that the structure is systemic rather than random.

## 5) Validate with Independent Layers

Prefer event chains confirmed by multiple evidence lanes:

- communications
- financial records
- travel/metadata
- witness accounts

Three independent lanes converging is a high-confidence signal.

## 6) Map the Interaction Network

Represent evidence as a graph:

- **Nodes:** people, entities, locations
- **Edges:** communication, movement, transfers, shared events
- **Weights:** frequency, intensity, reliability

Use centrality and clustering to find hubs, brokers, and sub-networks.

## 7) Identify Anomalies

Actively search for signals that do not match known patterns:

- unexplained travel
- uncontextualized payments
- repeated unexpected contacts

Anomalies often define the highest-value investigative questions.

## 8) Keep Narrative Separate from Ledger Data

Use distinct evidence lanes:

- **Documented records** (high verification)
- **Testimony/narrative** (preserved, pending corroboration)

Do not overwrite structured records with narrative assertions.

## 9) Operational Spreadsheet Schema

Recommended sheet tabs:

1. **Timeline_Master**
   - `event_id | year | date | location | event_type | description | source_layer | verification_status | notes`
2. **Corridor_Map**
   - `origin_node | transit_node | destination_node | type | evidence | status`
3. **Node_Register**
   - `node_id | node_type | name | location | first_appearance | source | notes`
4. **Edge_Register**
   - `edge_id | from_node | relationship | to_node | year | evidence | status`

## 10) Confidence Scoring

Assign edge/event confidence from evidence support:

- **Weak:** single uncorroborated mention
- **Medium:** repeated mentions in one lane
- **Strong:** confirmation across two lanes
- **Very Strong:** independent confirmation across three or more lanes

---

### Practical Rule

Truth in complex datasets often appears **statistically first** (co-occurrence and repeatability), then **narratively** (a coherent story).
