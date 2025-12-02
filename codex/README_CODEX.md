# Decrypt The Girl Codex

This folder holds the narrative codex for **Decrypt The Girl**. Entries are organized as small, linkable files so poem fragments, constellations, and glyphs can be remixed without losing provenance.

## Layout

- `nodes/` — Atomic narrative pieces with YAML frontmatter and a short body.
- `constellations/` — JSON graphs that bundle nodes into playable paths.
- `glyphs/` — Symbol files that track recurring artifacts and their appearances.
- `manifest/` — High-level registries and timelines for the codex.
- `codex_index.json` — Series- and room-level lookup table for navigation tools.

### Node format

Create Markdown files with YAML frontmatter:

```markdown
---
id: surface_27_slipped_stitch
title: The Slipped Stitch
mode: surface
links:
  - cipher_27_camouflage_engine
  - echo_27_encryption
tags:
  - childhood
  - masking
---

Body text goes here.
```

### Constellation format

Constellations are JSON documents with an `id`, `title`, `nodes`, and a `description`. Keep node IDs in traversal order.

### Glyph format

Glyphs are JSON documents that track recurring symbols or meta-objects. Include any cross-references in `echo` or `returns_as` fields when available.

## Current additions

- The **Shadow Vocabulary** triad introduces the moment where silence becomes encryption.
- The **AURORA-17** glyph captures a slip-stitch archetype with tarot, zodiac, and glitch metadata.
- The **C-series** index documents how analysis nodes map into rooms and arcs.
