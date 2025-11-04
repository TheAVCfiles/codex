"""Utilities for generating lightweight visualizations inside a notebook environment.

The helpers intentionally avoid seaborn so that the module works in minimal
Matplotlib-only environments."""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

__all__ = [
    "plot_equity_curve",
    "plot_ei_vs_future_returns",
    "plot_walkforward_sharpe",
    "plot_parameter_sharpe",
]


def _load_csv(path: str | Path | None, **read_csv_kwargs) -> pd.DataFrame | None:
    if not path:
        return None
    csv_path = Path(path)
    if not csv_path.exists():
        return None
    return pd.read_csv(csv_path, **read_csv_kwargs)


def plot_equity_curve(backtest_csv: str | Path | None) -> plt.Figure | None:
    """Plot the equity curve from a backtest CSV file."""
    df = _load_csv(backtest_csv, parse_dates=True, index_col=0)
    if df is None or "equity" not in df.columns:
        return None

    fig, ax = plt.subplots(figsize=(8, 4))
    ax.plot(df.index, df["equity"], color="#2643a2", linewidth=2)
    ax.set_title("Equity Curve")
    ax.set_xlabel("Time")
    ax.set_ylabel("Equity")
    fig.tight_layout()
    return fig


def plot_ei_vs_future_returns(
    features_csv: str | Path | None,
    horizon: int = 30,
    bins: int = 40,
) -> plt.Figure | None:
    """Visualize EI values against future returns using a 2D histogram."""
    df = _load_csv(features_csv, parse_dates=True, index_col=0)
    if df is None or {"EI", "price"}.difference(df.columns):
        return None

    df = df.copy()
    df["fut_ret"] = df["price"].pct_change(horizon).shift(-horizon)
    df = df.dropna(subset=["EI", "fut_ret"])
    if df.empty:
        return None

    heatmap, xedges, yedges = np.histogram2d(df["EI"], df["fut_ret"], bins=bins)

    fig, ax = plt.subplots(figsize=(6, 5))
    mesh = ax.imshow(
        heatmap.T,
        origin="lower",
        aspect="auto",
        interpolation="nearest",
        cmap="viridis",
    )
    ax.set_title("EI vs Future Returns Density")
    ax.set_xlabel("EI bins")
    ax.set_ylabel(f"Future returns bins (horizon={horizon})")
    fig.colorbar(mesh, ax=ax, label="Observations")
    fig.tight_layout()
    return fig


def plot_walkforward_sharpe(walk_csv: str | Path | None) -> plt.Figure | None:
    df = _load_csv(walk_csv)
    if df is None or {"fold", "test_sharpe"}.difference(df.columns):
        return None

    fig, ax = plt.subplots(figsize=(6, 4))
    ax.bar(df["fold"].astype(str), df["test_sharpe"], color="#00a896")
    ax.set_title("Walk-Forward Test Sharpe by Fold")
    ax.set_xlabel("Fold")
    ax.set_ylabel("Sharpe")
    ax.grid(axis="y", linestyle="--", alpha=0.3)
    fig.tight_layout()
    return fig


def plot_parameter_sharpe(sweep_csv: str | Path | None, top_n: int = 20) -> plt.Figure | None:
    df = _load_csv(sweep_csv)
    if df is None or "sharpe" not in df.columns:
        return None

    df = df.sort_values("sharpe", ascending=False).head(top_n)
    if df.empty:
        return None

    fig, ax = plt.subplots(figsize=(8, 4))
    ax.bar(np.arange(len(df)), df["sharpe"], color="#ff8c42")
    ax.set_title("Top Parameter Sets by Sharpe")
    ax.set_xlabel("Rank (best → worst)")
    ax.set_ylabel("Sharpe")
    ax.set_xticks(np.arange(len(df)))
    ax.set_xticklabels(np.arange(1, len(df) + 1))
    fig.tight_layout()
    return fig
