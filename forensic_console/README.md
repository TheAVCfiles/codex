# Forensic Console (Controlled Experiment)

A local-first prototype that proves a basic pipeline:

1. Intake (`upload` or `url pull`)
2. Scan (deterministic regex extraction)
3. Review queue persistence in `case_master.xlsx`

## Backend

```bash
cd forensic_console/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python server.py
```

Server runs on `http://127.0.0.1:5000`.

## Frontend

`frontend/App.jsx` is a React view layer designed to call the backend API.
Integrate into your existing React/Tailwind app shell.

## API Endpoints

- `POST /api/intake/upload`
- `POST /api/intake/url`
- `POST /api/scan`
- `GET /api/data/<sheet>`

## Output

The backend creates and maintains `backend/case_master.xlsx` with sheets for intake and extracted entities.
