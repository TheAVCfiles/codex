#!/usr/bin/env python3
"""
LEODUCT League — Gamified Ops Scoreboard
- Ingests ops/operations_dashboard.csv
- Converts chosen metrics into 0–100 team scores
- Creates opponents (past-self or synthetic rivals)
- Appends to ops/leoduct_league.csv
- Prints standings + weekly match recaps
- Optionally writes ops/leoduct_leaderboard.html

Usage:
  python ops/leoduct_league.py --week 2025-W44 --mode past
  python ops/leoduct_league.py --week auto --mode rival --html
"""

import argparse
import datetime
import random
import sys
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
OPS  = ROOT / "ops"
OPS.mkdir(parents=True, exist_ok=True)

DASH_PATH = OPS / "operations_dashboard.csv"
LEAGUE_PATH = OPS / "leoduct_league.csv"
BOARD_HTML  = OPS / "leoduct_leaderboard.html"

# ---- Configuration knobs ----------------------------------------------------
# Map dashboard rows -> teams with the metric we want to score.
TEAM_MAP = [
    # (Team, Category, Node, Metric, higher_is_better)
    ("KOLL_Core", "Finance", "Profitability", "USD", True),
    ("DTG_Worker", "Automation", "Events_Processed", "Events processed", True),
    ("Codex_CLI", "Engagement", "Active_Users", "Weekly active users", True),
    ("Zero_Loss_Site", "Compliance", "Downloads", "downloads", True),
    ("Codex_de_Ballet", "Arts", "Licenses_Sold", "Revenue (USD)", True),
]

# Normalization settings by Category -> (target, soft_cap)
# score = min(100, 100 * value / target) but eases toward soft_cap for big outliers
CATEGORY_TARGETS = {
    "Finance":     (1000,  3000),
    "Automation":  (5000,  15000),
    "Engagement":  (100,   300),
    "Compliance":  (50,    150),
    "Arts":        (2000,  6000),  # revenue example for editions
}

# Rival difficulty multiplier (1.0 = even match)
RIVAL_DIFFICULTY = 1.00

# -----------------------------------------------------------------------------

def infer_week_label(ts: datetime.date | None = None) -> str:
    d = ts or datetime.date.today()
    y, w, _ = d.isocalendar()
    return f"{y}-W{w:02d}"

def soft_normalize(value: float, target: float, soft_cap: float) -> float:
    if value <= 0: return 0.0
    base = 100.0 * (value / target)
    if value > soft_cap:
        # compress outliers so a blowout doesn't break the game
        extra = 100.0 * ((value - soft_cap) / (soft_cap))**0.5
        return min(100.0 + extra, 150.0)  # allow bonus points up to 150
    return min(base, 100.0)

def pick_dashboard_value(df: pd.DataFrame, node: str, metric_hint: str) -> float:
    # Flexible match on Node + Metric name.
    subset = df[df["Node"].str.contains(node, case=False, na=False)]
    if subset.empty: return 0.0
    # Pick column by hint or fallbacks (This_Week / Value)
    cols = list(subset.columns)
    for c in ["This_Week","Value","Count","USD","Events processed","Revenue (USD)"]:
        if any(c.lower() in x.lower() for x in cols):
            col = [x for x in cols if c.lower() in x.lower()][0]
            try:
                return float(subset.iloc[0][col])
            except Exception:
                continue
    # Try exact hint
    if metric_hint in subset.columns:
        try:
            return float(subset.iloc[0][metric_hint])
        except Exception:
            pass
    # Last resort: numeric first column
    for c in subset.columns:
        if pd.api.types.is_numeric_dtype(subset[c]):
            return float(subset.iloc[0][c])
    return 0.0

def make_opponent_score(mode: str, team: str, prev_score: float) -> float:
    if mode == "past":
        # Past-self (previous week); if none, use small noise
        base = prev_score if prev_score > 0 else 60.0
        return base * random.uniform(0.95, 1.05)
    # Synthetic rival
    noise = random.uniform(0.90, 1.10) * RIVAL_DIFFICULTY
    base = prev_score if prev_score > 0 else 70.0
    return base * noise

def compute_scores(ops_df: pd.DataFrame, week: str, league_df: pd.DataFrame, mode: str):
    rows = []
    for team, cat, node, metric_hint, up in TEAM_MAP:
        target, soft_cap = CATEGORY_TARGETS.get(cat, (100.0, 300.0))
        value = pick_dashboard_value(ops_df.assign(Node=ops_df["Node"] if "Node" in ops_df.columns else ops_df["Category"]),
                                     node=node, metric_hint=metric_hint)
        score = soft_normalize(value if up else -value, target, soft_cap)

        # previous score (for past-self or rival seeding)
        prev_rows = league_df[(league_df["Team"] == team)]
        prev_score = float(prev_rows["Score"].iloc[-1]) if not prev_rows.empty else 0.0
        opp_score = make_opponent_score(mode, team, prev_score)

        result = "WIN" if score > opp_score else "LOSS" if score < opp_score else "DRAW"
        streak = "1W"
        if not prev_rows.empty:
            prev_res = prev_rows["Result"].iloc[-1]
            prev_streak = str(prev_rows["Streak"].iloc[-1]) if "Streak" in prev_rows.columns else ""
            n = int(prev_streak[:-1]) if prev_streak[:-1].isdigit() else 0
            if result == prev_res:
                n += 1
            else:
                n = 1
            streak = f"{n}{'W' if result=='WIN' else 'L' if result=='LOSS' else 'D'}"

        rows.append({
            "Team": team, "Category": cat, "Metric": node, "Week": week,
            "Score": round(score,2), "Prev_Week": round(prev_score,2),
            "Opponent": f"{team}_Rival" if mode=="rival" else f"{team}_Past",
            "Opponent_Score": round(opp_score,2), "Result": result, "Streak": streak
        })
    return pd.DataFrame(rows)

