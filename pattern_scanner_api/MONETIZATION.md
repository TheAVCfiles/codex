# Monetization Guide

## Overview

This guide explains how to monetize the Pattern Scanner API using Stripe for payment processing.

## Stripe Setup

### 1. Create a Stripe Account

1. Go to https://stripe.com and sign up
2. Complete account verification
3. Note: Start with test mode for development

### 2. Get API Keys

1. Navigate to Developers → API Keys
2. Copy your keys:
   - **Publishable key**: `pk_test_...` (for frontend)
   - **Secret key**: `sk_test_...` (for backend)

### 3. Create a Product

1. Go to Products → Add Product
2. Configure:
   - **Name**: Chat Pattern Analysis
   - **Description**: Professional chat log pattern analysis with detailed reports
   - **Price**: $5.00 USD
   - **Billing**: One-time payment

3. Copy the **Price ID** (e.g., `price_...`)

### 4. Set Environment Variables

```bash
# For development/testing
export STRIPE_SECRET_KEY=sk_test_...
export STRIPE_PRICE_ID=price_...
export PAYMENT_REQUIRED=true

# For production (use Stripe live keys)
export STRIPE_SECRET_KEY=sk_live_...
export STRIPE_PRICE_ID=price_...
```

## Payment Flow

### Basic Flow

1. **Customer visits website**
2. **Customer clicks "Analyze" → Creates payment intent**
3. **Customer enters payment info → Stripe processes payment**
4. **Payment succeeds → API processes file**
5. **Customer receives results**

### API Integration

#### Step 1: Create Payment Intent

```javascript
// Frontend code
const response = await fetch('http://localhost:8000/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        amount: 500,  // $5.00 in cents
        currency: 'usd'
    })
});

const { client_secret, payment_intent_id } = await response.json();
```

#### Step 2: Collect Payment (Frontend)

```html
<!-- Include Stripe.js -->
<script src="https://js.stripe.com/v3/"></script>

<script>
const stripe = Stripe('pk_test_...');  // Your publishable key

// Create payment form
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

// Handle payment
async function handlePayment(clientSecret) {
    const {error, paymentIntent} = await stripe.confirmCardPayment(
        clientSecret,
        {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: 'Customer Name'
                }
            }
        }
    );
    
    if (error) {
        console.error(error.message);
    } else if (paymentIntent.status === 'succeeded') {
        // Payment successful, now analyze file
        return paymentIntent.id;
    }
}
</script>
```

#### Step 3: Analyze with Payment

```javascript
// After payment succeeds
const formData = new FormData();
formData.append('file', selectedFile);
formData.append('payment_intent_id', paymentIntent.id);

const analysisResponse = await fetch('http://localhost:8000/analyze', {
    method: 'POST',
    body: formData
});

const results = await analysisResponse.json();
```

## Frontend Integration Examples

### Vanilla JavaScript

See `demo.html` for a complete example.

Key components:
1. File upload interface
2. Stripe payment form
3. Results display
4. Download buttons

### React Example

```jsx
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_...');

function AnalysisForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [file, setFile] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            // 1. Create payment intent
            const intentRes = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: 500 })
            });
            const { client_secret } = await intentRes.json();

            // 2. Confirm payment
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                client_secret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement)
                    }
                }
            );

            if (error) {
                throw new Error(error.message);
            }

            // 3. Analyze file
            const formData = new FormData();
            formData.append('file', file);
            formData.append('payment_intent_id', paymentIntent.id);

            const analysisRes = await fetch('/api/analyze', {
                method: 'POST',
                body: formData
            });
            const results = await analysisRes.json();

            console.log('Analysis complete:', results);
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".txt,.log,.csv"
            />
            <CardElement />
            <button type="submit" disabled={!stripe || processing}>
                Pay $5 & Analyze
            </button>
        </form>
    );
}

function App() {
    return (
        <Elements stripe={stripePromise}>
            <AnalysisForm />
        </Elements>
    );
}
```

## Development Mode

For testing without payments:

```bash
export PAYMENT_REQUIRED=false
```

This allows you to:
- Test API functionality
- Develop frontend
- Run automated tests
- Demo to stakeholders

**Important**: Always set `PAYMENT_REQUIRED=true` in production!

## Pricing Strategies

### Current: Fixed Price

- **Price**: $5.00 per analysis
- **Simple and transparent**
- **Easy to understand**

### Alternative: Tiered Pricing

```python
PRICING_TIERS = {
    "basic": {
        "price": 500,  # $5
        "features": ["Basic analysis", "CSV outputs", "Summary"]
    },
    "professional": {
        "price": 1500,  # $15
        "features": ["Advanced patterns", "Video reports", "Priority support"]
    },
    "enterprise": {
        "price": 5000,  # $50
        "features": ["Bulk analysis", "API access", "Custom patterns"]
    }
}
```

### Alternative: Subscription Model

```python
SUBSCRIPTION_PLANS = {
    "starter": {
        "price": 2900,  # $29/month
        "analyses_per_month": 10
    },
    "business": {
        "price": 9900,  # $99/month
        "analyses_per_month": 50
    }
}
```

