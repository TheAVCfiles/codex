import tempfile
import unittest
from pathlib import Path

from api import executor


class ExecutorTests(unittest.TestCase):
    def test_decide_holds_when_no_edge(self) -> None:
        d = executor.decide(100_000, p_rain=0.55, p_sun=0.55, lightning=0.1)
        self.assertEqual(d.action, "HOLD")

    def test_decide_buy_when_rain_high(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            old = executor.METRICS_PATH
            executor.METRICS_PATH = Path(td) / "metrics.jsonl"
            d = executor.decide(100_000, p_rain=0.9, p_sun=0.1, lightning=0.2)
            executor.METRICS_PATH = old
        self.assertEqual(d.action, "BUY")
        self.assertGreater(d.notional, 0)

    def test_lightning_killswitch_when_brier_degrades(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            old = executor.METRICS_PATH
            p = Path(td) / "metrics.jsonl"
            p.write_text('{\"brier_rain\": 0.4, \"brier_sun\": 0.35}\n', encoding='utf-8')
            executor.METRICS_PATH = p
            d = executor.decide(100_000, p_rain=0.95, p_sun=0.05, lightning=0.9)
            executor.METRICS_PATH = old
        self.assertEqual(d.action, "HOLD")
        self.assertIn("kill-switch", d.reason)


if __name__ == "__main__":
    unittest.main()
