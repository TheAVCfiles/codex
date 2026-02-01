"""
FastAPI service for offline chat pattern scanning.
Provides paid API access to pattern_scan.py analysis capabilities.
"""
import os
import tempfile
import shutil
import csv
import io
from pathlib import Path
from typing import Optional, List
import logging

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel, Field
import stripe

# Import the pattern scanner module
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'analysis'))
from pattern_scan import (
    chunk_into_entries, normalize, fingerprint, detect_hits,
    parse_speaker, strip_timestamp_prefix, context_key,
    ANCHOR_RE, PATTERNS, SEQUENCES, WINDOW
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
STRIPE_PRICE_ID = os.environ.get("STRIPE_PRICE_ID")  # Price for $5/analysis
PAYMENT_REQUIRED = os.environ.get("PAYMENT_REQUIRED", "true").lower() == "true"

# FastAPI app
app = FastAPI(
    title="Chat Pattern Scanner API",
    version="1.0.0",
    description="Offline chat log analysis service with pattern detection and sequence analysis",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ALLOW_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Constants
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {".txt", ".log", ".csv"}

# Models
class AnalysisRequest(BaseModel):
    """Request for analysis with optional payment token"""
    payment_intent_id: Optional[str] = Field(None, description="Stripe payment intent ID")

class PaymentIntentRequest(BaseModel):
    """Request to create a payment intent"""
    amount: int = Field(500, description="Amount in cents (default $5.00)")
    currency: str = Field("usd", description="Currency code")

class PaymentIntentResponse(BaseModel):
    """Response with payment intent details"""
    client_secret: str
    payment_intent_id: str
    amount: int

class AnalysisResult(BaseModel):
    """Result of pattern analysis"""
    total_events: int
    unique_patterns: dict
    sequence_counts: dict
    context_summary: List[dict]
    events_csv: str
    sequences_csv: str
    summary_text: str

class ErrorResponse(BaseModel):
    """Error response model"""
    detail: str
    code: Optional[str] = None


# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "payment_enabled": PAYMENT_REQUIRED}

@app.get("/version")
async def version():
    """Version endpoint"""
    return {"version": app.version}


# Payment endpoints
@app.post("/create-payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(request: PaymentIntentRequest):
    """
    Create a Stripe payment intent for analysis service.
    Returns client_secret for frontend payment confirmation.
    """
    if not PAYMENT_REQUIRED:
        raise HTTPException(status_code=400, detail="Payment is not required in this mode")
    
    if not stripe.api_key:
        raise HTTPException(status_code=503, detail="Payment service not configured")
    
    try:
        intent = stripe.PaymentIntent.create(
            amount=request.amount,
            currency=request.currency,
            metadata={
                "service": "chat_pattern_analysis",
                "version": app.version
            }
        )
        
        return PaymentIntentResponse(
            client_secret=intent.client_secret,
            payment_intent_id=intent.id,
            amount=intent.amount
        )
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Payment service error: {str(e)}")


async def verify_payment(payment_intent_id: Optional[str] = None) -> bool:
    """
    Verify payment has been completed.
    In development mode (PAYMENT_REQUIRED=false), always returns True.
    """
    if not PAYMENT_REQUIRED:
        return True
    
    if not payment_intent_id:
        raise HTTPException(status_code=402, detail="Payment required. Please provide payment_intent_id.")
    
    try:
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        if intent.status != "succeeded":
            raise HTTPException(
                status_code=402,
                detail=f"Payment not completed. Status: {intent.status}"
            )
        
        # Check if already used (simple in-memory check - in production use database)
        # For now, we'll allow reuse within same session
        return True
    except stripe.error.StripeError as e:
        logger.error(f"Payment verification error: {str(e)}")
        raise HTTPException(status_code=500, detail="Payment verification failed")


def validate_file(file: UploadFile) -> None:
    """Validate uploaded file for security"""
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # File size will be checked during reading


def add_branding_to_csv(csv_content: str, output_type: str) -> str:
    """Add branding header to CSV output"""
    branding = f"""# Chat Pattern Scanner Analysis - {output_type}
# Generated by TheAVCfiles Pattern Scanner API v{app.version}
# https://github.com/TheAVCfiles/codex
# 
"""
    return branding + csv_content


def process_chat_log(file_content: str) -> dict:
    """
    Process chat log and return analysis results.
    This is adapted from pattern_scan.py main() function.
    """
    from collections import defaultdict, Counter
    
    blocks = chunk_into_entries(file_content)
    
    context_place = ""
    context_year = ""
    seen = set()
    
    events = []
    pattern_counts = Counter()
    strength_counts = Counter()
    by_context = defaultdict(Counter)
    
    for raw_index, block in enumerate(blocks):
        block = block.strip()
        if not block:
            continue
        
        m = ANCHOR_RE.match(block)
        if m:
            context_place = m.group(1).strip()
            context_year = m.group(2).strip()
            continue
        
        speaker, msg = parse_speaker(block)
        msg = strip_timestamp_prefix(msg)
        
        normalized = normalize(msg)
        fp = fingerprint(normalized)
        if fp in seen:
            continue
        seen.add(fp)
        
        labels, label_strength = detect_hits(msg)
        if not labels:
            continue
        
        pattern_counts.update(labels)
        for label in labels:
            strength_counts[label_strength[label]] += 1
        ctx_key = context_key(context_place, context_year)
        by_context[ctx_key].update(labels)
        
        events.append({
            "entry_index": len(events),
            "raw_block_index": raw_index,
            "context_place": context_place,
            "context_year": context_year,
            "context_key": ctx_key,
            "speaker": speaker,
            "fingerprint": fp,
            "patterns": ";".join(labels),
            "strengths": ";".join([f"{label}:{label_strength[label]}" for label in labels]),
            "text": msg.replace("\n", "\\n"),
        })
    
    # Generate sequences
    sequences = []
    for i, event in enumerate(events):
        hitset = set(event["patterns"].split(";"))
        for start_label, end_label in SEQUENCES:
            if start_label not in hitset:
                continue
            
            for j in range(i + 1, min(i + 1 + WINDOW, len(events))):
                next_event = events[j]
                if next_event["context_key"] != event["context_key"]:
                    continue
                next_hitset = set(next_event["patterns"].split(";"))
                if end_label in next_hitset:
                    sequences.append({
                        "sequence": f"{start_label} -> {end_label}",
                        "context_key": event["context_key"],
                        "from_entry": event["entry_index"],
                        "to_entry": next_event["entry_index"],
                        "from_fp": event["fingerprint"],
                        "to_fp": next_event["fingerprint"],
                        "from_excerpt": event["text"][:180],
                        "to_excerpt": next_event["text"][:180],
                    })
                    break
    
    # Generate CSV strings
    events_csv = io.StringIO()
    events_writer = csv.DictWriter(
        events_csv,
        fieldnames=[
            "entry_index", "raw_block_index", "context_place", "context_year",
            "context_key", "speaker", "fingerprint", "patterns", "strengths", "text"
        ]
    )
    events_writer.writeheader()
    events_writer.writerows(events)
    events_csv_content = add_branding_to_csv(events_csv.getvalue(), "Events")
    
    sequences_csv = io.StringIO()
    sequences_writer = csv.DictWriter(
        sequences_csv,
        fieldnames=[
            "sequence", "context_key", "from_entry", "to_entry",
            "from_fp", "to_fp", "from_excerpt", "to_excerpt"
        ]
    )
    sequences_writer.writeheader()
    sequences_writer.writerows(sequences)
    sequences_csv_content = add_branding_to_csv(sequences_csv.getvalue(), "Sequences")
    
    # Generate context summary CSV
    context_summary_csv = io.StringIO()
    all_patterns = sorted(PATTERNS.keys())
    context_writer = csv.DictWriter(
        context_summary_csv,
        fieldnames=["context_key"] + all_patterns
    )
    context_writer.writeheader()
    context_rows = []
    for ctx_key, counter in sorted(by_context.items(), key=lambda x: sum(x[1].values()), reverse=True):
        row = {"context_key": ctx_key}
        for pattern in all_patterns:
            row[pattern] = counter.get(pattern, 0)
        context_writer.writerow(row)
        context_rows.append(row)
    context_summary_csv_content = add_branding_to_csv(context_summary_csv.getvalue(), "Context Summary")
    
    # Generate summary text
    summary_text = io.StringIO()
    summary_text.write("=" * 60 + "\n")
    summary_text.write("CHAT PATTERN SCANNER ANALYSIS REPORT\n")
    summary_text.write(f"Generated by TheAVCfiles Pattern Scanner API v{app.version}\n")
    summary_text.write("=" * 60 + "\n\n")
    
    summary_text.write("PATTERN SUMMARY (deduped, paragraph-chunked)\n")
    summary_text.write("=" * 60 + "\n")
    for key, value in pattern_counts.most_common():
        summary_text.write(f"{key}: {value}\n")
    
    summary_text.write("\nHIT STRENGTH SUMMARY (PHRASE vs TOKEN)\n")
    summary_text.write("=" * 60 + "\n")
    for key, value in strength_counts.most_common():
        summary_text.write(f"{key}: {value}\n")
    
    summary_text.write("\nSEQUENCE SUMMARY (same-context, windowed)\n")
    summary_text.write("=" * 60 + "\n")
    seq_counts = Counter([seq["sequence"] for seq in sequences])
    for key, value in seq_counts.most_common():
        summary_text.write(f"{key}: {value}\n")
    
    summary_text.write("\nNOTES\n")
    summary_text.write("-" * 60 + "\n")
    summary_text.write("- Anchors: lines like 'Iowa 2017' / 'Iowa, 2017' / 'Iowa — 2017'\n")
    summary_text.write(f"- Sequence lookahead window: {WINDOW} entries\n")
    summary_text.write("- Sequences only counted within same context anchor\n")
    summary_text.write("- Context summary shows pattern counts by location+year\n")
    summary_text.write("\n" + "=" * 60 + "\n")
    
    return {
        "total_events": len(events),
        "unique_patterns": dict(pattern_counts),
        "sequence_counts": dict(seq_counts),
        "context_summary": context_rows,
        "events_csv": events_csv_content,
        "sequences_csv": sequences_csv_content,
        "context_summary_csv": context_summary_csv_content,
        "summary_text": summary_text.getvalue()
    }


@app.post("/analyze", response_model=AnalysisResult)
async def analyze_chat_log(
    file: UploadFile = File(..., description="Chat log file (.txt, .log, or .csv)"),
    payment_intent_id: Optional[str] = None
):
    """
    Analyze uploaded chat log for patterns and sequences.
    
    Requires payment in production mode. Returns detailed analysis with:
    - Event detection and pattern matching
    - Sequence analysis
    - Context-based grouping
    - Branded CSV and text reports
    
    **Pricing**: $5.00 per analysis
    """
    # Verify payment
    await verify_payment(payment_intent_id)
    
    # Validate file
    validate_file(file)
    
    try:
        # Read file content with size limit
        content_bytes = bytearray()
        bytes_read = 0
        
        while chunk := await file.read(8192):
            bytes_read += len(chunk)
            if bytes_read > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=413,
                    detail=f"File too large. Maximum size: {MAX_FILE_SIZE // 1024 // 1024}MB"
                )
            content_bytes.extend(chunk)
        
        # Decode content
        try:
            content = content_bytes.decode('utf-8')
        except UnicodeDecodeError:
            # Try with error handling
            content = content_bytes.decode('utf-8', errors='replace')
            logger.warning("File contained invalid UTF-8 characters, replaced with �")
        
        # Process the chat log
        result = process_chat_log(content)
        
        logger.info(f"Analysis completed: {result['total_events']} events, {len(result['unique_patterns'])} unique patterns")
        
        return AnalysisResult(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    finally:
        await file.close()


@app.get("/patterns")
async def list_patterns():
    """
    List all available pattern categories and their definitions.
    """
    patterns_info = {}
    for category, tiers in PATTERNS.items():
        patterns_info[category] = {
            "phrase_patterns": len(tiers.get("PHRASE", [])),
            "token_patterns": len(tiers.get("TOKEN", [])),
            "description": f"Detects {category.lower().replace('_', ' ')} in chat logs"
        }
    
    return {
        "total_categories": len(PATTERNS),
        "categories": patterns_info,
        "sequences": [f"{a} -> {b}" for a, b in SEQUENCES],
        "window_size": WINDOW
    }


# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(detail=exc.detail, code=str(exc.status_code)).model_dump()
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
