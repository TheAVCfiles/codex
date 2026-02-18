import unittest

import pandas as pd
from fastapi.testclient import TestClient

from api import app as fortress_app
from api import tempo


class TempoTests(unittest.TestCase):
    def test_fallback_tempo_range(self) -> None:
        idx = pd.date_range("2026-01-01", periods=30, freq="D", tz="UTC")
        df = pd.DataFrame({"price": [3000 + i for i in range(30)]}, index=idx)
        result = tempo.fallback_tempo_from_series(df)
        self.assertGreaterEqual(result.forecasted_tempo, 60.0)
        self.assertLessEqual(result.forecasted_tempo, 200.0)

    def test_forecast_tempo_endpoint(self) -> None:
        client = TestClient(fortress_app.app)
        r = client.get('/api/forecast-tempo')
        self.assertEqual(r.status_code, 200)
        payload = r.json()
        self.assertIn('forecasted_tempo', payload)
        self.assertIn('model', payload)


if __name__ == '__main__':
    unittest.main()
