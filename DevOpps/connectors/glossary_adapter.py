"""DevOpps adapter for ontology term normalization."""

NORMALIZED_TYPES = {
    "tool credits": "Tool Credits",
    "education": "Education",
    "grants": "Grants",
    "fellowships": "Fellowships",
    "platform access": "Platform Access",
}


def normalize_type(value: str) -> str:
    return NORMALIZED_TYPES.get(value.strip().lower(), value.strip())
