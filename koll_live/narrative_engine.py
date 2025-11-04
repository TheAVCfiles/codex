"""Narrative transliteration utilities for transforming metrics into immersive copy."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Iterable, Sequence

import pandas as pd


def _as_percent(value: float | None, digits: int = 1) -> str:
    if value is None:
        return "n/a"
    return f"{value * 100:.{digits}f}%"


def _safe_float(value: float | None) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


@dataclass(slots=True)
class NarrativeProfile:
    """User-facing profile describing tone and experiential preferences."""

    persona_name: str = "Explorer"
    intention: str = "clarity"
    sensory_modes: list[str] = field(
        default_factory=lambda: ["visual", "auditory", "kinesthetic"]
    )
    spiritual_theme: str = "alignment"
    affirmations: list[str] = field(
        default_factory=lambda: [
            "Each market rhythm mirrors a breath of the universe.",
            "My strategy and intuition travel as one path.",
        ]
    )


@dataclass(slots=True)
class NarrativeBundle:
    """Structured output for multi-sensory narrative content."""

    headline: str
    body: str
    sensory_prompts: list[str]
    interface_cues: list[str]
    affirmations: list[str]

    def to_dict(self) -> dict:
        return dict(
            headline=self.headline,
            body=self.body,
            sensory_prompts=list(self.sensory_prompts),
            interface_cues=list(self.interface_cues),
            affirmations=list(self.affirmations),
        )


class NarrativeTransliterator:
    """Convert quantitative outputs into narrative suited for experiential interfaces."""

    def __init__(self, profile: NarrativeProfile, interface_channels: Sequence[str] | None = None) -> None:
        self.profile = profile
        self.interface_channels = list(interface_channels or [])

    @classmethod
    def from_dict(
        cls,
        profile_data: dict | None = None,
        interface_channels: Sequence[str] | None = None,
    ) -> "NarrativeTransliterator":
        profile = NarrativeProfile(**profile_data) if profile_data else NarrativeProfile()
        return cls(profile=profile, interface_channels=interface_channels)

    def compose(
        self,
        metrics: dict,
        best_params: dict | None,
        walkforward: pd.DataFrame | None,
        transits: pd.DataFrame | None,
    ) -> NarrativeBundle:
        sr = _safe_float(metrics.get("sharpe"))
        drawdown = _safe_float(metrics.get("max_drawdown"))
        cum_return = _safe_float(metrics.get("cum_return"))

        emotional_color = self._sharpe_frame(sr)
        dd_frame = "steady" if drawdown > -0.15 else "cautious" if drawdown > -0.3 else "defensive"
        growth_phrase = self._growth_phrase(cum_return)

        headline = f"{self.profile.persona_name} Journey — {emotional_color} Momentum"

        body_parts: list[str] = [
            f"Sharpe settled at {sr:.2f}, inviting a {emotional_color.lower()} confidence that pairs data integrity with intuitive pacing.",
            f"Drawdown dynamics registered {_as_percent(drawdown, 1)}, keeping the risk posture {dd_frame}.",
            f"Total equity expansion of {_as_percent(cum_return, 1)} forms the grounding for {growth_phrase}.",
        ]

        if best_params:
            body_parts.append(
                "Signal alchemy emphasized "
                f"low_q={best_params.get('low_q')} and high_q={best_params.get('high_q')} "
                f"with cooldown={best_params.get('cooldown')}, shaping the cadence your interface can translate into haptic breaths."
            )

        if walkforward is not None and "test_sharpe" in walkforward.columns:
            wf_mean = walkforward["test_sharpe"].mean()
            body_parts.append(
                f"Walk-forward harmonics averaged {wf_mean:.2f}, anchoring the experience across iterative learning loops."
            )

        transit_prompts = self._transit_prompts(transits)
        body_parts.extend(transit_prompts)

        sensory_prompts = self._build_sensory_prompts(emotional_color)
        interface_cues = self._build_interface_cues(dd_frame)

        return NarrativeBundle(
            headline=headline,
            body=" ".join(body_parts),
            sensory_prompts=sensory_prompts,
            interface_cues=interface_cues,
            affirmations=list(self.profile.affirmations),
        )

    def _sharpe_frame(self, sharpe: float) -> str:
        if sharpe >= 1.5:
            return "Radiant"
        if sharpe >= 1.1:
            return "Centered"
        if sharpe >= 0.6:
            return "Introspective"
        return "Recalibrating"

    def _growth_phrase(self, cum_return: float) -> str:
        if cum_return >= 0.5:
            return "expansive manifestation"
        if cum_return >= 0.2:
            return "measured flourishing"
        if cum_return >= 0.0:
            return "reflective consolidation"
        return "shadow-work realignment"

    def _transit_prompts(self, transits: pd.DataFrame | None) -> Iterable[str]:
        if transits is None or transits.empty:
            return []
        prompts: list[str] = []
        for _, row in transits.head(3).iterrows():
            label = row.get("label") or "Transit"
            prompts.append(
                f"Astro-transit cue: {label} layers a spiritual resonance channel — invite the user to pause and log sensations."
            )
        if len(transits) > 3:
            prompts.append("Additional transit windows available for deeper sequencing.")
        return prompts

    def _build_sensory_prompts(self, emotional_color: str) -> list[str]:
        prompts: list[str] = []
        for mode in self.profile.sensory_modes:
            if mode.lower() == "visual":
                prompts.append(
                    f"Visualize a {emotional_color.lower()} gradient flowing with each equity swing; overlay constellations at transit timestamps."
                )
            elif mode.lower() == "auditory":
                prompts.append(
                    "Trigger a soft binaural chime when Sharpe trends upward, modulating pitch with realized volatility."
                )
            elif mode.lower() == "kinesthetic":
                prompts.append(
                    "Deliver a subtle palm vibration synced to cooldown intervals, signaling embodied decision resets."
                )
            else:
                prompts.append(
                    f"Channel {mode} feedback to mirror cumulative return arcs, translating numbers into felt resonance."
                )
        return prompts

    def _build_interface_cues(self, dd_frame: str) -> list[str]:
        cues: list[str] = []
        for channel in self.interface_channels:
            if channel.lower() in {"voice", "speech"}:
                cues.append(
                    "Offer a guided mantra when drawdown widens: breathe in strategy, breathe out tension."
                )
            elif channel.lower() in {"touch", "haptics"}:
                cues.append("Introduce a grounding tap pattern when risk posture shifts to defensive.")
            elif channel.lower() in {"ar", "vr"}:
                cues.append(
                    "Sweep glowing particles across the field of view as new walk-forward cycles confirm resilience."
                )
            else:
                cues.append(
                    f"Map the {channel} channel to the {dd_frame} state, blending analytic state-changes with ritual prompts."
                )
        if not cues:
            cues.append("Encourage breath-led check-ins whenever the interface signals a structural shift in the data.")
        return cues

