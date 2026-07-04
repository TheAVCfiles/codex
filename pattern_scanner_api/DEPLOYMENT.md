# Deployment Guide

## Overview

The Pattern Scanner API can be deployed to various platforms. This guide covers deployment to Fly.io (recommended) and Railway.

## Prerequisites

- Docker installed locally (for testing)
- Git repository access
- Stripe account for payment processing (production only)

## Environment Variables

Required environment variables:

```bash
# Required for production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_...

# Optional configuration
PAYMENT_REQUIRED=true          # Set to false for development
CORS_ALLOW_ORIGINS=*           # Comma-separated list of allowed origins
API_HOST=0.0.0.0
API_PORT=8000
MAX_FILE_SIZE=10485760         # 10MB in bytes
```

## Fly.io Deployment (Recommended)

Fly.io offers a generous free tier and excellent performance.

### 1. Install Fly CLI

```bash
# macOS/Linux
curl -L https://fly.io/install.sh | sh

# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

### 2. Login to Fly.io

```bash
fly auth login
```

### 3. Create App

```bash
# Create production app
fly apps create pattern-scanner-api

# Optional: Create staging app
fly apps create pattern-scanner-api-staging
```

### 4. Set Secrets

```bash
# Set production secrets
fly secrets set STRIPE_SECRET_KEY=sk_live_... --app pattern-scanner-api
fly secrets set STRIPE_PRICE_ID=price_... --app pattern-scanner-api

# Optional: Set staging secrets
fly secrets set STRIPE_SECRET_KEY=sk_test_... --app pattern-scanner-api-staging
fly secrets set STRIPE_PRICE_ID=price_... --app pattern-scanner-api-staging
fly secrets set PAYMENT_REQUIRED=false --app pattern-scanner-api-staging
```

### 5. Deploy

```bash
# Deploy to production
fly deploy --app pattern-scanner-api

# Deploy to staging
fly deploy --app pattern-scanner-api-staging
```

### 6. Verify Deployment

```bash
# Check status
fly status --app pattern-scanner-api

# View logs
fly logs --app pattern-scanner-api

# Open in browser
fly open --app pattern-scanner-api
```

### Fly.io Configuration

The `fly.toml` file is already configured with:

- **Region**: `iad` (US East - Virginia)
- **Memory**: 256MB
- **CPU**: Shared 1 CPU
- **Auto-scaling**: Stops when idle, starts on request
- **Health checks**: HTTP health check on `/health`

### Updating Fly.io App

```bash
# Update configuration
fly deploy --app pattern-scanner-api

# Scale resources
fly scale memory 512 --app pattern-scanner-api
fly scale count 2 --app pattern-scanner-api

# View metrics
fly dashboard --app pattern-scanner-api
```

## Railway Deployment (Alternative)

Railway is another excellent platform with a simple deployment process.

### 1. Install Railway CLI

```bash
npm install -g @railway/cli

# Or use brew
brew install railway
```

### 2. Login

```bash
railway login
```

### 3. Initialize Project

```bash
# From the repository root
railway init
```

### 4. Set Environment Variables

```bash
railway variables set STRIPE_SECRET_KEY=sk_live_...
railway variables set STRIPE_PRICE_ID=price_...
railway variables set PAYMENT_REQUIRED=true
```

### 5. Deploy

```bash
# Deploy using Dockerfile
railway up
```

### Railway Configuration

Create a `railway.toml` file:

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile.pattern_scanner"

[deploy]
startCommand = ""
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

## GitHub Actions CI/CD

The repository includes automated deployment via GitHub Actions.

### Setup

1. **Add Fly.io Token to GitHub Secrets**:
   - Go to repository Settings → Secrets → Actions
   - Add `FLY_API_TOKEN` with your Fly.io API token
   - Get token: `fly auth token`

2. **Workflow Triggers**:
   - Push to `main` → Deploy to production
   - Push to `develop` → Deploy to staging
   - Pull requests → Run tests only

### Manual Deployment

Trigger deployment manually:

```bash
# Via GitHub CLI
gh workflow run pattern-scanner-api.yml

