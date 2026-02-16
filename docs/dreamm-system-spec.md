# Dreamm System Spec (MythOS / MovementOS)

## Purpose

Dreamms are the visual-narrative compression layer of MythOS. They attach symbolic meaning to protocol events (movement harvests, receipts, corridor keys, and verification artifacts).

## Working Definition

- **DREAMM**: Distributed Recursive Emotional-Aesthetic Mytho-Mapping.
- **Role in stack**:
  - Protocol layer handles physics, economics, verification, and governance.
  - Dreamm layer handles symbolic continuity, identity expression, and UX ritualization.

## Corridor Alignment (Operational Mapping)

| Corridor | Domain     | Dreamm function                                |
| -------- | ---------- | ---------------------------------------------- |
| 0        | Operator   | Sovereign identity imprint                     |
| 1        | Proof      | Archetype-tagged receipt overlays              |
| 2        | Movement   | Glitch-value and kinetic motif mapping         |
| 3        | Memory     | Anti-Archive visual states, echo/decay windows |
| 4        | Narrative  | Surface/Cipher/Echo narrative transitions      |
| 5        | Value      | Signature objects and key-value artifacts      |
| 6        | Myth       | Ritual architecture and symbolic canon         |
| 7        | Echo       | Reflective recursion and resonance states      |
| 8        | Enterprise | Institutional packet visuals                   |
| 9        | Signal     | Forecast/risk signal overlays                  |
| 10       | Somatic    | Body-state and thermal-emotional mapping       |

## Signal-to-Sovereignty Reference Architecture

```text
+------------------------------------------------------+
| INPUT LAYER      Movement | Intuition | Labor | Story|
+------------------------------------------------------+
| PROCESSING LAYER TSE | Verification | Physics Compiler|
+------------------------------------------------------+
| OUTPUT LAYER     Credentials | Receipts | OS Packets  |
+------------------------------------------------------+
| ECONOMY LAYER    Sentient Cents (SC)                 |
+------------------------------------------------------+
```

## Dual-Signal Verification Rule

```text
Signal_True = Intuition_Flag && Intelligence_Validation
```

Signals that do not satisfy both conditions are dropped and do not mint downstream receipt state.

## Core Schemas

### Movement Event

```json
{
  "timestamp": "UNIX",
  "tile_id": 0,
  "force": 0.0,
  "heat": 0.0,
  "orientation": [0.0, 0.0, 0.0],
  "cadence": 0.0,
  "signature": "hash"
}
```

### Ledger Entry

```text
LedgerEntry {
  operator: address,
  category: MOV | INT | LAB | NAR,
  signature: hash,
  kinetic_sig: hash? (if movement),
  emotional_cost: optional,
  auth_version: float,
  status: VERIFIED | PENDING | REFUSED
}
```

### Stageport Entry

```text
StageportEntry {
  role: enum("Family", "Operator", "Founder"),
  grant: float (SC),
  status: enum("Active", "Verified", "Dormant"),
  kinetic_sig: bytes32,
  auth_version: float,
  timestamp: unix,
  annotation: optional(text),
  verifier: address
}
```

### Dreamm Object

```json
{
  "dreamm_id": "DREAMM_CORRIDOR_3_01",
  "corridor": 3,
  "mode": ["Surface", "Cipher", "Echo"],
  "image_ref": "ipfs://dreamm3.jpg",
  "keywords": ["fog", "hallway", "memory", "decay"],
  "emotional_signature": {
    "temperature": "cool",
    "contrast": "low",
    "movement": "slow drift"
  },
  "ritual_trigger": "echo_state",
  "oracle_weight": 0.22,
  "value_multiplier": 1.03,
  "narrative_string": "Memory softens but never disappears."
}
```

## Dreamm API Draft

```http
GET /dreamm/{corridor}
GET /dreamm/random
POST /dreamm/attach
```

### Endpoint behavior

- `GET /dreamm/{corridor}` → returns corridor-filtered Dreamm JSON + image reference.
- `GET /dreamm/random` → returns weighted Dreamm based on kinetic history.
- `POST /dreamm/attach` with `{ harvest_id, dreamm_id }` → binds Dreamm to movement receipt.

## NFT + Corridor Keys Integration

### On-chain contract behavior (high-level)

- Mint corridor-bound key NFTs.
- Store corridor ID and token URI.
- Attach Dreamm reference per token ID.

### Metadata template

```json
{
  "name": "Corridor Key #{{id}} — {{corridor_name}}",
  "description": "A sovereign Dreamm anchor granting access to Corridor {{corridor_number}}: {{corridor_name}}.",
  "image": "ipfs://{{imageCID}}",
  "attributes": [
    { "trait_type": "Corridor", "value": "{{corridor_number}}" },
    { "trait_type": "Dreamm", "value": "{{dreamm_title}}" },
    { "trait_type": "Frequency", "value": "{{frequency}}" },
    { "trait_type": "Archetype", "value": "{{archetype}}" },
    { "trait_type": "Temperature", "value": "{{emotional_temp}}" }
  ],
  "unlockables": {
    "stage_multiplier": "{{multiplier_stage}}",
    "streetcred_multiplier": "{{multiplier_street}}",
    "corridor_pdf": "ipfs://{{pdfCID}}"
  }
}
```

## Sentient Cents Rules (Current Draft)

```text
if sc_transferred_to_verified_actor:
    new_balance = balance * (1 + β)

if sc_idle_days > τ:
    balance = balance - sqrt(balance) * α
```

## Anti-Archive Integration Hooks

- Corridor 3 (Memory) Dreamms should encode TTL/decay state transitions.
- Preserve/Release/Transcribe actions should be represented as Dreamm mode transitions.
- Only VERIFIED signals should receive persistent Dreamm attachments.

## Content/Asset Layout (Proposed)

```text
/corridors/
  0_origin/
  1_proof/
  2_movement/
  3_memory/
  ...
  10_enterprise/

art/
  corridor_0_origin/
  corridor_1_proof/
  corridor_2_movement/
  corridor_3_memory/
  corridor_4_clarity/
  corridor_5_value/
  corridor_6_myth/
  corridor_7_echo/
  corridor_8_enterprise/
  corridor_9_signal/
  corridor_10_somatic/
```

## Implementation Notes

- Keep protocol concerns and Dreamm concerns separated (verification/economics vs meaning/presentation).
- Treat Dreamm attachment as metadata composition, not consensus-critical validation.
- Preserve deterministic verification path for Proof-of-Signal before rendering any Dreamm state.
