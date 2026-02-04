#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/quick_save_actions.sh [options]

Quickly collect GitHub Actions run metadata and logs, and optionally rerun
failed/action_required workflows.

Options:
  -r, --repo OWNER/REPO   Repository to query (default: current gh repo).
  -o, --out DIR           Output directory (default: ./action_logs).
  -l, --limit N           Number of runs to fetch (default: 50).
  --rerun                 Rerun failed/action_required runs after saving logs.
  --status STATUS         Filter by status (can be repeated). Defaults to:
                          action_required,failed,cancelled
  -h, --help              Show this help message.

Examples:
  scripts/quick_save_actions.sh --limit 30 --out ./action_logs
  scripts/quick_save_actions.sh --repo org/repo --rerun
USAGE
}

repo=""
out_dir="action_logs"
limit=50
rerun=false
status_filters=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    -r|--repo)
      repo="$2"
      shift 2
      ;;
    -o|--out)
      out_dir="$2"
      shift 2
      ;;
    -l|--limit)
      limit="$2"
      shift 2
      ;;
    --rerun)
      rerun=true
      shift
      ;;
    --status)
      status_filters+=("$2")
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
 done

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI is required but not found in PATH." >&2
  exit 1
fi
if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required but not found in PATH." >&2
  exit 1
fi

if [[ ${#status_filters[@]} -eq 0 ]]; then
  status_filters=("action_required" "failed" "cancelled")
fi

mkdir -p "$out_dir"

repo_args=()
if [[ -n "$repo" ]]; then
  repo_args=("-R" "$repo")
fi

json_output="$out_dir/runs.json"
log_dir="$out_dir/logs"
meta_dir="$out_dir/metadata"
mkdir -p "$log_dir" "$meta_dir"

echo "Fetching up to $limit runs..."

status_json=$(printf '%s\n' "${status_filters[@]}" | jq -R . | jq -s .)

if ! gh run list "${repo_args[@]}" --limit "$limit" --json databaseId,status,conclusion,workflowName,displayTitle,createdAt,updatedAt,htmlURL --jq \
  "map(select(.status != null))" | jq --argjson statuses "$status_json" \
  'map(select(.status as $s | $statuses | index($s)))' > "$json_output"; then
  echo "Error: failed to list runs. Ensure you are authenticated with 'gh auth login'." >&2
  exit 1
fi

run_ids=$(jq -r '.[].databaseId' "$json_output")

if [[ -z "$run_ids" ]]; then
  echo "No runs found."
  exit 0
fi

for run_id in $run_ids; do
  run_meta="$meta_dir/$run_id.json"
  run_log="$log_dir/$run_id.log"

  echo "Saving metadata for run $run_id..."
  gh run view "$run_id" "${repo_args[@]}" --json \
    databaseId,status,conclusion,workflowName,displayTitle,createdAt,updatedAt,event,headBranch,headSha,htmlURL > "$run_meta"

  echo "Saving log for run $run_id..."
  gh run view "$run_id" "${repo_args[@]}" --log > "$run_log" || \
    echo "Warning: unable to fetch logs for run $run_id" >&2

  if [[ "$rerun" == true ]]; then
    run_status=$(jq -r '.status' "$run_meta")
    run_conclusion=$(jq -r '.conclusion' "$run_meta")

    if [[ "$run_status" == "action_required" || "$run_conclusion" == "failure" ]]; then
      echo "Re-running run $run_id..."
      gh run rerun "$run_id" "${repo_args[@]}" || \
        echo "Warning: unable to rerun run $run_id" >&2
    fi
  fi
 done

echo "Done. Logs saved to $out_dir"
