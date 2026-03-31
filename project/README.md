# Global AVC Systems — Public Deployment Spine

Static multi-surface site prepared for **Cloudflare Pages** deployment.

## Structure

```
project/
├── index.html            # Root company front door
├── proof/
│   └── index.html        # GMS Proof Console surface
├── audit/
│   └── index.html        # StagePort System Audit Console surface
├── terminal/
│   └── index.html        # Optional private terminal placeholder
└── assets/               # Public assets (PDFs, collateral)
```

## Copy + Positioning Spine

- Root headline: **We install systems that unlock capital.**
- Positioning: **Governance-first systems that make companies legible enough to fund, scale, and defend.**
- Offer stack:
  - Governance Install
  - Private Operating Environment
  - StudioOS Capsule

## Cloudflare Pages Setup

1. Put `globalavcsystems.com` DNS on Cloudflare.
2. Create GitHub repo `global-avc-systems` and push this structure.
3. Create Cloudflare Pages project:
   - Framework preset: `None`
   - Build command: _(blank)_
   - Output directory: `/`
4. Attach custom domains:
   - `globalavcsystems.com`
   - `proof.globalavcsystems.com`
   - `audit.globalavcsystems.com`
5. Configure `www` redirect to apex (or inverse, if preferred canonical policy).

## Local Preview

```bash
cd project
python -m http.server 8000
```

Then open:

- `http://localhost:8000/`
- `http://localhost:8000/proof/`
- `http://localhost:8000/audit/`
- `http://localhost:8000/terminal/`
