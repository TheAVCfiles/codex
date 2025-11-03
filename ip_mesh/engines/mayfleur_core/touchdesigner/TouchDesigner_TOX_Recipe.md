# Mayfleur Receiver TOX Recipe

This guide summarises the ports and uniforms exposed by the
`Mayfleur_Receiver.tox` container. The values mirror the manifest so
agents can cross-reference the mesh inventory.

## OSC Ports

- **lights** → `oscin1` listening on port **9004**
- **grid** → `oscin2` listening on port **9002**
- **marley** → `oscin3` listening on port **9001**
- **aqua** → `oscin4` listening on port **9003**

## Uniforms

- **uPercent** – compute by mapping an incoming percent (0-100) to the
  shader's `uPercent` uniform via `percent/100.0`.

Refer to `td_dat_script.py` for an example DAT script that pushes OSC
values into the network.
