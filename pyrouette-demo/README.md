# Pyrouette Demo Assets

This folder contains offline-safe diagnostic assets for the Pyrouette demo panel.

## Lottie diagnostics

- `assets/lottie/manifest.json` references `diag-lottie.json` using a local relative path.
- `assets/lottie/diag-lottie.json` provides a self-contained pulse animation for deterministic local/offline checks.

This avoids dependency on missing external animation files and keeps fallback behavior testable.
