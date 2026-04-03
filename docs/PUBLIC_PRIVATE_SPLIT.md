# PUBLIC / PRIVATE SPLIT

## Policy baseline

- **Public layer (GitHub Pages)**: rendered artifacts, summaries, previews.
- **Private layer (build logic)**: scoring methods, translation logic, authority logic, structurally sensitive internals.

## What is safe for public Pages

- Static HTML outputs in `site/`
- Redacted summaries generated at build time
- Controlled CTA paths (Request access, Start pilot, Acquire license)

## What must remain private

- Raw prompts and system messages
- Authority/translation/compiler internals
- Any token/key/secret references
- Unredacted operational method text

## Leakage controls

- `scripts/redact.py` is the mandatory build-time redaction helper.
- All artifact builders consume redacted text before rendering.
- Private-hold release state excludes artifacts from public generation.

## Static hosting limitation

GitHub Pages is static delivery only. It cannot provide strong secret protection or secure runtime access control.
Witness gating is therefore soft gating for preview behavior, not secure enforcement.

## Safety model

Safety is architectural, not magical: keep method-sensitive logic out of public outputs and publish only redacted rendered artifacts.
