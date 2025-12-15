
import sys
import os
import logging

logging.basicConfig(level=logging.DEBUG)
print("Starting import check...")

try:
    print("Importing web_app.backend.manager...")
    from web_app.backend.manager import CouncilManager
    print("CouncilManager imported.")
    
    print("Initializing CouncilManager (this triggers API calls)...")
    manager = CouncilManager()
    print("CouncilManager initialized.")
    
    print("Importing fastapi app...")
    from web_app.backend.main import app
    print("App imported.")
    
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()

print("Done.")
