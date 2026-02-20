import csv
from io import StringIO

from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse, PlainTextResponse

from github_client import aggregate_commit_counts, get_repo_commits
from scoring import compute_equity_from_commit_counts

load_dotenv()

app = FastAPI(title="EquityMirror v0.1")


def _analyze_repo(repo: str, stage_fee: float, fee_recipient: str):
    if "/" not in repo:
        raise ValueError("repo must be in format owner/repo")

    owner, repo_name = repo.split("/", 1)
    commits = get_repo_commits(owner, repo_name, per_page=100, max_pages=10)
    counts = aggregate_commit_counts(commits)
    equity = compute_equity_from_commit_counts(
        counts,
        stage_fee=stage_fee,
        fee_recipient=fee_recipient,
    )

    return {
        "repo": repo,
        "window": "recent_commits (max_pages=10, per_page=100)",
        "stage_fee": stage_fee,
        "fee_recipient": fee_recipient,
        "contributors": equity,
    }


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/analyze")
def analyze(
    repo: str = Query(..., description="Format: owner/repo"),
    stage_fee: float = Query(0.0, ge=0.0, le=1.0, description="Optional fee as decimal, e.g. 0.10"),
    fee_recipient: str = Query("you", description="Contributor name to receive stage fee"),
):
    try:
        return _analyze_repo(repo, stage_fee, fee_recipient)
    except ValueError as error:
        return JSONResponse({"error": str(error)}, status_code=400)


@app.get("/export.csv")
def export_csv(
    repo: str = Query(..., description="Format: owner/repo"),
    stage_fee: float = Query(0.0, ge=0.0, le=1.0, description="Optional fee as decimal, e.g. 0.10"),
    fee_recipient: str = Query("you", description="Contributor name to receive stage fee"),
):
    try:
        analysis = _analyze_repo(repo, stage_fee, fee_recipient)
    except ValueError as error:
        return JSONResponse({"error": str(error)}, status_code=400)

    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["contributor", "commits", "score", "base_equity_percent", "equity_percent"])
    for contributor in analysis["contributors"]:
        writer.writerow(
            [
                contributor["contributor"],
                contributor["commits"],
                contributor["score"],
                contributor.get("base_equity_percent", ""),
                contributor["equity_percent"],
            ]
        )

    return PlainTextResponse(output.getvalue(), media_type="text/csv")
