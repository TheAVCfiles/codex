import os
import json
import io
import base64
import sys
import platform
import hashlib
from datetime import datetime, timezone
import argparse

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from narrative_engine import NarrativeBundle, NarrativeTransliterator

try:
    from jinja2 import Template
    JINJA_OK = True
except Exception:
    JINJA_OK = False

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    from reportlab.lib.utils import ImageReader
    REPORTLAB_OK = True
except Exception:
    REPORTLAB_OK = False


def _b64_png(fig: plt.Figure) -> str:
    """Render a Matplotlib figure to a base64-encoded PNG string."""
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")


def _chart_equity(backtest_csv: str | os.PathLike | None) -> str | None:
    if not backtest_csv:
        return None
    bt = pd.read_csv(backtest_csv, parse_dates=True, index_col=0)
    fig = plt.figure()
    plt.plot(bt.index, bt["equity"])
    plt.title("Equity Curve")
    plt.xlabel("time")
    plt.ylabel("equity")
    return _b64_png(fig)


def _chart_ei_heatmap(features_csv: str | os.PathLike | None) -> str | None:
    if not features_csv:
        return None
    df = pd.read_csv(features_csv, parse_dates=True, index_col=0)
    if "EI" not in df.columns:
        return None

    df["fut_ret"] = df["price"].pct_change(30).shift(-30)
    df = df.dropna(subset=["EI", "fut_ret"])

    H, xedges, yedges = np.histogram2d(df["EI"], df["fut_ret"], bins=40)
    fig = plt.figure()
    plt.imshow(H.T, origin="lower", aspect="auto")
    plt.title("EI vs 30-min Future Returns (density)")
    plt.xlabel("EI bins")
    plt.ylabel("Future returns bins")
    return _b64_png(fig)


def _chart_walkforward(walk_csv: str | os.PathLike | None) -> tuple[str | None, pd.DataFrame | None]:
    if not walk_csv:
        return None, None
    wf = pd.read_csv(walk_csv)
    fig = plt.figure()
    if {"test_sharpe", "fold"}.issubset(wf.columns):
        plt.bar(wf["fold"].astype(str), wf["test_sharpe"])
        plt.title("Walk-Forward Test Sharpe by Fold")
        plt.xlabel("fold")
        plt.ylabel("Sharpe")
    else:
        plt.text(0.1, 0.5, "Walk-forward file lacks expected columns", fontsize=10)
        plt.axis("off")
    return _b64_png(fig), wf


def _chart_params(sweep_csv: str | os.PathLike | None) -> tuple[str | None, dict | None, list | None]:
    if not sweep_csv:
        return None, None, None
    sw = pd.read_csv(sweep_csv)
    sw = sw.sort_values("sharpe", ascending=False)
    top = sw.head(1).to_dict(orient="records")
    table = sw.head(20).to_dict(orient="records")

    x = np.arange(len(sw.head(20)))
    fig = plt.figure()
    plt.bar(x, sw.head(20)["sharpe"])
    plt.title("Top Parameter Sets by Sharpe")
    plt.xlabel("rank (best→worst)")
    plt.ylabel("Sharpe")
    return _b64_png(fig), (top[0] if top else None), table


def _compute_metrics(backtest_csv: str | os.PathLike | None) -> dict:
    if not backtest_csv:
        return {}
    bt = pd.read_csv(backtest_csv, parse_dates=True, index_col=0)
    eq = bt["equity"]

    cum_return = float(eq.iloc[-1] / eq.iloc[0] - 1)
    returns = bt["equity"].pct_change().fillna(0)
    sharpe = float((returns.mean() / (returns.std(ddof=0) + 1e-12)) * (252 * 6.5 * 60) ** 0.5)
    maxdd = float((eq / eq.cummax() - 1).min())
    cagr = float((eq.iloc[-1] / eq.iloc[0]) ** (252 * 6.5 * 60 / len(eq)) - 1) if len(eq) > 0 else 0.0
    return dict(cum_return=cum_return, sharpe=sharpe, max_drawdown=maxdd, cagr=cagr)


def _env_info() -> dict:
    import pkgutil

    return dict(
        python=sys.version.split()[0],
        platform=platform.platform(),
        packages=sorted([m.name for m in pkgutil.iter_modules()]),
    )


