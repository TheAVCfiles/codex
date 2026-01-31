import csv
import re
from collections import defaultdict
from pathlib import Path

# -------- CONFIG --------

INPUT_FILE = "chat_log.txt"
EVENTS_CSV = "output/events.csv"
SUMMARY_FILE = "output/pattern_summary.txt"

# Neutral pattern indicators (language-based, not psychological)
PATTERNS = {
    "HARM_THEN_REASSURE": [
        r"hurt",
        r"yell",
        r"abuse",
        r"threat",
        r"then.*safe",
        r"i'?m keeping you safe",
    ],
    "SAFETY_AFTER_FEAR": [
        r"don'?t worry",
        r"i'?m protecting",
        r"this is for your good",
        r"to keep you safe",
    ],
    "BOUNDARY_ESCALATION": [
        r"asked for privacy",
        r"asked me to stop",
        r"said no",
        r"then.*angry",
        r"then.*escalat",
    ],
    "THREAT_OF_EXPOSURE": [
        r"expose",
        r"tell people",
        r"ruin",
        r"leak",
        r"everyone will know",
    ],
}

# -------- PARSE --------


def load_lines(path):
    with open(path, "r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]


def detect_patterns(line):
    hits = []
    for label, expressions in PATTERNS.items():
        for exp in expressions:
            if re.search(exp, line, re.IGNORECASE):
                hits.append(label)
                break
    return hits


def ensure_output_paths():
    events_path = Path(EVENTS_CSV)
    summary_path = Path(SUMMARY_FILE)
    events_path.parent.mkdir(parents=True, exist_ok=True)
    summary_path.parent.mkdir(parents=True, exist_ok=True)


# -------- RUN --------

ensure_output_paths()

lines = load_lines(INPUT_FILE)
events = []
pattern_counts = defaultdict(int)

for idx, line in enumerate(lines):
    patterns = detect_patterns(line)
    if patterns:
        for p in patterns:
            pattern_counts[p] += 1
        events.append(
            {
                "index": idx,
                "text": line,
                "patterns": "; ".join(patterns),
            }
        )

# -------- OUTPUT --------

with open(EVENTS_CSV, "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=["index", "text", "patterns"])
    writer.writeheader()
    writer.writerows(events)

with open(SUMMARY_FILE, "w", encoding="utf-8") as f:
    f.write("PATTERN SUMMARY\n")
    f.write("================\n")
    for pattern, count in sorted(
        pattern_counts.items(), key=lambda x: x[1], reverse=True
    ):
        f.write(f"{pattern}: {count}\n")

print("Analysis complete.")
print(f"Events saved to {EVENTS_CSV}")
print(f"Summary saved to {SUMMARY_FILE}")
