#!/usr/bin/env python3
"""Build-time redaction utilities.

Why this exists:
- Public Pages output must contain rendered artifacts only.
- Sensitive method language can leak core execution logic/IP.
- Builders call this helper so redaction is consistent and non-optional.
"""

from __future__ import annotations

import re

BANNED_TERMS = [
    "prompt",
    "system message",
    "internal",
    "compiler",
    "authority rules",
    "translation layer",
    "token",
    "key",
    "service role",
    "secret",
    "private logic",
]



def redact_text(text: str) -> str:
    cleaned = text
    for term in BANNED_TERMS:
        cleaned = re.sub(re.escape(term), "[redacted]", cleaned, flags=re.IGNORECASE)
    return cleaned
