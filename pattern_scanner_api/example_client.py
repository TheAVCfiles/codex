"""
Example client for the Pattern Scanner API

This script demonstrates how to use the API from Python.
"""
import requests
import json
import os


class PatternScannerClient:
    """Client for the Pattern Scanner API"""
    
    def __init__(self, api_url="http://localhost:8000", stripe_key=None):
        """
        Initialize the client
        
        Args:
            api_url: Base URL of the API
            stripe_key: Stripe publishable key (for payment)
        """
        self.api_url = api_url.rstrip("/")
        self.stripe_key = stripe_key
    
    def health_check(self):
        """Check API health"""
        response = requests.get(f"{self.api_url}/health")
        response.raise_for_status()
        return response.json()
    
    def list_patterns(self):
        """Get list of available patterns"""
        response = requests.get(f"{self.api_url}/patterns")
        response.raise_for_status()
        return response.json()
    
    def create_payment_intent(self, amount=500, currency="usd"):
        """
        Create a payment intent
        
        Args:
            amount: Amount in cents (default 500 = $5.00)
            currency: Currency code (default "usd")
        
        Returns:
            dict with client_secret and payment_intent_id
        """
        response = requests.post(
            f"{self.api_url}/create-payment-intent",
            json={"amount": amount, "currency": currency}
        )
        response.raise_for_status()
        return response.json()
    
    def analyze_file(self, file_path, payment_intent_id=None):
        """
        Analyze a chat log file
        
        Args:
            file_path: Path to the chat log file
            payment_intent_id: Payment intent ID (optional in dev mode)
        
        Returns:
            Analysis results as dict
        """
        with open(file_path, 'rb') as f:
            files = {'file': f}
            data = {}
            if payment_intent_id:
                data['payment_intent_id'] = payment_intent_id
            
            response = requests.post(
                f"{self.api_url}/analyze",
                files=files,
                data=data
            )
        
        response.raise_for_status()
        return response.json()
    
    def analyze_text(self, text_content, filename="chat.txt", payment_intent_id=None):
        """
        Analyze text content directly
        
        Args:
            text_content: Text to analyze
            filename: Filename to use for the upload
            payment_intent_id: Payment intent ID (optional in dev mode)
        
        Returns:
            Analysis results as dict
        """
        files = {'file': (filename, text_content, 'text/plain')}
        data = {}
        if payment_intent_id:
            data['payment_intent_id'] = payment_intent_id
        
        response = requests.post(
            f"{self.api_url}/analyze",
            files=files,
            data=data
        )
        
        response.raise_for_status()
        return response.json()


def main():
    """Example usage"""
    # Initialize client
    client = PatternScannerClient(api_url="http://localhost:8000")
    
    # Check health
    print("Checking API health...")
    health = client.health_check()
    print(f"Status: {health['status']}")
    print(f"Payment enabled: {health['payment_enabled']}\n")
    
    # List patterns
    print("Available patterns:")
    patterns = client.list_patterns()
    print(f"Total categories: {patterns['total_categories']}")
    for category, info in patterns['categories'].items():
        print(f"  - {category}: {info['phrase_patterns']} phrases, {info['token_patterns']} tokens")
    print()
    
    # Analyze sample text
    print("Analyzing sample chat log...")
    sample_text = """Iowa 2017
    
    Alex: I'm scared, please stop threatening me.
    Jordan: I'm just protecting you, it's for your own good.
    Alex: I said no. I need privacy.
    """
    
    result = client.analyze_text(sample_text)
    
    print(f"\nAnalysis Results:")
    print(f"Total events detected: {result['total_events']}")
    print(f"\nPattern counts:")
    for pattern, count in result['unique_patterns'].items():
        print(f"  {pattern}: {count}")
    
    print(f"\nSequences detected:")
    for sequence, count in result['sequence_counts'].items():
        print(f"  {sequence}: {count}")
    
    # Save outputs
    print("\nSaving outputs...")
    with open('events.csv', 'w') as f:
        f.write(result['events_csv'])
    print("  - events.csv")
    
    with open('sequences.csv', 'w') as f:
        f.write(result['sequences_csv'])
    print("  - sequences.csv")
    
    with open('summary.txt', 'w') as f:
        f.write(result['summary_text'])
    print("  - summary.txt")
    
    print("\nDone!")


if __name__ == "__main__":
    main()
