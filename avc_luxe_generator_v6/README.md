# AVC Luxe Install Engine V6

Local-first generator for sealed "Private Operating Environment" client packages.

## What it builds

For each client config, the generator outputs:

- `00_OPEN_ME.html` (cinematic router)
- `system.json` (identity/config)
- `01_SESSION/` (session + demo)
- `02_INTERFACE/` (dashboard + modules)
- `03_ATLAS/` (manifesto + tone)
- `04_PROOF/` (system brief + black card copy)
- `05_NEXT/` (activation page)
- `config/theme.css`
- `<slug>_private_environment.zip`

Everything is static/local. No CDN, no remote fonts, no backend.

## Quick start

```bash
python3 build.py examples/first_client.json
```

Artifacts are written to:

- `output/<client_slug>_private/`
- `output/<client_slug>_private_environment.zip`

## Config schema

See `examples/first_client.json`.

Key knobs:

- branding (`client_name`, `tagline`, `operator_name`)
- visual tokens (`theme`, `primary_color`, `background`)
- module toggles (`modules.interface`, `modules.atlas`, etc.)
- narrative copy (`proof_line`, `activation_line`)
