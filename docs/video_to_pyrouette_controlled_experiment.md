# Video → Skeleton → Movement Primitives → PyRouette (Controlled Experiment)

## Objective

Run one bounded, empirical test that proves the analysis pipeline works end-to-end:

1. Extract pose/skeleton data from a short dance video clip.
2. Detect at least one pirouette and one jump primitive.
3. Convert detections into a minimal PyRouette-compatible score input.
4. Generate a transparent scoring report.

This document is intentionally narrow: one experiment, one repeatable protocol, one verifiable output.

---

## Experiment Scope

- **Input:** 10-second segment from the _Laws of Motion_ duet.
- **Output:**
  - Time-aligned primitive sequence (JSON/CSV)
  - Minimal `.rou`-style event structure
  - Scoring report including base value, difficulty multiplier, and execution adjustments
- **Success criteria:**
  - One pirouette and one jump are detected with plausible timestamps.
  - Generated score aligns with a trained-eye sanity check (e.g., stable axis and landing score higher than unstable cases).

---

## Pipeline Stages

## 1) Pose Estimation

Use a frame-wise pose extractor (e.g., MediaPipe/OpenPose) to obtain joint coordinates over time.

- Required joints: shoulders, hips, knees, ankles, feet, and torso/center proxy.
- Sampling target: preserve original frame timing or normalize to fixed FPS.
- Output schema (example):

```json
{
  "t": 2.367,
  "joints": {
    "left_hip": [x, y, z],
    "right_hip": [x, y, z],
    "left_knee": [x, y, z],
    "right_knee": [x, y, z]
  },
  "confidence": 0.92
}
```

## 2) Kinematic Feature Extraction

Transform raw coordinates into physically meaningful features:

- Joint angles (hip/knee/ankle)
- Angular velocity around vertical axis (turn rate)
- Center-of-mass proxy trajectory
- Vertical displacement and impulse signatures
- Lateral drift / travel distance

## 3) Primitive Detection Rules

Define movement primitives with explicit thresholds.

### Pirouette (example rule set)

- Sustained vertical-axis angular velocity above threshold.
- Rotation magnitude exceeds minimum angle (e.g., ~1 full turn).
- Lateral drift remains below tolerance.

### Jump / Jeté-like event (example rule set)

- Upward impulse with center-of-mass rise above threshold.
- Airborne interval present.
- Landing detected with bounded instability (post-landing sway threshold).

> Thresholds should be calibrated from a small labeled subset, then frozen for the controlled run.

## 4) Symbolic Event Encoding

Convert detections into event timeline entries:

```text
00:02.1  pirouette
00:05.4  jump
```

Suggested JSON representation:

```json
[
  {
    "t_start": 2.1,
    "t_end": 3.0,
    "primitive": "pirouette",
    "quality": { "axis_stability": 0.86, "travel": 0.11 }
  },
  {
    "t_start": 5.4,
    "t_end": 5.9,
    "primitive": "jump",
    "quality": { "height": 0.72, "landing_stability": 0.81 }
  }
]
```

## 5) PyRouette Scoring

Map events to scoring components:

- **Base value** by primitive type
- **Difficulty multiplier** by complexity/intensity
- **Execution (GOE-style) adjustments** from quality metrics

Produce:

- Per-element score breakdown
- Aggregate technical score
- Brief rationale trace for each adjustment

---

## Minimal Deliverables

1. `skeleton_timeseries.json`
2. `detected_primitives.json`
3. `score_input.rou` (or equivalent JSON adapter)
4. `score_report.md`

---

## Validation Checklist

- [ ] Clip length is ~10 seconds and timestamps are stable.
- [ ] Pose extraction confidence is acceptable for key joints.
- [ ] At least one pirouette and one jump are detected.
- [ ] Detection windows match visual inspection within tolerance.
- [ ] Scoring report explains component contributions clearly.

---

## Why this test matters

This experiment validates the full translation chain from video signal to structured choreography events to score output. If successful, it supports straightforward scaling to longer phrases and full performance analysis while preserving interpretability at each stage.
