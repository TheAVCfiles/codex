"""
scripts/make_figures.py
Creates vector-friendly PDFs for LaTeX in ./figures
"""

import os

import matplotlib.pyplot as plt
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FIG_DIR = os.path.join(ROOT, "figures")
os.makedirs(FIG_DIR, exist_ok=True)


def ssi_curve():
    x = np.linspace(-6, 6, 400)
    y = 10.0 * (1.0 / (1.0 + np.exp(-x)))
    plt.figure(figsize=(6.2, 3.6))
    plt.plot(x, y, linewidth=2)
    plt.ylim(0, 10)
    plt.grid(True, alpha=0.25)
    plt.title("SSI Logistic Bounding Function")
    plt.xlabel("Normalized Weighted Alignment")
    plt.ylabel("SSI (0–10)")
    plt.tight_layout()
    plt.savefig(os.path.join(FIG_DIR, "ssi_curve.pdf"))
    plt.close()


def fsm_thresholds():
    ssi = np.linspace(0, 10, 400)
    region = np.where(ssi < 5.0, 0, np.where(ssi < 7.5, 1, 2))
    plt.figure(figsize=(6.2, 3.6))
    plt.plot(ssi, region, linewidth=2)
    plt.yticks([0, 1, 2], ["FAULT", "STRESS", "ACTIVE"])
    plt.grid(True, alpha=0.25)
    plt.title("FSM Threshold Regions")
    plt.xlabel("SSI")
    plt.ylabel("State")
    plt.tight_layout()
    plt.savefig(os.path.join(FIG_DIR, "fsm_thresholds.pdf"))
    plt.close()


def invariant_drift():
    rng = np.random.default_rng(42)
    a_vals = rng.normal(0.85, 0.03, 250)
    b_vals = rng.normal(0.65, 0.08, 250)
    c_vals = rng.normal(0.90, 0.02, 250)
    plt.figure(figsize=(6.2, 3.6))
    plt.boxplot([a_vals, b_vals, c_vals], labels=["Invariant A", "Invariant B", "Invariant C"])
    plt.title("Invariant Drift Detection (Illustrative)")
    plt.ylabel("Alignment Distribution")
    plt.grid(True, axis="y", alpha=0.25)
    plt.tight_layout()
    plt.savefig(os.path.join(FIG_DIR, "invariant_drift.pdf"))
    plt.close()


if __name__ == "__main__":
    ssi_curve()
    fsm_thresholds()
    invariant_drift()
    print("Wrote figures to:", FIG_DIR)
