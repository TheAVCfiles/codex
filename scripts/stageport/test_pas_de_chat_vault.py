import argparse
import io
import unittest
from contextlib import redirect_stdout
from unittest.mock import patch

from scripts.stageport import pas_de_chat_vault


class PasDeChatVaultTests(unittest.TestCase):
    def test_salvage_adds_fallback_keywords_until_minimum_three(self) -> None:
        salvage = pas_de_chat_vault._salvage("a", "ChatGPT")

        self.assertEqual(salvage.category, "ChatGPT")
        self.assertGreaterEqual(len(salvage.keywords), 3)
        self.assertLessEqual(len(salvage.keywords), 8)

    def test_push_rejects_whitespace_only_raw_capture(self) -> None:
        args = argparse.Namespace(raw_text="   \n\t", raw_file=None, category=None)
        stdout = io.StringIO()

        with patch("scripts.stageport.pas_de_chat_vault._require_requests") as require_requests:
            with redirect_stdout(stdout):
                rc = pas_de_chat_vault.push(args)

        self.assertEqual(rc, 0)
        self.assertIn("RAW capture is empty; no record created.", stdout.getvalue())
        require_requests.assert_not_called()


if __name__ == "__main__":
    unittest.main()
