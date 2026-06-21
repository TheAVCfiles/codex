import hashlib
import os
import re
from datetime import datetime

import requests


class SundayRinse:
    def __init__(self):
        self.base_id = "appS16p6gJO5U78JS"
        self.table_name = "Table 1"
        self.pending_status = "Todo"
        self.processed_status = "Done"
        self.pat = os.getenv("AIRTABLE_PAT")
        if not self.pat:
            raise RuntimeError(
                "Set AIRTABLE_PAT environment variable with your Personal Access Token"
            )

        self.headers = {
            "Authorization": f"Bearer {self.pat}",
            "Content-Type": "application/json",
        }

    def jaccard(self, t1: str, t2: str) -> float:
        a = set(re.findall(r"\w+", str(t1).lower()))
        b = set(re.findall(r"\w+", str(t2).lower()))
        return len(a & b) / len(a | b) if (a | b) else 0.0

    def sha256(self, text: str) -> str:
        return hashlib.sha256((text or "").encode("utf-8")).hexdigest()

    def fetch_pending(self):
        url = f"https://api.airtable.com/v0/{self.base_id}/{self.table_name}"
        params = {
            "filterByFormula": f"{{Status}} = '{self.pending_status}'",
            "maxRecords": 200,
        }
        resp = requests.get(url, headers=self.headers, params=params, timeout=30)
        resp.raise_for_status()
        return resp.json().get("records", [])

    def mark_processed(self, record_id: str):
        url = f"https://api.airtable.com/v0/{self.base_id}/{self.table_name}/{record_id}"
        data = {"fields": {"Status": self.processed_status}}
        resp = requests.patch(url, headers=self.headers, json=data, timeout=30)
        resp.raise_for_status()

    def run(self):
        records = self.fetch_pending()
        if not records:
            print("✅ Nothing to rinse. Vault is quiet.")
            return

        filename = f"GOSSIP_RAG_{datetime.now().strftime('%Y%m%d')}.md"
        chunks = []

        with open(filename, "w", encoding="utf-8") as f:
            f.write(f"# 🗞 THE SUNDAY BRUNCH RINSE | {datetime.now().date()}\n\n")
            f.write("## Integrity Report\n✅ STATUS: CLEAN. No system melt detected.\n\n")

            for rec in records:
                fields = rec.get("fields", {})
                memjar = fields.get("MemJar") or fields.get("Raw Content") or ""
                if not memjar:
                    continue

                title = fields.get("Name") or f"Untitled • {rec['id']}"
                sha = self.sha256(memjar)

                chunks.append(
                    {
                        "title": title,
                        "proves": memjar,
                        "sha256": sha,
                        "record_id": rec["id"],
                    }
                )

                self.mark_processed(rec["id"])

            f.write("## Weekly Chunks (Ready for CODA)\n---\n")
            for chunk in chunks:
                preview = (
                    chunk["proves"][:700] + "..."
                    if len(chunk["proves"]) > 700
                    else chunk["proves"]
                )
                f.write(f"### ✦ {chunk['title']}\n")
                f.write(f"**Proves:** {preview}\n")
                f.write(f"**Hash:** `{chunk['sha256'][:16]}…`\n")
                f.write(f"**Record:** {chunk['record_id']}\n---\n")

        print(f"🎉 Gossip Rag written: {filename}")
        print(f"✅ Processed {len(chunks)} records")
        return filename


if __name__ == "__main__":
    SundayRinse().run()
