
import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { ChatInterface } from './components/ChatInterface'
import { api, type Session } from './api'

function App() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const data = await api.getSessions()
      setSessions(data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleNewChat = async () => {
    try {
      const { id } = await api.createSession()
      await fetchSessions()
      setCurrentSessionId(id)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-white">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onNewChat={handleNewChat}
      />
      <div className="flex-1 flex flex-col h-full relative">
        {!currentSessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#09090b]">
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              AI Council
            </h1>
            <p className="text-zinc-400 max-w-md text-lg">
              Assemble your personal board of directors. Consult multiple high-intelligence models simultaneously.
            </p>
            <button
              onClick={handleNewChat}
              className="mt-8 px-8 py-3 bg-violet-600 hover:bg-violet-500 rounded-lg font-medium transition-all"
            >
              Start New Session
            </button>
          </div>
        ) : (
          <ChatInterface sessionId={currentSessionId} />
        )}
      </div>
    </div>
  )
}

export default App
