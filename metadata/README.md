# Codex Metadata Schema

This directory defines the canonical metadata shape for narrative fragments within the DeCrypt the Girl codex. Use `schema.json` to validate poems, scenes, archetypes, constellations, glyphs, or other nodes before adding them to the repository.

## Narrative modes

- **Surface** — Events as they appear: linear, visible, chronological.
- **Cipher** — Encoded truth beneath the scene: symbolic, mythic, architectural.
- **Echo** — Foreshadow, memory, resonance: reflections that shape the future.

## Directory map for narrative data

Use the following relative paths when organizing JSON files for the codex:

| Key            | Path                     |
| -------------- | ------------------------ |
| poems          | `./poems/`               |
| scenes         | `./scenes/`              |
| constellations | `./constellations/`      |
| archetypes     | `./archetypes/`          |
| glyphs         | `./glyphs/`              |
| timeline       | `./timeline/`            |
| schema         | `./metadata/schema.json` |

## Base document template

All fragments should conform to the following structure:

```json
{
  "id": "unique_id_here",
  "title": "Title Here",
  "type": "poem",
  "mode": "Surface",
  "archetype": [],
  "constellation": [],
  "timecode": "",
  "alignment": {
    "zodiac": "",
    "tarot": "",
    "glyph": ""
  },
  "emotional_key": [],
  "themes": [],
  "function": "",
  "text": "",
  "relations": {
    "mirrors": [],
    "unlocks": [],
    "glitches": []
  }
}
```

Validate candidate files against `schema.json` with your preferred JSON Schema tool before committing them.
