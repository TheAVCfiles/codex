# Pattern Scanner API - Quick Start

This directory contains a complete FastAPI-based monetizable service for the offline chat pattern scanner from PR #114.

## 🚀 What's Included

- **FastAPI Service**: Production-ready API with Stripe payment integration
- **Docker Support**: Containerized deployment with Dockerfile
- **Fly.io & Railway Config**: Deploy to free-tier cloud platforms
- **GitHub Actions CI/CD**: Automated testing and deployment
- **Payment Processing**: Stripe integration for $5 per analysis
- **Security**: File validation, CORS, rate limiting ready
- **Tests**: 14 comprehensive tests (all passing)
- **Documentation**: Complete deployment and monetization guides
- **Demo Client**: Interactive HTML interface + Python client example

## 📦 Quick Start (Development)

### 1. Install Dependencies

```bash
cd pattern_scanner_api
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and set PAYMENT_REQUIRED=false for local testing
```

### 3. Run the API

```bash
# From repository root
uvicorn pattern_scanner_api.main:app --reload
```

### 4. Test It

Open browser to:
- **API Docs**: http://localhost:8000/docs
- **Demo UI**: Open `pattern_scanner_api/demo.html` in browser
- **Health Check**: http://localhost:8000/health

Or use the Python client:

```bash
python pattern_scanner_api/example_client.py
```

## 🚀 Deploy to Production

### Option 1: Fly.io (Recommended)

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login and deploy
fly auth login
fly apps create pattern-scanner-api
fly secrets set STRIPE_SECRET_KEY=sk_live_...
fly secrets set STRIPE_PRICE_ID=price_...
fly deploy
```

### Option 2: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway variables set STRIPE_SECRET_KEY=sk_live_...
railway up
```

### Option 3: Docker

```bash
# Build image
docker build -f Dockerfile.pattern_scanner -t pattern-scanner-api .

# Run container
docker run -p 8000:8000 \
  -e STRIPE_SECRET_KEY=sk_live_... \
  -e PAYMENT_REQUIRED=true \
  pattern-scanner-api
```

## 💰 Monetization

The API uses Stripe for payment processing:

1. **Sign up for Stripe**: https://stripe.com
2. **Create a product**: $5.00 one-time payment
3. **Get API keys**: Secret key and Price ID
4. **Set environment variables**
5. **Accept payments!**

See [MONETIZATION.md](./MONETIZATION.md) for complete setup guide.

## 📚 Documentation

- **[README.md](./README.md)** - API features and usage
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide for all platforms
- **[MONETIZATION.md](./MONETIZATION.md)** - Stripe setup and payment integration
- **[VIDEO_GENERATION.md](./VIDEO_GENERATION.md)** - Future enhancement for MP4 reports

## 🧪 Testing

```bash
# Run all tests
pytest pattern_scanner_api/tests/ -v

# Run with coverage
pytest pattern_scanner_api/tests/ --cov=pattern_scanner_api
```

## 📊 API Endpoints

### `POST /analyze`
Upload a chat log and receive analysis results.

**Request**: Multipart form with file upload
**Response**: JSON with patterns, sequences, and CSV reports

### `POST /create-payment-intent`
Create a Stripe payment intent for $5.00

**Request**: `{"amount": 500, "currency": "usd"}`
**Response**: Client secret for payment confirmation

### `GET /patterns`
List all available pattern categories

### `GET /health`
Health check endpoint

## 🔒 Security Features

- ✅ File type validation (.txt, .log, .csv only)
- ✅ File size limits (10MB max)
- ✅ CORS protection
- ✅ Payment verification
- ✅ Input sanitization
- ✅ HTTPS ready

## 💵 Pricing

- **Per Analysis**: $5.00 USD
- **Payment Method**: Credit/debit cards via Stripe
- **Dev Mode**: Free (set `PAYMENT_REQUIRED=false`)

## 🎯 Pattern Categories

Detects 6 main categories:
1. HARM_LANGUAGE - Threatening or frightening language
2. PROTECTOR_CLAIM - Claims of protection or safety
3. BOUNDARY_LANGUAGE - Privacy and boundary mentions
4. THREAT_OF_EXPOSURE - Threats to share information
5. SURVEILLANCE_CLAIM - Claims of watching or tracking
6. CONTROL_ACCESS - References to controlling resources

## 🤝 Contributing

See the main repository README for contribution guidelines.

## 📄 License

See the main repository LICENSE file.

## 🆘 Support

- **Issues**: https://github.com/TheAVCfiles/codex/issues
- **Documentation**: See docs in this directory
- **Stripe Support**: https://support.stripe.com

## 🎉 What's Next?

1. Deploy to production ✅
2. Set up payment processing ✅
3. Monitor usage and revenue 📊
4. Add video generation (optional) 🎥
5. Scale as needed 📈

---

Built with ❤️ by TheAVCfiles
