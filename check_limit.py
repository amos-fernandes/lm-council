
import os
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENROUTER_API_KEY")

try:
    resp = requests.get(
        "https://openrouter.ai/api/v1/auth/key",
        headers={"Authorization": f"Bearer {api_key}"},
        timeout=10,
    )
    data = resp.json()
    print("Full Response:", data)
    rate_limit = data["data"]["rate_limit"]
    print("Rate Limit Data:", rate_limit)
    print("Requests:", rate_limit["requests"])
    print("Interval:", rate_limit["interval"])
except Exception as e:
    print("Error:", e)
