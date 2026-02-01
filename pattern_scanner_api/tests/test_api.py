"""
Tests for the Pattern Scanner API
"""
import pytest
from fastapi.testclient import TestClient
import os

# Set test mode
os.environ["PAYMENT_REQUIRED"] = "false"

from pattern_scanner_api.main import app

client = TestClient(app)


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "payment_enabled" in data


def test_version():
    """Test version endpoint"""
    response = client.get("/version")
    assert response.status_code == 200
    data = response.json()
    assert "version" in data


def test_list_patterns():
    """Test patterns listing endpoint"""
    response = client.get("/patterns")
    assert response.status_code == 200
    data = response.json()
    
    assert "total_categories" in data
    assert "categories" in data
    assert "sequences" in data
    assert "window_size" in data
    
    # Check that expected categories are present
    categories = data["categories"]
    assert "HARM_LANGUAGE" in categories
    assert "BOUNDARY_LANGUAGE" in categories
    assert "THREAT_OF_EXPOSURE" in categories


def test_analyze_simple_log():
    """Test analyzing a simple chat log"""
    # Create a simple test log with a pattern
    test_log = """Iowa 2017

John: I'm going to hurt you if you don't listen.
Jane: Please stop, I said no."""
    
    # Create a temporary file
    files = {"file": ("test_chat.txt", test_log, "text/plain")}
    
    response = client.post("/analyze", files=files)
    assert response.status_code == 200
    
    data = response.json()
    assert "total_events" in data
    assert "unique_patterns" in data
    assert "events_csv" in data
    assert "sequences_csv" in data
    assert "summary_text" in data
    
    # Should detect some patterns
    assert data["total_events"] > 0


def test_analyze_invalid_file_type():
    """Test that invalid file types are rejected"""
    files = {"file": ("test.exe", b"binary content", "application/octet-stream")}
    
    response = client.post("/analyze", files=files)
    assert response.status_code == 400
    assert "not allowed" in response.json()["detail"].lower()


def test_analyze_empty_log():
    """Test analyzing an empty log"""
    test_log = ""
    files = {"file": ("empty.txt", test_log, "text/plain")}
    
    response = client.post("/analyze", files=files)
    assert response.status_code == 200
    
    data = response.json()
    assert data["total_events"] == 0


def test_analyze_no_patterns():
    """Test analyzing a log with no detectable patterns"""
    test_log = """Hello world
This is a normal conversation
Nothing concerning here"""
    
    files = {"file": ("normal.txt", test_log, "text/plain")}
    
    response = client.post("/analyze", files=files)
    assert response.status_code == 200
    
    data = response.json()
    assert data["total_events"] == 0


def test_analyze_with_context():
    """Test that context anchors work properly"""
    test_log = """Iowa 2017

Person A: hurt
Person B: protect

California 2018

Person C: threat
Person D: safe"""
    
    files = {"file": ("context_test.txt", test_log, "text/plain")}
    
    response = client.post("/analyze", files=files)
    assert response.status_code == 200
    
    data = response.json()
    # Should have events from both contexts
    assert data["total_events"] > 0
    assert len(data["context_summary"]) > 0


def test_branding_in_output():
    """Test that outputs include branding"""
    test_log = """Test message with hurt in it"""
    files = {"file": ("branded.txt", test_log, "text/plain")}
    
    response = client.post("/analyze", files=files)
    assert response.status_code == 200
    
    data = response.json()
    
    # Check for branding in CSV outputs
    assert "TheAVCfiles Pattern Scanner API" in data["events_csv"]
    assert "github.com/TheAVCfiles/codex" in data["events_csv"]
    
    # Check for branding in summary
    assert "CHAT PATTERN SCANNER ANALYSIS REPORT" in data["summary_text"]
    assert "TheAVCfiles Pattern Scanner API" in data["summary_text"]


def test_payment_not_required_in_test_mode():
    """Test that payment is not required when PAYMENT_REQUIRED=false"""
    test_log = "Test content"
    files = {"file": ("test.txt", test_log, "text/plain")}
    
    # No payment_intent_id provided
    response = client.post("/analyze", files=files)
    
    # Should succeed without payment in test mode
    assert response.status_code == 200


@pytest.mark.parametrize("file_ext,mime_type", [
    (".txt", "text/plain"),
    (".log", "text/plain"),
    (".csv", "text/csv"),
])
def test_allowed_file_types(file_ext, mime_type):
    """Test that all allowed file types work"""
    test_log = "Test content"
    filename = f"test{file_ext}"
    files = {"file": (filename, test_log, mime_type)}
    
    response = client.post("/analyze", files=files)
    assert response.status_code == 200


def test_unicode_handling():
    """Test that Unicode characters are handled properly"""
    test_log = """Test with Unicode: café, naïve, 你好
Person: I'm scared — please stop"""
    
    files = {"file": ("unicode.txt", test_log, "text/plain")}
    
    response = client.post("/analyze", files=files)
    assert response.status_code == 200
    
    data = response.json()
    # Should detect the scared/stop patterns
    assert data["total_events"] > 0
