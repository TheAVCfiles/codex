# TouchDesigner TOX Recipe — Mayfleur Receiver

- **Ports**
  - Lights OSC: `9004`
  - Grid OSC: `9002`
  - Marley OSC: `9001`
  - Aqua OSC: `9003`
- **Uniforms**
  - `uPercent` ← normalized EI percent (`percent / 100.0`)
- **Notes**
  - Pair with `td_dat_script.py` for DAT callbacks.
  - The TOX exposes a CHOP output labelled `lights_percent` for downstream bridges.
