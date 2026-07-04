# MythOS Local Foundation

A self-hosted starter kit to run MythOS research and demos **without any SaaS lock-in**.

## Contents

- `MythOS_Local_Quickstart.ipynb` — Jupyter notebook using local/portable APIs.
- `server.py` — Minimal FastAPI service exposing `/generate` and `/align` endpoints.
- `alignment_metrics.py` — Reference metrics: alignment score `A(t)`, burn rate `E_sac`, containment `V_cont`.
- `provenance_ledger.md` — How to hash, timestamp, and append entries to a local ledger.
- `setup_local.sh` — One-shot environment setup (CPU defaults). Add CUDA as desired.
- `.env.example` — Placeholder for any optional keys (kept empty by default).

## Quickstart

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload  # start local API
# In another terminal:
jupyter lab
```

## Models

This kit defaults to **open local endpoints**. You can pair it with:

- [Ollama](https://github.com/ollama/ollama) (llama3, phi4, qwen2.5, mistral)
- [vLLM](https://github.com/vllm-project/vllm) for GPU-serving
- CPU-only via `transformers` (`AutoModelForCausalLM`) for small demos

## Safety & License

- Text content is yours; keep your PDFs under **CC BY-NC-ND 4.0** if publishing.
- Code is **Apache-2.0** by default — edit if you prefer a different license.
