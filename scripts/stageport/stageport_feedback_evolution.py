"""Fine-tuning helper for StagePort feedback evolution workflows.

This module keeps feedback local in JSONL and can optionally fine-tune a local
causal language model using only MASTER-level, safe examples.
"""
from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

try:
    from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments

    TRANSFORMERS_AVAILABLE = True
except ImportError:  # pragma: no cover - optional runtime dependency
    TRANSFORMERS_AVAILABLE = False


@dataclass
class FeedbackExample:
    input_text: str
    target_text: str


class StagePortEvolutionEngine:
    def __init__(
        self,
        model_name: str = "gpt2",
        storage_path: str = "stageport_feedback.jsonl",
        output_dir: str = "stageport_checkpoints",
        master_threshold: float = 0.9,
    ) -> None:
        self.model_name = model_name
        self.storage_path = storage_path
        self.output_dir = output_dir
        self.master_threshold = master_threshold
        self.tokenizer = None
        self.model = None

    def collect_feedback(self, credentialed_item: Dict[str, Any]) -> None:
        """Append a single credentialed feedback item to local JSONL storage."""

        os.makedirs(os.path.dirname(self.storage_path) or ".", exist_ok=True)
        with open(self.storage_path, "a", encoding="utf-8") as handle:
            handle.write(json.dumps(credentialed_item, ensure_ascii=False) + "\n")

    def evolve(self, max_examples: Optional[int] = None, num_train_epochs: int = 1) -> Dict[str, Any]:
        """Fine-tune on MASTER-level, safe feedback and return a summary."""

        if not TRANSFORMERS_AVAILABLE:
            return {
                "status": "simulation_only",
                "reason": "transformers is not installed. Install via `pip install transformers datasets`.",
            }

        if not os.path.exists(self.storage_path):
            return {
                "status": "no_data",
                "reason": f"No feedback file found at {self.storage_path}.",
            }

        all_items: List[Dict[str, Any]] = []
        with open(self.storage_path, "r", encoding="utf-8") as handle:
            for line in handle:
                line = line.strip()
                if not line:
                    continue
                try:
                    all_items.append(json.loads(line))
                except json.JSONDecodeError:
                    continue

        filtered: List[Dict[str, Any]] = []
        for item in all_items:
            level = str(item.get("credential_level", "")).upper()
            sickle_flag = bool(item.get("sickle_flag", False))
            master_score = item.get("overall_score")

            if sickle_flag or level != "MASTER":
                continue
            if master_score is not None and master_score < self.master_threshold:
                continue
            filtered.append(item)

        if not filtered:
            return {
                "status": "no_master_data",
                "reason": "No MASTER-level, safe feedback found to train on.",
            }

        if max_examples is not None:
            filtered = filtered[:max_examples]

        examples: List[FeedbackExample] = []
        for item in filtered:
            prompt = item.get("original_prompt", "")
            guidance = item.get("original_guidance", "")
            correction = item.get("user_correction", "")
            improved = item.get("improved_guidance") or correction

            input_text = (
                "SYSTEM: STAGEPORT kinesthetic guidance persona.\n"
                f"ORIGINAL_PROMPT: {prompt}\n"
                f"ORIGINAL_GUIDANCE: {guidance}\n"
                f"USER_FEEDBACK: {correction}\n"
                "TASK: Rewrite guidance to be biomechanically safe, avoid sickling, "
                "and respect classical alignment.\n"
                "IMPROVED_GUIDANCE:"
            )
            examples.append(FeedbackExample(input_text=input_text, target_text=improved))

        if self.tokenizer is None:
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token

        if self.model is None:
            self.model = AutoModelForCausalLM.from_pretrained(self.model_name)

        class FeedbackDataset:
            def __init__(self, items: List[FeedbackExample], tokenizer, max_length: int = 512) -> None:
                self.items = items
                self.tokenizer = tokenizer
                self.max_length = max_length

            def __len__(self) -> int:
                return len(self.items)

            def __getitem__(self, idx: int) -> Dict[str, Any]:
                row = self.items[idx]
                full_text = f"{row.input_text} {row.target_text}"
                enc = self.tokenizer(
                    full_text,
                    truncation=True,
                    max_length=self.max_length,
                    padding="max_length",
                )
                input_ids = enc["input_ids"]
                return {
                    "input_ids": input_ids,
                    "attention_mask": enc["attention_mask"],
                    "labels": input_ids.copy(),
                }

        train_dataset = FeedbackDataset(examples, self.tokenizer)

        os.makedirs(self.output_dir, exist_ok=True)
        training_args = TrainingArguments(
            output_dir=self.output_dir,
            overwrite_output_dir=True,
            num_train_epochs=num_train_epochs,
            per_device_train_batch_size=1,
            gradient_accumulation_steps=4,
            learning_rate=5e-5,
            weight_decay=0.01,
            logging_steps=10,
            save_steps=50,
            save_total_limit=3,
            fp16=False,
            report_to=[],
        )

        trainer = Trainer(model=self.model, args=training_args, train_dataset=train_dataset)
        train_result = trainer.train()
        trainer.save_model(self.output_dir)
        self.tokenizer.save_pretrained(self.output_dir)

        return {
            "status": "ok",
            "trained_examples": len(examples),
            "output_dir": self.output_dir,
            "train_metrics": train_result.metrics,
        }
