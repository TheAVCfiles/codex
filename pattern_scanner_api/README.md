# Chat Pattern Scanner API

A FastAPI-based service for analyzing chat logs using the offline pattern scanner from PR #114.

## Features

- **Pattern Detection**: Identifies harmful language, boundary violations, threats, surveillance claims, and more
- **Sequence Analysis**: Detects concerning behavioral patterns across message sequences
- **Context Tracking**: Groups patterns by time and location anchors
- **Payment Integration**: Stripe-based payment system ($5 per analysis)
- **Secure File Uploads**: Validates file types and sizes, prevents malicious uploads
- **Branded Outputs**: CSV and text reports with professional branding

## Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   cd pattern_scanner_api
   pip install -r requirements.txt
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your Stripe keys
   # Set PAYMENT_REQUIRED=false for testing without payments
   ```

3. **Run the server**:
   ```bash
   # From the repository root
   uvicorn pattern_scanner_api.main:app --reload
   ```

4. **Access the API**:
   - API docs: http://localhost:8000/docs
   - Health check: http://localhost:8000/health
   - Pattern list: http://localhost:8000/patterns

### Docker Deployment

1. **Build the image**:
   ```bash
   docker build -f Dockerfile.pattern_scanner -t pattern-scanner-api .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8000:8000 \
     -e PAYMENT_REQUIRED=false \
     -e STRIPE_SECRET_KEY=sk_test_... \
     pattern-scanner-api
   ```

### Deploy to Fly.io

1. **Install Fly CLI**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login and create app**:
   ```bash
   fly auth login
   fly apps create pattern-scanner-api
   ```

3. **Set secrets**:
   ```bash
   fly secrets set STRIPE_SECRET_KEY=sk_live_...
   fly secrets set STRIPE_PRICE_ID=price_...
   ```

4. **Deploy**:
   ```bash
   fly deploy
   ```

## API Endpoints

### `GET /health`
Health check endpoint.

**Response**:
```json
{
  "status": "healthy",
  "payment_enabled": true
}
```

### `GET /patterns`
List all available pattern categories.

**Response**:
```json
{
  "total_categories": 6,
  "categories": {
    "HARM_LANGUAGE": {
      "phrase_patterns": 2,
      "token_patterns": 6,
      "description": "Detects harm language in chat logs"
    },
    ...
  },
  "sequences": ["HARM_LANGUAGE -> PROTECTOR_CLAIM", ...],
  "window_size": 6
}
```

### `POST /create-payment-intent`
Create a Stripe payment intent for analysis.

**Request**:
```json
{
  "amount": 500,
  "currency": "usd"
}
```

**Response**:
```json
{
  "client_secret": "pi_..._secret_...",
  "payment_intent_id": "pi_...",
  "amount": 500
}
```

### `POST /analyze`
Analyze a chat log file.

**Request**:
- Multipart form data
- File field: `file` (required, .txt/.log/.csv)
- Form field: `payment_intent_id` (optional in dev mode)

**Response**:
```json
{
  "total_events": 42,
  "unique_patterns": {
    "HARM_LANGUAGE": 15,
    "BOUNDARY_LANGUAGE": 8,
    ...
  },
  "sequence_counts": {
    "HARM_LANGUAGE -> PROTECTOR_CLAIM": 3
  },
  "context_summary": [...],
  "events_csv": "# CSV content...",
  "sequences_csv": "# CSV content...",
  "summary_text": "Analysis report..."
}
```

## Testing

### Using curl

```bash
# Check health
curl http://localhost:8000/health

# List patterns
curl http://localhost:8000/patterns

# Analyze a file (dev mode, no payment)
curl -X POST http://localhost:8000/analyze \
  -F "file=@chat_log.txt"

# With payment
curl -X POST http://localhost:8000/analyze \
  -F "file=@chat_log.txt" \
  -F "payment_intent_id=pi_..."
```

### Using the Swagger UI

Navigate to `http://localhost:8000/docs` for an interactive API explorer.

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret API key | Required in production |
| `STRIPE_PRICE_ID` | Stripe price ID for $5 charge | Required in production |
| `PAYMENT_REQUIRED` | Enable payment verification | `true` |
| `CORS_ALLOW_ORIGINS` | Allowed CORS origins | `*` |
| `API_HOST` | Host to bind to | `0.0.0.0` |
| `API_PORT` | Port to listen on | `8000` |
| `MAX_FILE_SIZE` | Max upload size in bytes | `10485760` (10MB) |

## Security Features

- **File Type Validation**: Only .txt, .log, and .csv files accepted
- **Size Limits**: Maximum 10MB per upload
- **Payment Verification**: Stripe integration prevents unauthorized access
- **CORS Protection**: Configurable allowed origins
- **Input Sanitization**: Text encoding validation and error handling
- **Secure Logging**: No sensitive data logged

## Pricing

- **Per Analysis**: $5.00 USD
- **Payment Method**: Credit/debit cards via Stripe
- **Development Mode**: Set `PAYMENT_REQUIRED=false` to disable payments

## Pattern Categories

The scanner detects 6 main pattern categories:

1. **HARM_LANGUAGE**: Threatening or frightening language
2. **PROTECTOR_CLAIM**: Claims of protection or safety
3. **BOUNDARY_LANGUAGE**: Mentions of boundaries or privacy
4. **THREAT_OF_EXPOSURE**: Threats to expose or share information
5. **SURVEILLANCE_CLAIM**: Claims of watching or tracking
6. **CONTROL_ACCESS**: References to controlling access or resources

Each pattern has TOKEN (weak signal) and PHRASE (strong signal) variants.

## Output Format

Results include:

1. **Events CSV**: All detected pattern matches with context
2. **Sequences CSV**: Pattern sequences across messages
3. **Context Summary CSV**: Patterns grouped by location/time
4. **Summary Text**: Human-readable analysis report

All outputs include professional branding and attribution.

## Support

For issues or questions:
- GitHub Issues: https://github.com/TheAVCfiles/codex/issues
- Documentation: See repository README

## License

See the main repository LICENSE file.
