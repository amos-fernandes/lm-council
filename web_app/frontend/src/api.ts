
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface Session {
    id: string;
    preview: string;
}

export interface Message {
    role: "user" | "council";
    content?: string;
    responses?: { model: string; content: string }[];
}

export const api = {
    getSessions: async (): Promise<Session[]> => {
        const res = await fetch(`${API_URL}/sessions`);
        return res.json();
    },

    createSession: async (): Promise<{ id: string }> => {
        const res = await fetch(`${API_URL}/sessions`, { method: "POST" });
        return res.json();
    },

    getSession: async (id: string): Promise<{ history: Message[] }> => {
        const res = await fetch(`${API_URL}/sessions/${id}`);
        return res.json();
    },

    sendMessage: async (
        sessionId: string,
        message: string
    ): Promise<{ responses: any[]; history: Message[] }> => {
        const res = await fetch(`${API_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId, message }),
        });
        return res.json();
    },
};
