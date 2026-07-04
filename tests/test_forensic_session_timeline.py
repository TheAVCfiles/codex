import tempfile
import unittest
from pathlib import Path

import pandas as pd
from fastapi.testclient import TestClient

from api import app as fortress_app


class ForensicSessionTimelineTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.base = Path(self.tmp.name)
        self.master = self.base / "case_master.xlsx"
        self.sessions = self.base / "sessions"
        self.sessions.mkdir(parents=True, exist_ok=True)

        raw = pd.DataFrame(
            [
                {
                    "raw_id": "R1",
                    "doc_id": "DOC1",
                    "raw_text": "2002-12-18",
                    "type": "Date",
                    "page": 3,
                    "efta_bates": "EFTA-1",
                    "confidence": 0.9,
                    "context_snippet": "flight from Teterboro",
                    "status": "review",
                },
                {
                    "raw_id": "R2",
                    "doc_id": "DOC2",
                    "raw_text": "Palm Beach meeting",
                    "type": "Location",
                    "page": 7,
                    "efta_bates": "EFTA-2",
                    "confidence": 0.88,
                    "context_snippet": "met on March 3, 2003",
                    "status": "review",
                },
            ]
        )
        events = pd.DataFrame(
            [
                {
                    "event_id": "EV1",
                    "date": "2004-01-01",
                    "description": "Structured event",
                    "entities": "[]",
                    "efta_bates": "EFTA-3",
                }
            ]
        )
        intake = pd.DataFrame(
            [
                {
                    "doc_id": "DOC1",
                    "filename": "sample.pdf",
                    "source_type": "upload",
                    "source_path": str(self.base / "sample.pdf"),
                }
            ]
        )
        (self.base / "sample.pdf").write_bytes(b"%PDF-1.1\n%mock\n")

        with pd.ExcelWriter(self.master) as writer:
            raw.to_excel(writer, sheet_name="Raw_Entities", index=False)
            events.to_excel(writer, sheet_name="Events", index=False)
            intake.to_excel(writer, sheet_name="Intake_Log", index=False)

        fortress_app.FORENSIC_MASTER_XLSX = self.master
        fortress_app.FORENSIC_SESSIONS_DIR = self.sessions
        self.client = TestClient(fortress_app.app)

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def test_timeline_parses_and_sorts_dates(self) -> None:
        response = self.client.get("/api/timeline")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(len(payload), 3)
        dates = [item["date"] for item in payload]
        self.assertEqual(dates, sorted(dates))
        self.assertIn("Structured event", [item["entity"] for item in payload])

    def test_session_save_load_and_list(self) -> None:
        save = self.client.post("/api/session/save", json={"name": "snap1"})
        self.assertEqual(save.status_code, 200)
        self.assertTrue((self.sessions / "snap1.xlsx").exists())

        listed = self.client.get("/api/session/list")
        self.assertEqual(listed.status_code, 200)
        self.assertIn("snap1", listed.json())

        load = self.client.post("/api/session/load", json={"name": "snap1"})
        self.assertEqual(load.status_code, 200)
        self.assertEqual(load.json()["status"], "loaded")

    def test_document_route_returns_pdf(self) -> None:
        response = self.client.get("/api/document/DOC1")
        self.assertEqual(response.status_code, 200)
        self.assertIn("application/pdf", response.headers.get("content-type", ""))


if __name__ == "__main__":
    unittest.main()
