# Pyrouette Demo

This folder contains offline-safe diagnostic assets for the Pyrouette panel.

## Lottie diagnostics

- `assets/lottie/manifest.json` points to `diag-lottie.json` using a local relative path.
- `assets/lottie/diag-lottie.json` is a self-contained pulse animation with no external dependencies.

## Why this exists

Previous manifest wiring referenced a non-existent shared asset path. This local setup guarantees that animation fetch and fallback logic can be tested deterministically in offline/local-first environments.
