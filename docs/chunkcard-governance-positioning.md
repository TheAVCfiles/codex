# ChunkCard Governance Positioning Note

## Core assessment

The current ChunkCard shape already behaves like a governed semantic packaging unit, not an ad-hoc note format. The strongest evidence is the stable, machine-shaped field set:

- `chunk_id`
- `source`
- `raw_text`
- `normalized_template`
- `surface`
- `tags`
- `dependencies`
- `revenue_levers`
- `risk_controls`
- `status`

Together, these fields define identity, provenance, normalization, deployment surfaces, policy controls, and lifecycle state in one schema.

## Architectural interpretation

ChunkCard can be positioned internally as a private operating cell for:

- semantic chunking
- provenance preservation
- governance tagging
- retrieval normalization
- deployment templating
- modular white-label packaging

This aligns with broader governed retrieval and ontology-driven infrastructure patterns.

## Public/private split recommendation

Publish the public map and boundaries; keep transformation internals private until stronger IP perimeter hardening is complete.

### Public now

- canonical ontology routes and glossary
- machine-readable metadata surfaces (e.g., JSON-LD)
- crawler orientation index (`llms.txt`)
- machine-use and rights boundaries (`ai-rights.txt`)

### Keep private for now

- ingestion prompts and orchestration
- normalization/scoring logic
- retrieval and ranking internals
- transformation layers and training structures

## Product framing

Prioritize positioning around embodied IP infrastructure and movement provenance rather than crypto-first messaging.

### Strong wedge

"Proof of authorship for movement-based curriculum and choreography."

### Longer-term category

Embodied provenance infrastructure: authorship, lineage, licensing, and transformation traceability for movement systems.

## Immediate consolidation checklist

1. Rename externally ambiguous artifacts to protocol-grade naming.
2. Rewrite top-level README around authorship/provenance/licensing workflows.
3. Add architecture diagram that separates public doctrine vs private orchestration.
4. Add one end-to-end demo flow: claim -> split -> license -> audit trail.
5. Split mythic narrative docs from technical implementation docs.
