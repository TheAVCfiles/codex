import unittest
from datetime import timedelta

from fastapi.testclient import TestClient

import single_file_fortress as sff


class SingleFileFortressTests(unittest.TestCase):
    def setUp(self) -> None:
        sff.STATE["rain"] = sff.LearnState()
        sff.STATE["sun"] = sff.LearnState()
        self.client = TestClient(sff.app)

    def test_forecast_endpoint_returns_windows(self) -> None:
        r = self.client.get("/forecast/eth")
        self.assertEqual(r.status_code, 200)
        body = r.json()
        self.assertIn("grid", body)
        self.assertIn("rain_windows", body)

    def test_learn_updates_state(self) -> None:
        fc = self.client.get("/forecast/eth").json()
        ts = fc["grid"][0]["ts"]
        realized = (sff.datetime.fromisoformat(ts) + timedelta(minutes=5)).isoformat()

        r = self.client.post(
            "/learn/eth",
            json={"event": "rain", "predicted_ts": ts, "realized_ts": realized, "hit": True},
        )
        self.assertEqual(r.status_code, 200)
        self.assertGreater(r.json()["hits"], 1)


if __name__ == "__main__":
    unittest.main()
