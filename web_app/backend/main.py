
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from .manager import CouncilManager

app = FastAPI(title="AI Council API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

manager = CouncilManager()

class ChatRequest(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    responses: List[Dict[str, str]]
    history: List[Dict[str, Any]]

class SessionResponse(BaseModel):
    id: str
    preview: str

@app.get("/sessions", response_model=List[SessionResponse])
async def get_sessions():
    return manager.get_all_sessions()

@app.post("/sessions", response_model=Dict[str, str])
async def create_session():
    session_id = manager.create_session()
    return {"id": session_id}

@app.get("/sessions/{session_id}")
async def get_session(session_id: str):
    session = manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        result = await manager.get_council_response(request.message, request.session_id)
        return result
    except Exception as e:
        print(f"Error processing chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
