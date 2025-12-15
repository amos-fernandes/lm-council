
import requests
import json
import time

def test_chat():
    url = "http://127.0.0.1:8000/chat"
    
    # First create a session
    try:
        print("Creating session...")
        sess_resp = requests.post("http://127.0.0.1:8000/sessions")
        sess_resp.raise_for_status()
        session_id = sess_resp.json()["id"]
        print(f"Session ID: {session_id}")
    except Exception as e:
        print(f"Failed to create session: {e}")
        return

    payload = {
        "message": "Hello Council, represent!",
        "session_id": session_id
    }
    
    print(f"Sending chat to {url}...")
    try:
        resp = requests.post(url, json=payload, timeout=60)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text}")
    except Exception as e:
        print(f"Request Failed: {e}")

if __name__ == "__main__":
    # Wait for server to potentially come up if run immediately
    # time.sleep(5) 
    test_chat()
