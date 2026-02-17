import tempfile
import unittest
from datetime import datetime

import pandas as pd

from anchor_scheduler import backtest_anchors, detect_narrative_anchors


class AnchorSchedulerTests(unittest.TestCase):
    def test_detect_narrative_anchors_filters_window(self) -> None:
        now = datetime.today()
        calendar = pd.DataFrame(
            {
                "anchor_date": [
                    now - pd.Timedelta(days=30),
                    now + pd.Timedelta(days=10),
                    now + pd.Timedelta(days=200),
                ],
                "description": ["past", "near-future", "too-far"],
            }
        )

        detected = detect_narrative_anchors(calendar, lookback_days=60)

        self.assertEqual(len(detected), 2)

    def test_backtest_anchors_outputs_status_rows(self) -> None:
        calendar = pd.DataFrame(
            {
                "anchor_date": [datetime(2026, 2, 12)],
                "description": ["Saturn/Uranus Conjunction"],
            }
        )
        ledger = pd.DataFrame(
            {
                "event_date": ["2026-02-10"],
                "weight": [92],
                "description": ["DOE Equity Stake"],
            }
        )

        with tempfile.NamedTemporaryFile("w", suffix=".csv", delete=False) as tmp_ledger, tempfile.NamedTemporaryFile("w", suffix=".csv", delete=False) as tmp_out:
            ledger.to_csv(tmp_ledger.name, index=False)
            backtest_df = backtest_anchors(calendar, tmp_ledger.name, output_path=tmp_out.name)

        self.assertEqual(backtest_df.loc[0, "status"], "CONFIRMED")


if __name__ == "__main__":
    unittest.main()
