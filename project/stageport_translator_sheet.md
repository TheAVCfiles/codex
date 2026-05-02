# StagePort Audio Translator Sheet (v0.1)

## One-line framing

**We are not designing songs. We are designing system sounds that validate state changes.**

## Fast room opener

Use this sentence first:

> “I’m not asking for music composition. I’m asking for a state-based audio signaling layer.”

## Core model

`User input -> state transition -> audio cue -> logged receipt`

## MVP states

| State   | Function                 | Sound behavior                          |
| ------- | ------------------------ | --------------------------------------- |
| ANCHOR  | stable/ready baseline    | low, steady, minimal modulation         |
| DRIFT   | misalignment warning     | slight detune/modulation, unstable loop |
| TENSION | threshold approaching    | rising density/brightness               |
| BREAK   | confirmed event          | short transient/one-shot                |
| FLOW    | sustained correct motion | non-intrusive rhythmic loop             |
| REST    | active non-action        | intentional near-silence/room tone      |

## Scope for Sunday (2-hour consult)

1. Confirm if state mapping is technically sane.
2. Define 5–7 distinct cues.
3. Identify which cues are loop vs one-shot.
4. Define export format for web runtime.

## Requested deliverables

- 5–7 short cues exported as WAV (+ optional MP3 previews)
- State mapping table (`state -> file -> behavior`)
- Envelope notes per cue (attack, decay, sustain/release)
- Optional stereo/mono recommendations

## Out-of-scope (explicit)

- Full app build
- Full score or soundtrack
- Final mix/master for release

## Runtime handoff format (example)

```json
{
  "ANCHOR": {
    "file": "anchor.wav",
    "behavior": "loop",
    "fade_in_ms": 250,
    "fade_out_ms": 800
  },
  "BREAK": {
    "file": "break.wav",
    "behavior": "one_shot",
    "trigger": "state_transition"
  },
  "REST": { "file": "rest.wav", "behavior": "ambient_low" }
}
```

## Ballet/audio/tech translation bridge

| Ballet thinking | Audio equivalent              | Runtime equivalent    |
| --------------- | ----------------------------- | --------------------- |
| cue             | transient/trigger             | event                 |
| phrase          | loop + modulation path        | sequence              |
| timing          | envelope                      | latency/timing window |
| rest            | intentional low-level silence | active idle state     |
| transition      | crossfade/ramp                | state change          |
| alignment       | stable tone center            | coherence             |

## Fencing analogy (for shared primitive language)

“Not all contact counts. Timing, sequence, and condition determine whether a hit is valid.”

StagePort equivalent:

- not all input counts
- validation gates determine state
- audio confirms valid state transitions

## Meeting close condition

The meeting is successful only if all four are locked:

- agreed state set
- agreed cue design direction
- clear delivery timeline
- clear next build test (Monday prototype trigger test)
