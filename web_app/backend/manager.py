
import os
import json
import asyncio
from typing import List, Dict, Optional
import dotenv
from lm_council import LanguageModelCouncil

dotenv.load_dotenv()

class CouncilManager:
    def __init__(self, storage_file: str = "sessions.json"):
        self.storage_file = storage_file
        self.sessions = self._load_sessions()
        
        # High profile models as requested
        self.models = [
            "google/gemini-1.5-pro",
            "openai/gpt-4o",
            "anthropic/claude-3.5-sonnet",
        ]
        
        # We initialize the council per request or keep a singleton? 
        # The library seems designed for ephemeral use or session-based.
        # We will create a fresh instance for now but maybe keep context if needed.
        self.council = LanguageModelCouncil(models=self.models)

    def _load_sessions(self) -> Dict:
        if os.path.exists(self.storage_file):
            try:
                with open(self.storage_file, "r") as f:
                    return json.load(f)
            except json.JSONDecodeError:
                return {}
        return {}

    def _save_sessions(self):
        with open(self.storage_file, "w") as f:
            json.dump(self.sessions, f, indent=2)

    async def get_council_response(self, message: str, session_id: str) -> Dict:
        """
        Sends a message to the council and returns their individual responses.
        """
        if session_id not in self.sessions:
            self.sessions[session_id] = {"history": []}
            
        session = self.sessions[session_id]
        
        # Add user message to history
        session["history"].append({"role": "user", "content": message})
        
        # Execute council
        # Note: The current library `execute` method runs on prompts. 
        # To support chat history, we might need to concatenate history or use a specific API if available.
        # Looking at `council.py`, it accepts `prompts` (str or list[str]). 
        # For a "chat" experience with history, we typically format the prompt with the conversation.
        # We will simple-format the history for now.
        
        full_prompt = self._format_history(session["history"])
        
        # We use the council to get completions. 
        # The library's `execute` returns (completions_df, judging_df).
        # We are interested in completions.
        completions_df, _ = await self.council.execute(full_prompt)
        
        responses = []
        for _, row in completions_df.iterrows():
            responses.append({
                "model": row["model"],
                "content": row["completion_text"]
            })
            
        # Add assistant consolidated response (or just the set) to history
        # For this app, we store the "Group" response conceptually?
        # Or we just append the user interaction. 
        # We'll append a "council" turn containing all responses.
        session["history"].append({"role": "council", "responses": responses})
        
        self._save_sessions()
        
        return {
            "responses": responses,
            "history": session["history"]
        }

    def _format_history(self, history: List[Dict]) -> str:
        """Formats the chat history into a single string prompt."""
        formatted = ""
        for turn in history:
            role = turn["role"]
            if role == "user":
                formatted += f"User: {turn['content']}\n\n"
            elif role == "council":
                # Maybe pick one or just say "Council responded"?
                # For context, we probably want to feed back what they said?
                # This is tricky with multi-model. 
                # Let's simple-format: "Council: <last response>" (Naively) or skip.
                # Ideally we want the LLMs to see the conversation.
                # Let's skip previous council outputs in the prompt for now to avoid context explosion 
                # or confusion, effectively making it one-shot per turn, OR 
                # we just append the User's inputs if the library doesn't support chat history natively.
                pass 
                
        # If we really want "memory", we should probably include at least the last turn.
        # But `lm-council` seems more like an evaluation framework (Stateless).
        # I will build a simple "Chat" prompt including previous user messages.
        return formatted.strip()

    def get_session(self, session_id: str):
        return self.sessions.get(session_id, {"history": []})

    def get_all_sessions(self):
        return [{"id": k, "preview": v["history"][-1]["content"] if v["history"] and v["history"][-1]["role"] == "user" else "New Chat"} for k, v in self.sessions.items()]

    def create_session(self):
        import uuid
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {"history": []}
        self._save_sessions()
        return session_id

