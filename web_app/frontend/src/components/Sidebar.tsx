
import React from 'react';
import type { Session } from '../api';

interface SidebarProps {
    sessions: Session[];
    currentSessionId: string | null;
    onSelectSession: (id: string) => void;
    onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sessions, currentSessionId, onSelectSession, onNewChat }) => {
    return (
        <div className="w-64 glass-panel flex flex-col h-full border-r border-white/10 hidden md:flex">
            <div className="p-4 border-b border-white/10">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    AI Council
                </h1>
            </div>

            <div className="p-2">
                <button
                    onClick={onNewChat}
                    className="w-full glass-panel hover:bg-white/10 p-3 rounded-lg flex items-center gap-2 transition-all"
                >
                    <span>+</span> New Council Session
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {sessions.map((session) => (
                    <button
                        key={session.id}
                        onClick={() => onSelectSession(session.id)}
                        className={`w-full text-left p-3 rounded-lg text-sm truncate transition-all ${currentSessionId === session.id ? 'bg-white/20' : 'hover:bg-white/5'
                            }`}
                    >
                        {session.preview || "Untitled Session"}
                    </button>
                ))}
            </div>

            <div className="p-4 border-t border-white/10 text-xs text-center text-gray-400">
                Powered by LM-Council
            </div>
        </div>
    );
};
