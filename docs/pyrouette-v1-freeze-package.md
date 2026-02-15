# Py.rouette v1.0 Freeze Package

## 1. Formal Spec Sheet

### Purpose

Py.rouette v1.0 is a standardized, objective scoring system for rotational dance mechanics. It converts embodied physics into measurable invariants and judge-ready outputs.

### Scope

- Applies to turn families including pirouettes, fouettés, pencil turns, and attitude turns.
- Produces: TES, PCS, GOE, Final Score, and Provenance Hash.

### Core Math

#### TES — Technical Element Score

\[
TES = B + S + A + R
\]

- **B (Base Value):** Difficulty coefficient (turn type × rotations).
- **S (Stability):** Inverse wobble index from center-of-mass drift.
- **A (Axis Integrity):** Deviation from ideal vertical axis (degrees).
- **R (Rotation Quality):** Angular velocity consistency with variance penalty.

#### PCS — Performance Component Score

\[
PCS = L + E + C
\]

- **L (Line):** Limb clarity and silhouette integrity.
- **E (Energy Transfer):** Initiation → sustain → release coherence.
- **C (Control):** Transition quality in and out of the turn.

#### GOE — Grade of Execution

\[
GOE = \Delta\_{+/-}
\]

- Range: **-5 to +5**.
- Assigned from timestamped evidence of major errors and major excellence.

#### Final Score

\[
Final = TES + PCS + GOE
\]

### Invariants

#### Mechanical

- Axis measurable in degrees.
- Drift measurable in centimeters.
- Rotation measurable in milliseconds.
- Entry and exit phases captured.

#### Procedural

- Every scored result produces a provenance hash.
- Every judge uses the same rubric.
- Every output is reproducible.

#### Ethical

- No body-shape bias.
- No style bias.
- No school/lineage bias.

---

## 2. Rubric Table

| Category | Sub-Factor           | Measurement                         | Score Range | Notes                              |
| -------- | -------------------- | ----------------------------------- | ----------- | ---------------------------------- |
| TES      | Base Value (B)       | Turn type × rotations               | Fixed       | Uses predefined table              |
| TES      | Stability (S)        | Wobble index                        | 0–5         | Lower wobble yields higher score   |
| TES      | Axis Integrity (A)   | Degree deviation                    | 0–5         | 0° is ideal                        |
| TES      | Rotation Quality (R) | Angular velocity variance           | 0–5         | Lower variance yields higher score |
| PCS      | Line (L)             | Silhouette clarity                  | 0–5         | Observable, no artistry narrative  |
| PCS      | Energy Transfer (E)  | Entry → sustain → release coherence | 0–5         | Must be timestamp-verifiable       |
| PCS      | Control (C)          | Transition quality                  | 0–5         | No narrative descriptors           |
| GOE      | Execution Modifier   | Error/excellence evidence           | -5 → +5     | Timestamp justification required   |
| Output   | Provenance Hash      | Auto-generated audit hash           | n/a         | Appended to ledger                 |

---

## 3. Judge Quick Card (Printable)

1. **Identify Element**
   - Determine turn type and rotation count.
   - Assign Base Value.
2. **Score TES**
   - Check axis, drift, rotation consistency, and stability.
3. **Score PCS**
   - Check line, energy transfer, and control.
4. **Apply GOE**
   - Apply -5 to +5 based on timestamped major errors/excellence.
5. **Record Hash**
   - Auto-generate provenance hash and append ledger entry.

---

## 4. Comparison Artifact Template

### Header

- Dancer A
- Dancer B
- Date
- Judge
- Ledger Entry IDs

### Section 1 — Video Evidence

- Video A stills (timestamped)
- Video B stills (timestamped)

### Section 2 — TES Breakdown

| Factor           | A   | B   |
| ---------------- | --- | --- |
| Base Value       |     |     |
| Stability        |     |     |
| Axis Integrity   |     |     |
| Rotation Quality |     |     |

### Section 3 — PCS Breakdown

| Factor          | A   | B   |
| --------------- | --- | --- |
| Line            |     |     |
| Energy Transfer |     |     |
| Control         |     |     |

### Section 4 — GOE

| A   | B   |
| --- | --- |
|     |     |

### Section 5 — Final Score

| A   | B   |
| --- | --- |
|     |     |

### Section 6 — Provenance

- Hash A
- Hash B
- Judge signature
- Timestamp

---

## 5. Canonical Output Format

Each scored output package should include:

- TES / PCS / GOE and final score.
- Timestamped still frames.
- Provenance hash.
- Judge signature.
- Ledger entry ID.
