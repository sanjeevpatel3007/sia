'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getUserSessions,
  getSessionMessages,
  updateTitle,
  deleteSession as deleteSessionAction
} from '@/actions/chat-history.actions';

export interface ChatMessage {
  id?: string;
  user_id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content?: string; // Kept for backward compatibility
  parts?: any[]; // UIMessage parts array
  created_at?: string;
  metadata?: Record<string, unknown>;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title?: string;
  created_at?: string;
  updated_at?: string;
  message_count?: number;
  last_message?: string;
}

interface ChatContextType {
  sessions: ChatSession[];
  currentSessionId: string | null;
  currentMessages: ChatMessage[];
  isLoading: boolean;
  isMessagesLoading: boolean;
  createNewSession: () => Promise<string>;
  switchToSession: (sessionId: string) => Promise<void>;
  updateSession: (sessionId: string, title: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  refreshSessions: () => Promise<void>;
  setCurrentSessionId: (sessionId: string | null) => void;
  setCurrentMessages: (messages: ChatMessage[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  const refreshSessions = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    try {
      const userSessions = await getUserSessions(session.user.id);
      setSessions(userSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  // Load sessions when user changes
  useEffect(() => {
    if (session?.user?.id) {
      refreshSessions();
    } else {
      setSessions([]);
      setCurrentSessionId(null);
      setCurrentMessages([]);
    }
  }, [session?.user?.id, refreshSessions]);

  // Load messages when session changes
  const loadSessionMessages = useCallback(async (sessionId: string) => {
    if (!sessionId) return;
    
    setIsMessagesLoading(true);
    try {
      const messages = await getSessionMessages(sessionId);
      setCurrentMessages(messages);
    } catch (error) {
      console.error('Error loading session messages:', error);
      setCurrentMessages([]);
    } finally {
      setIsMessagesLoading(false);
    }
  }, []);

  // Load messages when current session changes
  useEffect(() => {
    if (currentSessionId) {
      loadSessionMessages(currentSessionId);
    } else {
      setCurrentMessages([]);
    }
  }, [currentSessionId, loadSessionMessages]);

  const createNewSession = async (): Promise<string> => {
    if (!session?.user?.id) throw new Error('User not authenticated');
    
    try {
      // Generate new session ID but don't create in database yet
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Set current session ID but don't create session in database
      // Session will be created when first message is sent
      setCurrentSessionId(sessionId);
      setCurrentMessages([]);
      return sessionId;
    } catch (error) {
      console.error('Error creating new session:', error);
      throw error;
    }
  };

  const switchToSession = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const updateSession = async (sessionId: string, title: string) => {
    try {
      await updateTitle(sessionId, title);
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, title, updated_at: new Date().toISOString() }
            : session
        )
      );
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await deleteSessionAction(sessionId);
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      // If we deleted the current session, switch to another one
      if (currentSessionId === sessionId) {
        const remainingSessions = sessions.filter(s => s.id !== sessionId);
        setCurrentSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
        setCurrentMessages([]);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  };

  return (
    <ChatContext.Provider value={{
      sessions,
      currentSessionId,
      currentMessages,
      isLoading,
      isMessagesLoading,
      createNewSession,
      switchToSession,
      updateSession,
      deleteSession,
      refreshSessions,
      setCurrentSessionId,
      setCurrentMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
