# PyRouette Local Ops + Stageport Logging

This guide turns the loose setup snippets into a runnable local workflow for watching choreography files, validating credentials, and pushing results into Firestore.

## Quick demo servers

If you have a static demo build available, serve it locally for rapid iteration:

```bash
npx serve dist
```

## Firestore helper

Create a small helper that stamps validation reports with a UTC timestamp and stores them under `stageport_logs`:

```python
# firebase_integration.py
from firebase_admin import credentials, firestore, initialize_app
import datetime

cred = credentials.Certificate("firebase_creds.json")
app = initialize_app(cred)
db = firestore.client()

def push_credential_result(result):
    doc_ref = db.collection("stageport_logs").document()
    result["timestamp"] = datetime.datetime.utcnow().isoformat()
    doc_ref.set(result)
```

Inside your validation handler, import and call the helper after printing the report:

```python
from firebase_integration import push_credential_result

# After print(report)
push_credential_result(report)
```

## Ops Organ watcher

Use `watchdog` to observe a curriculum file, validate it, and on MASTER credentials commit the text and report into Firestore under `artifacts/<user>/<client_choreography>/pyrouette_mock_ballet_v1`:

```python
from stageport_evolution import validate
from firebase_admin import credentials, firestore, initialize_app
import time, json
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

FIREBASE_CRED_PATH = "firebase-credentials.json"
TARGET_FILE = "your_curriculum.txt"
COLLECTION_PATH = "client_choreography"
DOCUMENT_ID = "pyrouette_mock_ballet_v1"

class OpsOrganHandler(FileSystemEventHandler):
    def __init__(self, db, user_id):
        self.db = db
        self.user_id = user_id

    def on_modified(self, event):
        if event.src_path.endswith(TARGET_FILE):
            with open(TARGET_FILE, 'r') as f:
                curriculum = f.read()
            report = validate(curriculum)
            print("\n--- Credential Report ---")
            print(json.dumps(report, indent=2))

            if report['credential_level'] == 'MASTER':
                doc_ref = self.db.collection('artifacts').document(self.user_id).collection(COLLECTION_PATH).document(DOCUMENT_ID)
                doc_ref.set({
                    "validated_text": curriculum,
                    "credential_report": report,
                    "status": "APPROVED_FOR_EVOLUTION",
                    "timestamp": firestore.SERVER_TIMESTAMP
                })
                print("🔥 MASTER credential committed to Firestore")

def main():
    cred = credentials.Certificate(FIREBASE_CRED_PATH)
    app = initialize_app(cred)
    db = firestore.client()
    user_id = "your-user-id"  # Pull from auth or env in production
    event_handler = OpsOrganHandler(db, user_id)
    observer = Observer()
    observer.schedule(event_handler, '.', recursive=False)
    observer.start()
    print(f"🔭 OPS Organ running... Watching: {TARGET_FILE}")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    main()
```

Run the watcher:

```bash
python watcher.py
```

A convenience launcher can live in `run_local_ops.sh`:

```bash
#!/bin/bash
echo "🎬 PyRouette: Local Evolution Watcher Starting..."
source .venv/bin/activate  # Or any venv you use
python watcher.py
```

Remember to mark it executable:

```bash
chmod +x run_local_ops.sh
```

## Evolution hook (pseudo)

A shell hook can trigger fine-tuning when a MASTER credential lands:

```bash
# evolution.sh
if [ "$LEVEL" == "MASTER" ]; then
    echo "Retraining on new MASTER..." >> evolution.log
    python retrain_on.py "$CURRICULUM_FILE"
fi
```

## Seed trigger

To manually exercise the handler without waiting for a filesystem event:

```python
from watcher import DanceNoteHandler
from stageport_evolution import validate

print("🌱 PyRouette Evolution Seed Activated.")
print("📝 Save your choreography to begin mutation...")

# Live monitor & evolve upon every save
DanceNoteHandler().on_modified(type("MockEvent", (), {"src_path": "your_curriculum.txt"})())
```

## gen-ai-core layout

Reference scaffold for the core assets backing evolution:

```
/gen-ai-core
  ├── glossary/               # Movement terms → JSON / YAML knowledge
  ├── embeddings/             # Vector representations of terms
  ├── feedback_log/           # All validated MASTER corrections
  ├── scripts/
  │    ├── train_from_feedback.py  # Fine-tunes new logic
  │    └── stageport_to_llm.py     # Generates training examples from validator
```

These notes keep the PyRouette curriculum watcher, Firestore logging, and evolution hooks in one place for quick reuse.