def _hash_config(path: str | os.PathLike | None) -> str:
    if not path:
        return "no-config"
    try:
        with open(path, "rb") as f:
            return hashlib.sha256(f.read()).hexdigest()[:12]
    except Exception:
        return "no-config"


def _load_transits(transits_csv: str | os.PathLike | None) -> pd.DataFrame | None:
    if not transits_csv:
        return None
    try:
        return pd.read_csv(transits_csv, parse_dates=["start", "end"])
    except Exception:
        return None


def _build_narrative_bundle(
    metrics: dict,
    best: dict | None,
    wf_df: pd.DataFrame | None,
    transits: pd.DataFrame | None,
    profile: dict | None,
    interface_channels: list[str] | None,
) -> NarrativeBundle:
    transliterator = NarrativeTransliterator.from_dict(
        profile_data=profile,
        interface_channels=interface_channels,
    )
    return transliterator.compose(metrics, best, wf_df, transits)


def generate_report(
    feat_path: str | os.PathLike | None = None,
    backtest_path: str | os.PathLike | None = None,
    sweep_path: str | os.PathLike | None = None,
    walkforward_path: str | os.PathLike | None = None,
    output_html: str = "koll_report.html",
    output_pdf: str | None = None,
    title: str = "KOLL Strategy Report",
    narrative: bool = False,
    narrative_profile: dict | None = None,
    narrative_interface_channels: list[str] | None = None,
    log_history: bool = True,
    config_path: str | os.PathLike | None = None,
    astrology_enabled: bool = False,
    transits_csv: str | os.PathLike | None = None,
    author: str = "Allison Van Cura",
) -> dict:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    metrics = _compute_metrics(backtest_path)
    equity_img = _chart_equity(backtest_path)
    ei_img = _chart_ei_heatmap(feat_path)

    wf_img, wf_df = _chart_walkforward(walkforward_path)
    params_img, top_params, params_table = _chart_params(sweep_path)

    transits = _load_transits(transits_csv) if astrology_enabled else None
    narrative_bundle = (
        _build_narrative_bundle(
            metrics=metrics,
            best=top_params,
            wf_df=wf_df,
            transits=transits,
            profile=narrative_profile,
            interface_channels=narrative_interface_channels,
        )
        if narrative
        else None
    )
    narrative_txt = narrative_bundle.body if narrative_bundle else ""

    history_item = dict(
        timestamp=now,
        title=title,
        config_hash=_hash_config(config_path),
        metrics=metrics,
        best_params=top_params,
        walkforward_summary=(wf_df.describe().to_dict() if wf_df is not None else None),
        narrative=narrative_bundle.to_dict() if narrative_bundle else None,
        outputs=dict(html=output_html, pdf=output_pdf),
        env=_env_info(),
    )

    tpl_path = os.path.join(os.path.dirname(__file__), "templates", "executive.html")
    if os.path.exists(tpl_path) and JINJA_OK:
        from jinja2 import Template

        with open(tpl_path, "r", encoding="utf-8") as f:
            tpl = Template(f.read())
        html = tpl.render(
            title=title,
            timestamp=now,
            metrics=metrics,
            equity_img=equity_img,
            ei_img=ei_img,
            params_img=params_img,
            wf_img=wf_img,
            top_params=top_params,
            params_table=params_table,
            narrative=narrative_txt,
            narrative_bundle=narrative_bundle.to_dict() if narrative_bundle else None,
            author=author,
        )
    else:
        html = f"""
        <html><head><meta charset='utf-8'><title>{title}</title></head>
        <body style='font-family:Arial, sans-serif;'>
        <h1>{title}</h1><p><em>{now}</em></p>
        <h2>Summary</h2>
        <pre>{json.dumps(metrics, indent=2)}</pre>
        {f'<img src="data:image/png;base64,{equity_img}"/>' if equity_img else ''}
        {f'<img src="data:image/png;base64,{ei_img}"/>' if ei_img else ''}
        {f'<img src="data:image/png;base64,{params_img}"/>' if params_img else ''}
        {f'<img src="data:image/png;base64,{wf_img}"/>' if wf_img else ''}
        <h3>Narrative</h3><p>{narrative_txt}</p>
        {('<h4>' + narrative_bundle.headline + '</h4>') if narrative_bundle else ''}
        {('<pre>' + json.dumps(narrative_bundle.to_dict(), indent=2) + '</pre>') if narrative_bundle else ''}
        <hr/><p>Prepared by {author} — Generated by KOLL Research Engine</p>
        </body></html>
        """

    out_dir = os.path.dirname(output_html) or "."
    os.makedirs(out_dir, exist_ok=True)
    with open(output_html, "w", encoding="utf-8") as f:
        f.write(html)

    if output_pdf and REPORTLAB_OK:
        c = canvas.Canvas(output_pdf, pagesize=letter)
        width, height = letter

        c.setFont("Helvetica-Bold", 16)
        c.drawString(72, height - 72, title)
        c.setFont("Helvetica", 10)
        c.drawString(72, height - 88, now)

        y = height - 120
        for key in ["cum_return", "sharpe", "max_drawdown", "cagr"]:
            if key in metrics:
                c.drawString(72, y, f"{key}: {metrics[key]:.4f}")
                y -= 12

        def draw_img(b64: str | None, y_start: float) -> float:
            if not b64:
                return y_start
            img = ImageReader(io.BytesIO(base64.b64decode(b64)))
            iw, ih = img.getSize()
            scale = (width - 100) / iw
            nh = ih * scale
            if y_start - nh < 72:
                c.showPage()
                y_start = height - 72
            c.drawImage(img, 50, y_start - nh, width=(width - 100), height=nh)
            return y_start - nh - 24

        y -= 24
        for b64 in [equity_img, ei_img, params_img, wf_img]:
            y = draw_img(b64, y)

        c.showPage()
        c.setFont("Helvetica", 11)
        c.drawString(72, height - 100, f"Prepared by {author} — Generated by KOLL Research Engine")
        c.drawString(72, height - 120, f"Environment: Python {history_item['env']['python']} on {history_item['env']['platform']}")
        c.drawString(72, height - 140, f"Config: {history_item['config_hash']}")
        if narrative_bundle:
            c.drawString(72, height - 160, narrative_bundle.headline[:80])
        else:
            c.drawString(72, height - 160, "Tagline: Decrypting Attention into Alpha.")
        c.save()

    if log_history:
        hist_path = os.path.join(os.path.dirname(output_html), "..", "reports", "history.json")
        try:
            os.makedirs(os.path.dirname(hist_path), exist_ok=True)
            if os.path.exists(hist_path):
                with open(hist_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
            else:
                data = []
            data.append(history_item)
            with open(hist_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as exc:  # pragma: no cover - best effort logging
            print("Warning: failed to log history:", exc)

    return dict(html=output_html, pdf=output_pdf or None, metrics=metrics)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="./koll_config.yaml")
    parser.add_argument("--narrative", action="store_true")
    parser.add_argument("--title", default="KOLL Strategy Report")
    parser.add_argument("--html", default=None)
    parser.add_argument("--pdf", default=None)
    parser.add_argument("--astrology", action="store_true")
    parser.add_argument("--transits_csv", default=None)
    args = parser.parse_args()

    out_html = args.html
    out_pdf = args.pdf
    if out_html is None or out_pdf is None:
        try:
            import yaml

            with open(args.config, "r", encoding="utf-8") as f:
                cfg = yaml.safe_load(f)
            folder = cfg.get("outputs", {}).get("folder", "./outputs")
            os.makedirs(folder, exist_ok=True)
            if out_html is None:
                out_html = os.path.join(folder, "koll_report.html")
            if out_pdf is None:
                out_pdf = os.path.join(folder, "koll_report.pdf")
        except Exception:
            os.makedirs("./outputs", exist_ok=True)
            out_html = out_html or "./outputs/koll_report.html"
            out_pdf = out_pdf or "./outputs/koll_report.pdf"

    folder = os.path.dirname(out_html)
    feat = os.path.join(folder, "features.csv")
    bt = os.path.join(folder, "backtest.csv")
    sweep = os.path.join(folder, "sweep_results.csv")
    walk = os.path.join(folder, "walk_results.csv")

    generate_report(
        feat_path=feat if os.path.exists(feat) else None,
        backtest_path=bt if os.path.exists(bt) else None,
        sweep_path=sweep if os.path.exists(sweep) else None,
        walkforward_path=walk if os.path.exists(walk) else None,
        output_html=out_html,
        output_pdf=out_pdf,
        title=args.title,
        narrative=args.narrative,
        config_path=args.config,
        astrology_enabled=args.astrology,
        transits_csv=args.transits_csv,
    )


if __name__ == "__main__":
    main()