# Or push to trigger branch
git push origin main
```

## Docker Deployment

For self-hosted deployment:

### Build Image

```bash
docker build -f Dockerfile.pattern_scanner -t pattern-scanner-api .
```

### Run Container

```bash
docker run -d \
  --name pattern-scanner-api \
  -p 8000:8000 \
  -e STRIPE_SECRET_KEY=sk_live_... \
  -e STRIPE_PRICE_ID=price_... \
  -e PAYMENT_REQUIRED=true \
  pattern-scanner-api
```

### With Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile.pattern_scanner
    ports:
      - "8000:8000"
    environment:
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_PRICE_ID=${STRIPE_PRICE_ID}
      - PAYMENT_REQUIRED=true
      - CORS_ALLOW_ORIGINS=*
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Run:

```bash
docker-compose up -d
```

## SSL/HTTPS

### Fly.io

Fly.io automatically provides SSL certificates. No configuration needed.

### Railway

Railway automatically provides SSL certificates. No configuration needed.

### Self-Hosted

Use a reverse proxy like Nginx or Caddy:

**Caddy** (easiest):

```caddyfile
api.yourdomain.com {
    reverse_proxy localhost:8000
}
```

**Nginx**:

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Monitoring

### Health Checks

All platforms support health checks via `/health`:

```bash
curl https://your-app.fly.dev/health
```

### Logs

**Fly.io**:
```bash
fly logs --app pattern-scanner-api
```

**Railway**:
```bash
railway logs
```

**Docker**:
```bash
docker logs pattern-scanner-api
```

### Metrics

- Fly.io: `fly dashboard`
- Railway: Web dashboard
- Docker: Use Prometheus + Grafana

## Scaling

### Fly.io

```bash
# Scale up
fly scale count 2 --app pattern-scanner-api
fly scale memory 512 --app pattern-scanner-api

# Auto-scaling is configured in fly.toml
# It will auto-stop when idle and auto-start on request
```

### Railway

Configure in the Railway dashboard:
- Set replicas
- Configure auto-scaling policies

## Troubleshooting

### API Not Starting

1. Check logs for errors
2. Verify environment variables are set
3. Test health endpoint
4. Check Dockerfile build

### Payment Errors

1. Verify Stripe keys are correct
2. Check Stripe dashboard for errors
3. Test with `PAYMENT_REQUIRED=false` first
4. Ensure webhook endpoints are configured (if using)

### File Upload Errors

1. Check file size limits
2. Verify CORS settings
3. Test with allowed file types (.txt, .log, .csv)

### Performance Issues

1. Increase memory allocation
2. Add more instances
3. Check pattern_scan.py performance
4. Consider caching results

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set CORS_ALLOW_ORIGINS to specific domains
- [ ] Use production Stripe keys
- [ ] Enable PAYMENT_REQUIRED in production
- [ ] Set up rate limiting
- [ ] Monitor API usage
- [ ] Keep dependencies updated
- [ ] Use secrets management for API keys

## Cost Estimates

### Fly.io

- **Free tier**: 3 shared-cpu-1x 256MB VMs (sufficient for staging)
- **Paid tier**: ~$5-10/month for production with reasonable traffic

### Railway

- **Free tier**: $5 credit/month (sufficient for testing)
- **Paid tier**: Usage-based, typically $5-15/month

### Self-Hosted

- **VPS**: $5-20/month (DigitalOcean, Linode, etc.)
- Plus domain and SSL costs

## Next Steps

1. Set up monitoring and alerting
2. Configure automatic backups
3. Set up Stripe webhook handlers
4. Add rate limiting
5. Implement usage analytics
6. Create user documentation
7. Set up staging/production pipelines

## Support

For deployment issues:
- Fly.io: https://community.fly.io
- Railway: https://railway.app/help
- GitHub Issues: https://github.com/TheAVCfiles/codex/issues
