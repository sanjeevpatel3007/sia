'use client'

import React, { useState } from 'react'
import { 
  MessageCircle, 
  Settings, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Trash2,
  Search
} from 'lucide-react'
import { useChat } from '@/contexts/ChatContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
  const [open, setOpen] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { 
    sessions, 
    currentSessionId, 
    isLoading, 
    deleteSession,
    switchToSession
  } = useChat()
  const { session } = useAuth()
  const router = useRouter()

  const handleNewChat = async () => {
    try {
      // Just navigate to /chat without creating session
      router.push('/chat')
    } catch (error) {
      console.error('Error navigating to new chat:', error)
    }
  }

  const handleChatClick = async (sessionId: string) => {
    await switchToSession(sessionId)
    router.push(`/chat/${sessionId}`)
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId)
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  // Filter sessions based on search query
  const filteredSessions = sessions.filter(session => 
    session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className={` h-150 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative
      ${open ? 'w-64' : 'w-16'}`}>

      {/* Toggle Button */}
      <button
        className="absolute top-3 left-3 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
      >
        {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

     

      {/* New Chat Button */}
      <div className={`px-3 mb-4 ${open ? "" : "hidden"}`}>
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      {/* Search Bar */}
      {open && (
        <div className="px-3 mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Chat History */}
      <div className={`flex-1 ${open ? "px-3" : ""} overflow-y-auto`}>
        <div className={`${open ? "" : "hidden"}`}>
          <div className="text-xs text-gray-400 mb-2 pl-2 leading-tight uppercase tracking-wide">Recent Chats</div>
          
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-4">
              {searchQuery ? 'No chats found' : 'Start a conversation to see your chat history'}
            </div>
          ) : (
            <ul className="space-y-1">
              {filteredSessions.map(session => (
                <li key={session.id} className="group relative">
                  <button
                    className={`w-full flex items-start gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 text-sm transition text-left
                      ${currentSessionId === session.id ? 'bg-blue-100 font-semibold text-blue-700' : ''}`}
                    onClick={() => handleChatClick(session.id)}
                  >
                    <MessageCircle size={18} className="shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{session.title || 'New Chat'}</div>
                      {session.last_message && (
                        <div className="text-xs text-gray-500 truncate mt-1">
                          {session.last_message.length > 50 
                            ? session.last_message.substring(0, 50) + '...' 
                            : session.last_message
                          }
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        {session.updated_at ? formatDate(session.updated_at) : 'Unknown'}
                        {session.message_count && session.message_count > 0 && (
                          <span className="ml-1">• {session.message_count} messages</span>
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {/* Delete button */}
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDeleteConfirm(session.id)
                    }}
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* User info at bottom */}
      <div className="flex items-center justify-center mb-6 mt-auto px-3">
        <div className="flex items-center gap-2 text-gray-600 px-2 py-1 rounded-full">
          <User size={22} />
          {open && (
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">
                {session?.user?.user_metadata?.full_name || 'User'}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {session?.user?.email}
              </div>
            </div>
          )}
        </div>
        {open && (
          <button className="ml-2 text-gray-400 hover:text-blue-400 p-1">
            <Settings size={20} />
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Chat</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this chat? This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSession(showDeleteConfirm)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}