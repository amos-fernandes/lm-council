
import React, { useState, useEffect, useRef } from 'react';
import { api, type Message } from '../api';
import { CouncilCard } from './CouncilCard';

interface ChatInterfaceProps {
    sessionId: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ sessionId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadSession();
    }, [sessionId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadSession = async () => {
        try {
            const data = await api.getSession(sessionId);
            if (data && data.history) {
                setMessages(data.history);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await api.sendMessage(sessionId, userMsg.content!);
            // Ensure we merge the new history or append the response correctly
            // The backend returns responses and full history. We can just use history.
            if (res.history) {
                setMessages(res.history);
            } else {
                // Fallback if backend structure differs
                setMessages(prev => [...prev, { role: 'council', responses: res.responses }]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-transparent">
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        {msg.role === 'user' ? (
                            <div className="bg-blue-600/50 backdrop-blur-md rounded-2xl rounded-tr-none px-6 py-3 max-w-lg text-white">
                                {msg.content}
                            </div>
                        ) : (
                            <div className="w-full">
                                <div className="text-gray-400 text-xs mb-2 ml-2">The Council Speaks:</div>
                                <div className="flex flex-wrap gap-4">
                                    {msg.responses?.map((resp, i) => (
                                        <CouncilCard key={i} model={resp.model} content={resp.content} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="text-center text-gray-400 animate-pulse mt-4">
                        Consulting the council...
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-xl">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask the council..."
                        className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-500 transition-all shadow-lg"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-500 p-2 rounded-full transition-colors disabled:opacity-50"
                    >
                        <svg className="w-6 h-6 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};