## Revenue Tracking

### Stripe Dashboard

Monitor:
- Total revenue
- Number of transactions
- Average transaction value
- Failed payments
- Refund requests

### Custom Analytics

Add analytics endpoint to track:

```python
@app.get("/admin/analytics")
async def get_analytics(api_key: str = Header(...)):
    # Verify admin API key
    if api_key != os.environ.get("ADMIN_API_KEY"):
        raise HTTPException(status_code=401)
    
    # Query Stripe API for analytics
    return {
        "total_revenue": calculate_total_revenue(),
        "total_analyses": count_total_analyses(),
        "conversion_rate": calculate_conversion_rate()
    }
```

## Handling Refunds

### Manual Refunds

1. Go to Stripe Dashboard → Payments
2. Find the payment
3. Click "Refund"

### Automatic Refunds (Optional)

```python
@app.post("/admin/refund")
async def refund_payment(payment_intent_id: str, api_key: str = Header(...)):
    if api_key != os.environ.get("ADMIN_API_KEY"):
        raise HTTPException(status_code=401)
    
    try:
        refund = stripe.Refund.create(payment_intent=payment_intent_id)
        return {"status": "refunded", "refund_id": refund.id}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

## Webhooks (Advanced)

For production, set up webhooks to handle:
- Payment confirmations
- Failed payments
- Refunds
- Disputes

### Setup Webhook Endpoint

```python
@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.environ.get("STRIPE_WEBHOOK_SECRET")
        )
    except ValueError as e:
        raise HTTPException(status_code=400)
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400)
    
    # Handle different event types
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        # Record successful payment
    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        # Handle failed payment
    
    return {"status": "success"}
```

### Configure in Stripe

1. Go to Developers → Webhooks
2. Add endpoint: `https://your-app.fly.dev/webhook/stripe`
3. Select events to listen for
4. Copy webhook secret to env vars

## Testing Payments

### Test Card Numbers

Stripe provides test cards:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Insufficient funds**: `4000 0000 0000 9995`
- **3D Secure**: `4000 0027 6000 3184`

Use any future expiry date and any CVC.

### Testing Workflow

```bash
# 1. Start API in test mode
export STRIPE_SECRET_KEY=sk_test_...
export PAYMENT_REQUIRED=true
uvicorn pattern_scanner_api.main:app

# 2. Use test card in frontend
# 3. Verify payment in Stripe Dashboard (Test mode)
# 4. Check that analysis completes successfully
```

## Going Live

### Checklist

- [ ] Switch to live Stripe keys
- [ ] Set `PAYMENT_REQUIRED=true`
- [ ] Test with real card (small amount)
- [ ] Set up webhooks
- [ ] Configure SSL/HTTPS
- [ ] Add terms of service
- [ ] Add privacy policy
- [ ] Add refund policy
- [ ] Set up customer support email
- [ ] Monitor for fraud

### Security Best Practices

1. **Never expose secret key**: Keep `STRIPE_SECRET_KEY` server-side only
2. **Validate amounts**: Always verify payment amounts match expected price
3. **Prevent replay attacks**: Track used payment intent IDs
4. **Use HTTPS**: Always in production
5. **Rate limiting**: Prevent abuse
6. **Log everything**: Track all payment attempts

## Customer Support

### Common Issues

**Payment declined**:
- Ask customer to try different card
- Check Stripe Dashboard for decline reason
- Suggest contacting their bank

**Didn't receive results**:
- Check payment status in Stripe
- Verify payment_intent_id was passed correctly
- Check API logs for errors
- Offer to reprocess or refund

**Want refund**:
- Check Stripe refund policy (usually within 14 days)
- Verify analysis was unsatisfactory
- Process refund via Stripe Dashboard

## Legal Requirements

### Required Pages

1. **Terms of Service**: Define service usage terms
2. **Privacy Policy**: Explain data handling
3. **Refund Policy**: Clarify refund conditions

### Sample Refund Policy

> We offer full refunds within 24 hours of purchase if:
> - The analysis failed to complete
> - There was a technical error
> - The results were inaccurate due to our error
>
> No refunds for:
> - User error (wrong file uploaded)
> - Dissatisfaction with results when service worked correctly

## Revenue Goals

### Example Projections

| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Users | 50 | 200 | 500 |
| Conversion | 20% | 25% | 30% |
| Analyses | 10 | 50 | 150 |
| Revenue | $50 | $250 | $750 |

### Growth Strategies

1. **Marketing**: Social media, content marketing
2. **Partnerships**: Therapy platforms, legal services
3. **Features**: Add video reports, bulk discounts
4. **SEO**: Optimize for chat analysis keywords
5. **Referrals**: Offer credits for referrals

## Next Steps

1. Set up Stripe account
2. Create product and price
3. Test payment flow
4. Deploy to production
5. Monitor revenue
6. Iterate based on feedback

## Support

For payment issues:
- Stripe Support: https://support.stripe.com
- GitHub Issues: https://github.com/TheAVCfiles/codex/issues
