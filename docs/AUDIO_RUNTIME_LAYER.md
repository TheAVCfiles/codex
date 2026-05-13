# Audio Runtime Layer (CuePort)

## Core Thesis

Music is not ornament in embodied systems work.

It is a **runtime key** that can activate movement phrases already encoded through repetition.

When dancers have established phrase invariants through drills, directional pathways, rhythm work, and spatial mapping, a specific sonic profile can trigger execution with lower cognitive load.

## Technical Translation

Audio acts as a trigger layer over embodied local storage:

- phrase encoding happens during training (barre, phrase labs, repetition)
- retrieval happens at runtime via cue recognition
- execution cost drops because movement does not need full recomputation

This is an efficiency model based on:

- better encoding
- stronger retrieval cues
- lower runtime compute
- higher synchronization reliability

## Doctrine

> **Audio as Runtime Key**  
> Music is not ornament. Music is an executable cue layer.  
> When foundational phrases have been properly encoded through repetition, a specific sonic profile can activate stored movement memory without requiring full cognitive recomputation.  
> StagePort treats audio as a retrieval key for embodied local storage.

## Phrase Ledger: Audio Fields

Every governed phrase record should include audio trigger metadata.

```json
{
  "phrase_id": "phrase_042",
  "status": "SIDEBAR",
  "movement_logic": ["plie rebound", "spiral reach", "left initiation"],
  "audio_triggers": {
    "tempo_bpm": 92,
    "frequency_profile": "warm low-mid pulse",
    "cue_event": "downbeat after vocal entrance",
    "activation_quality": "grounded recall",
    "memory_effect": "reduces cognitive load; increases embodied timing"
  },
  "runtime_notes": "When paired with this sonic texture, dancers recover phrase without verbal prompting."
}
```

## Product Surface

This supports a governed offer design:

- StagePort Cue Packs (phrase library + music mapping + prompts + readiness protocol)
- PayGait Audio Runtime Layer (movement-to-audio mapping with rights metadata)
- teacher/operator cue architecture for faster phrase recovery and less verbal overhead

## Canonical Line

Everybody is chasing bigger GPUs.

Ballet has taught another model for centuries: **train the body until execution runs locally.**
