# Style Audit Kit

A lightweight harness for measuring discourse-style response drift across three
prompt wrappers (`credentialed`, `mythic`, `neutral`).

## What it computes

- **SPI** (stabilization pressure index): `grounding_count / (agency_count + 1)`
- **Hedge rate**: `hedge_count / word_count`
- **Refusal flag + hits** based on refusal phrase patterns
- **Throughput signals**: word count, actionable step count, question count

## Usage

### 1) Offline scoring (no API calls)

```bash
python auditkit/run_style_audit.py \
  --offline-input path/to/responses.csv \
  --out-dir audit_outputs
```

`responses.csv` needs columns:

- `condition` (`credentialed|mythic|neutral`)
- `response`
- optional: `prompt`

### 2) Online run against OpenAI Responses API

```bash
export OPENAI_API_KEY=...
python auditkit/run_style_audit.py \
  --base-prompt "<same core question for all conditions>" \
  --runs 50 \
  --model gpt-5.2 \
  --temperature 0.7 \
  --out-dir audit_outputs
```

Optional plotting (requires `pandas`, `seaborn`, `matplotlib`):

```bash
python auditkit/run_style_audit.py --offline-input responses.csv --plot
```

## Output files

- `audit_results.csv` (one row per run with raw text + metrics)
- `audit_summary.csv` (condition-level means and refusal rate)
