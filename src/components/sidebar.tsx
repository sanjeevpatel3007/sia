'use client'

import React, { useState, useEffect } from 'react'
import {
  MessageCircle,
  Home,
  User,
  Plus,
  Trash2,
  Search
} from 'lucide-react'
import { useChat } from '@/contexts/ChatContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function Sidebar() {
  const [open, setOpen] = useState(false) // Start closed for mobile
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

  // Check if we're on large screens and listen for sidebar toggle events
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(true) // Always open on large screens
      } else {
        setOpen(false) // Start closed on smaller screens
      }
    }

    // Listen for sidebar toggle events from navbar
    const handleSidebarToggle = (event: CustomEvent) => {
      setOpen(event.detail)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    window.addEventListener('sidebarToggle', handleSidebarToggle as EventListener)
    
    return () => {
      window.removeEventListener('resize', checkScreenSize)
      window.removeEventListener('sidebarToggle', handleSidebarToggle as EventListener)
    }
  }, [])

  const handleNewChat = async () => {
    try {
      // Create a new session ID and navigate to it
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      router.push(`/chat/${newSessionId}`)
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
    <>
      {/* Mobile overlay when sidebar is open */}
      {open && (
        <div 
          className="fixed inset-0 bg-transparent bg-opacity-50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      <aside className={`h-[calc(100vh-4rem)] bg-background border-r border-border flex flex-col transition-all duration-300
        ${open ? 'w-64' : '-translate-x-full w-64'} lg:w-64 lg:translate-x-0 fixed lg:relative top-16 lg:top-0 left-0 z-50 lg:z-auto`}>

      {/* Top actions */}
      <div className={`px-3 pt-4 mb-4 ${open ? "" : "hidden"}`}>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Home"
            onClick={() => router.push('/')}
          >
            <Home size={18} />
          </Button>
          <Button
            onClick={handleNewChat}
            variant="secondary"
            className="flex-1"
          >
            <Plus size={18} />
            New Chat
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {open && (
        <div className="px-3 mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9"
            />
          </div>
        </div>
      )}

      {/* Chat History */}
      <div className={`flex-1 ${open ? "px-3" : ""} overflow-y-auto`}>
        <div className={`${open ? "" : "hidden"}`}>
          <div className="text-xs text-muted-foreground mb-2 pl-2 leading-tight uppercase tracking-wide font-medium">Recent Chats</div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-accent rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-4">
              {searchQuery ? 'No chats found' : 'Start a conversation to see your chat history'}
            </div>
          ) : (
            <ul className="space-y-1">
              {filteredSessions.map(session => (
                <li key={session.id} className="group relative">
                  <Button
                    variant="ghost"
                    className={`w-full flex items-start gap-2 px-3 py-2 h-auto justify-start text-left
                      ${currentSessionId === session.id ? 'bg-accent font-semibold' : ''}`}
                    onClick={() => handleChatClick(session.id)}
                  >
                    <MessageCircle size={18} className="shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{session.title || 'New Chat'}</div>
                      {session.last_message && (
                        <div className="text-xs text-muted-foreground truncate mt-1">
                          {session.last_message.length > 50
                            ? session.last_message.substring(0, 50) + '...'
                            : session.last_message
                          }
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        {session.updated_at ? formatDate(session.updated_at) : 'Unknown'}
                        {session.message_count && session.message_count > 0 && (
                          <span className="ml-1">• {session.message_count} messages</span>
                        )}
                      </div>
                    </div>
                  </Button>

                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDeleteConfirm(session.id)
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Separator />

      {/* User info at bottom */}
      <div className="flex items-center justify-center mb-6 mt-4 px-3">
        <div className="flex items-center gap-2 text-muted-foreground px-2 py-1 rounded-full">
          <User size={22} />
          {open && (
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">
                {session?.user?.user_metadata?.full_name || 'User'}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {session?.user?.email}
              </div>
            </div>
          )}
        </div>
       
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Delete Chat</h3>
            <p className="text-muted-foreground mb-4">Are you sure you want to delete this chat? This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteSession(showDeleteConfirm)}
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
      </aside>
    </>
  )
}