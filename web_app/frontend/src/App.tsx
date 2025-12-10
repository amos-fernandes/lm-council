
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
    <div className="flex h-screen w-full bg-[#0f0c29] text-white">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onNewChat={handleNewChat}
      />
      <div className="flex-1 flex flex-col h-full relative">
        {!currentSessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
              AI Council
            </h1>
            <p className="text-gray-400 max-w-md text-lg">
              Assemble your personal board of directors. Consult multiple high-intelligence models simultaneously.
            </p>
            <button
              onClick={handleNewChat}
              className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold transition-all shadow-lg hover:shadow-blue-500/30"
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
