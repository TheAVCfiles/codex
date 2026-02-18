import tempfile
import unittest

import pandas as pd

from structural_bid_confirmation import check_structural_bid_confirmation


class StructuralBidConfirmationTests(unittest.TestCase):
    def test_confirmed_with_events_in_window(self) -> None:
        ledger = pd.DataFrame(
            {
                "event_date": ["2026-02-10", "2026-05-01"],
                "weight": [92, 60],
                "description": ["DOE Equity Stake", "Low conviction event"],
            }
        )

        result = check_structural_bid_confirmation(ledger, "2026-02-12", window_days=30)

        self.assertEqual(result["status"], "CONFIRMED")
        self.assertEqual(result["signal"], "Structural Bid")
        self.assertEqual(len(result["supporting_evidence"]), 1)

    def test_neutral_without_qualified_events(self) -> None:
        ledger = pd.DataFrame(
            {
                "event_date": ["2026-02-10"],
                "weight": [70],
                "description": ["Below threshold"],
            }
        )

        result = check_structural_bid_confirmation(ledger, "2026-02-12")

        self.assertEqual(result["status"], "NEUTRAL")
        self.assertIn("action", result)

    def test_csv_input_supported(self) -> None:
        ledger = pd.DataFrame(
            {
                "event_date": ["2026-02-10"],
                "weight": [92],
                "description": ["DOE Equity Stake"],
            }
        )

        with tempfile.NamedTemporaryFile("w", suffix=".csv", delete=False) as tmp:
            ledger.to_csv(tmp.name, index=False)
            result = check_structural_bid_confirmation(tmp.name, "2026-02-12", window_days=7)

        self.assertEqual(result["status"], "CONFIRMED")


if __name__ == "__main__":
    unittest.main()
