from typing import Dict, List

DEFAULT_WEIGHTS = {
    "commits": 1.0,
}


def compute_equity_from_commit_counts(
    commit_counts: Dict[str, int],
    weights=DEFAULT_WEIGHTS,
    stage_fee: float = 0.0,
    fee_recipient: str = "you",
) -> List[dict]:
    """Compute ranked equity split from commit counts with optional stage fee."""
    results = []
    for name, commits in commit_counts.items():
        score = commits * weights["commits"]
        results.append({"contributor": name, "commits": commits, "score": score})

    base_total = sum(r["score"] for r in results) or 1.0
    for r in results:
        base_percent = (r["score"] / base_total) * 100.0
        r["base_equity_percent"] = round(base_percent, 2)
        r["equity_percent"] = r["base_equity_percent"]

    if stage_fee > 0:
        clamped_fee = max(0.0, min(stage_fee, 1.0))
        remainder = 1.0 - clamped_fee

        # ensure fee recipient is present in results
        recipient = next(
            (r for r in results if r["contributor"] == fee_recipient),
            None,
        )
        if recipient is None:
            recipient = {
                "contributor": fee_recipient,
                "commits": 0,
                "score": 0,
                "base_equity_percent": 0.0,
                "equity_percent": 0.0,
            }
            results.append(recipient)

        for r in results:
            base_fraction = r["base_equity_percent"] / 100.0
            r["equity_percent"] = round(base_fraction * remainder * 100.0, 2)

        recipient["equity_percent"] = round(recipient["equity_percent"] + (clamped_fee * 100.0), 2)

    results.sort(key=lambda item: item["equity_percent"], reverse=True)
    return results