def print_matchday(df: pd.DataFrame, week: str):
    print(f"\n=== LEODUCT LEAGUE — {week} ===")
    wins = (df["Result"]=="WIN").sum()
    losses = (df["Result"]=="LOSS").sum()
    draws = (df["Result"]=="DRAW").sum()
    print(f"Record: {wins}W - {losses}L - {draws}D\n")
    for _, r in df.sort_values("Score", ascending=False).iterrows():
        emo = "🏆" if r.Result=="WIN" else "🔴" if r.Result=="LOSS" else "🟨"
        print(f"{emo} {r.Team:16}  {r.Score:6.1f}  vs {r.Opponent_Score:6.1f}  → {r.Result}  [{r.Streak}]")
    print()

def print_standings(league_df: pd.DataFrame):
    # Season standings by win rate; tie-breaker avg score
    agg = league_df.groupby("Team").agg(
        games=("Result","count"),
        wins=("Result", lambda s: (s=="WIN").sum()),
        losses=("Result", lambda s: (s=="LOSS").sum()),
        draws=("Result", lambda s: (s=="DRAW").sum()),
        avg_score=("Score","mean")
    ).reset_index()
    agg["win_pct"] = (agg["wins"] + 0.5*agg["draws"]) / agg["games"]
    print("=== Season Standings ===")
    for _, r in agg.sort_values(["win_pct","avg_score"], ascending=False).iterrows():
        print(f"{r.Team:16}  {r.wins}-{r.losses}-{r.draws}   win% {r.win_pct:.3f}   avg {r.avg_score:.1f}")
    print()

def write_html_leaderboard(league_df: pd.DataFrame, out_path: Path, week: str):
    latest = league_df[league_df["Week"]==week]
    season = league_df
    agg = season.groupby("Team").agg(wins=("Result", lambda s:(s=="WIN").sum()),
                                     losses=("Result", lambda s:(s=="LOSS").sum()),
                                     draws=("Result", lambda s:(s=="DRAW").sum()),
                                     avg_score=("Score","mean")).reset_index()
    agg["win_pct"] = (agg["wins"] + 0.5*agg["draws"]) / (agg["wins"]+agg["losses"]+agg["draws"])
    html = f"""<!doctype html><meta charset="utf-8"><title>LEODUCT League</title>
    <style>body{{font-family:system-ui;margin:24px;background:#0b0b0b;color:#f1f1f1}}
    h1,h2{{margin:0 0 12px}} table{{border-collapse:collapse;width:100%}}
    td,th{{border-bottom:1px solid #222;padding:8px}} .win{{color:#4ee94e}}
    .loss{{color:#ff6464}} .draw{{color:#f1c40f}}</style>
    <h1>LEODUCT League — {week}</h1>
    <h2>Matchday</h2>
    <table><tr><th>Team</th><th>Score</th><th>Opponent</th><th>Opp</th><th>Result</th><th>Streak</th></tr>
    {"".join(f"<tr><td>{r.Team}</td><td>{r.Score:.1f}</td><td>{r.Opponent}</td><td>{r.Opponent_Score:.1f}</td><td class='{('win' if r.Result=='WIN' else 'loss' if r.Result=='LOSS' else 'draw')}'>{r.Result}</td><td>{r.Streak}</td></tr>" for _,r in latest.iterrows())}
    </table>
    <h2>Season Standings</h2>
    <table><tr><th>Team</th><th>W</th><th>L</th><th>D</th><th>Win%</th><th>Avg Score</th></tr>
    {"".join(f"<tr><td>{r.Team}</td><td>{r.wins}</td><td>{r.losses}</td><td>{r.draws}</td><td>{r.win_pct:.3f}</td><td>{r.avg_score:.1f}</td></tr>" for _,r in agg.sort_values(['win_pct','avg_score'], ascending=False).iterrows())}
    </table>"""
    out_path.write_text(html, encoding="utf-8")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--week", default="auto", help="ISO week label e.g. 2025-W44, or 'auto'")
    ap.add_argument("--mode", default="rival", choices=["rival","past"], help="opponent mode")
    ap.add_argument("--html", action="store_true", help="emit leaderboard HTML")
    args = ap.parse_args()

    if not DASH_PATH.exists():
        sys.exit(f"Missing {DASH_PATH}. Create operations_dashboard.csv first.")

    ops_df = pd.read_csv(DASH_PATH)
    week = infer_week_label() if args.week == "auto" else args.week

    league_df = pd.read_csv(LEAGUE_PATH) if LEAGUE_PATH.exists() else pd.DataFrame(
        columns=["Team","Category","Metric","Week","Score","Prev_Week","Opponent","Opponent_Score","Result","Streak"]
    )

    new_rows = compute_scores(ops_df, week, league_df, args.mode)
    league_df = pd.concat([league_df, new_rows], ignore_index=True)
    league_df.to_csv(LEAGUE_PATH, index=False)

    print_matchday(new_rows, week)
    print_standings(league_df)

    if args.html:
        write_html_leaderboard(league_df, BOARD_HTML, week)
        print(f"HTML leaderboard → {BOARD_HTML}")

if __name__ == "__main__":
    main()
