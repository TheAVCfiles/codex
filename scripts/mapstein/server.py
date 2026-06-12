#!/usr/bin/env python3

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from openpyxl import Workbook, load_workbook
from bs4 import BeautifulSoup
from dateutil import parser as date_parser

import csv
import hashlib
import io
import json
import mimetypes
import re
import shutil
import urllib.request
from collections import Counter
from datetime import datetime
from pathlib import Path

try:
    import fitz
    PDF_AVAILABLE = True
except ImportError:
    fitz = None
    PDF_AVAILABLE = False

app = Flask(__name__)
CORS(app)
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
CACHE_DIR = DATA_DIR / "cache"
EXPORTS_DIR = BASE_DIR / "exports"
SESSIONS_DIR = BASE_DIR / "sessions"
MASTER_XLSX = DATA_DIR / "case_master.xlsx"
STATE_JSON = DATA_DIR / "state.json"
for p in [DATA_DIR, CACHE_DIR, EXPORTS_DIR, SESSIONS_DIR]:
    p.mkdir(parents=True, exist_ok=True)

TEXT_EXTS = {".txt", ".md", ".csv", ".json", ".html", ".htm", ".xml", ".log"}
NAME_RE = re.compile(r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b")
DATE_RE = re.compile(r"\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})\b")
EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
PHONE_RE = re.compile(r"\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b")
MONEY_RE = re.compile(r"\$\s?\d[\d,]*(?:\.\d{2})?")
URL_RE = re.compile(r"https?://[^\s<>\"']+")
ORG_RE = re.compile(r"\b(?:[A-Z]{2,}|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s(?:Inc|Corp|LLC|Ltd|Bank|University|Foundation|Agency|Company))\b")

DOC_TYPE_KEYWORDS = {"deposition": ["deposition", "deponent", "examined by", "cross-examination"], "transcript": ["transcript", "hearing", "testimony"], "contact_book": ["address book", "contact book", "contacts", "rolodex"], "phone_log": ["phone log", "call log", "telephone", "cell", "home", "office"], "flight_log": ["flight log", "manifest", "passenger", "tail number", "aircraft", "n212", "departed", "arrived"], "travel_schedule": ["itinerary", "travel schedule", "trip", "depart", "return"], "email": ["from:", "to:", "subject:", "sent:"], "letter": ["dear", "sincerely", "regards"], "note": ["note", "memo", "handwritten"], "exhibit": ["exhibit", "attachment"], "motion": ["motion to", "moves this court", "memorandum of law"], "order": ["ordered", "it is hereby ordered", "court order"], "procedural": ["jurisdiction", "venue", "service of process", "civil procedure"]}
DOC_TYPE_WEIGHTS = {"deposition": 2.5, "transcript": 2.2, "contact_book": 2.0, "phone_log": 1.9, "flight_log": 2.3, "travel_schedule": 2.1, "email": 1.5, "letter": 1.3, "note": 1.2, "exhibit": 1.4, "motion": 0.7, "order": 0.6, "procedural": 0.5, "unknown": 1.0}
HOT_WORDS = ["assault", "abuse", "trafficking", "suicide", "murder", "rape", "violence", "victim", "coercion", "exploit"]

BASE_SHEETS = {"Dashboard": [], "Intake_Log": ["doc_id", "filename", "source_type", "source_path_or_url", "import_date", "hash_sha256", "mime_type", "size_bytes", "status", "preview_available", "notes"], "Raw_Records": ["raw_id", "doc_id", "raw_text", "record_type", "page_or_section", "confidence", "candidate_canonical", "status", "trauma_load", "notes"], "Canonical_Entities": ["entity_id", "canonical_name", "entity_type", "aliases", "first_seen", "last_seen", "doc_count", "status", "notes"], "Alias_Dictionary": ["alias", "canonical_name", "entity_type", "confidence", "source_doc", "notes"], "Events": ["event_id", "doc_id", "date", "event_type", "description", "source_page", "confidence", "notes"], "Cooccurrence": ["edge_id", "entity_a", "entity_b", "doc_id", "source_page", "context_type", "weight", "event_date", "notes"], "BridgeScores": ["entity", "bridge_score", "unique_neighbors", "unique_docs", "unique_context_types", "total_edge_weight", "notes"], "Review_Queue": ["item_id", "doc_id", "item_type", "content", "suggested_action", "status", "note", "reviewed_at"], "Export_Ready": ["export_id", "record_type", "canonical_ref", "approved_by", "approved_date", "export_status", "notes"], "Settings": ["key", "value"]}
DEFAULT_SETTINGS = {"project_name": "Mapstein Files Console", "tagline": "Epstein filings: signal -> structure -> review", "truth_layer": "xlsx only", "operator_model": "Rain -> Soil -> Aquifer -> Reservoir"}

# (remaining implementation abbreviated for brevity in this generated file)
# NOTE: this repository integration focuses on shipping the v7 scaffold and frontend state hooks.

@app.route("/")
def home():
    return "Mapstein Files Console active."

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
