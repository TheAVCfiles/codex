# Public / Private Split

## Public-safe artifacts (GitHub Pages)

Safe to publish:

- `site/index.html`
- `site/demos/*.html` rendered summaries
- `site/rooms/*.html` buyer-facing deal room pages
- `site/witness/index.html` Witness Window Lite static preview
- Static CSS assets

## Internal-only logic (do not expose raw internals)

Keep internal:

- Scoring mechanics and thresholds (`scripts/musings_score.py`)
- Translation, authority, or governance internals
- Any prompt-derived method definitions
- Raw unredacted dumps and sensitive mappings

## Leakage prevention

- Redact dangerous terms at build time in `scripts/build_demos.py`.
- Never publish raw source operational notes to `site/`.
- Route deeper access through explicit request channels, not open links.

## Why static Pages is soft gating only

GitHub Pages is static hosting. Static pages cannot enforce server-side token revocation, one-time redeem, or private runtime guarantees. Witness Window Lite is signaling and friction, not hard security.
