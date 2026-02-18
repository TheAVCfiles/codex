import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

from api import learn
from api.forecast import generate_forecast, kelly_fraction, size_notional
from api.learn import LearnEvent, calibrated_probability, load_state, update_state


class ForecastLearnTests(unittest.TestCase):
    def setUp(self) -> None:
        self._orig_state_path = learn.STATE_PATH
        self._tmpdir = tempfile.TemporaryDirectory()
        learn.STATE_PATH = Path(self._tmpdir.name) / "learn_state.json"

    def tearDown(self) -> None:
        learn.STATE_PATH = self._orig_state_path
        self._tmpdir.cleanup()

    def test_kelly_fraction_is_clipped(self) -> None:
        self.assertLessEqual(kelly_fraction(0.99, clip=0.25), 0.25)
        self.assertEqual(kelly_fraction(0.1), 0.0)

    def test_size_notional_respects_base_cap(self) -> None:
        notional = size_notional(100_000, 0.8, max_pct=0.015)
        self.assertLessEqual(notional, 100_000 * 0.015)

    def test_update_state_increases_rain_hits(self) -> None:
        before_hits = int(load_state().get("rain", {}).get("hits", 1))
        now = datetime.now(timezone.utc)
        update_state(
            LearnEvent(
                event="rain",
                predicted_ts=now,
                realized_ts=now + timedelta(minutes=10),
                hit=True,
                social_peak_ts=now + timedelta(minutes=30),
            ),
            ewma_alpha=0.2,
        )
        state = load_state()
        after_hits = int(state.get("rain", {}).get("hits", 1))
        lightning_shift = float(state.get("lightning", {}).get("shift_minutes", 0.0))
        self.assertGreater(after_hits, before_hits)
        self.assertNotEqual(lightning_shift, 0.0)
        self.assertGreaterEqual(calibrated_probability("rain", 0.5), 0.0)

    def test_forecast_includes_lightning_windows(self) -> None:
        fc = generate_forecast("2026-02-12", horizon_minutes=240)
        self.assertIsInstance(fc.lightning_windows, list)
        self.assertIn("lightning", fc.grid[0])


if __name__ == "__main__":
    unittest.main()
