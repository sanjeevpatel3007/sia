import { supabase } from './supabase';
import type { UIMessage } from 'ai';

export interface ChatMessage {
  id?: string;
  user_id2: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content?: string; // Kept for backward compatibility, prefer parts
  parts?: any[]; // UIMessage parts array
  created_at?: string;
  metadata?: Record<string, unknown>;
}

// Utility functions for converting between database and AI SDK formats
export function convertDbMessageToUIMessage(dbMessage: ChatMessage): UIMessage {
  return {
    id: dbMessage.id || `${dbMessage.role}-${Date.now()}`,
    role: dbMessage.role as any,
    // Use parts if available, fallback to content for old messages
    parts: dbMessage.parts && dbMessage.parts.length > 0
      ? dbMessage.parts
      : [{ type: 'text' as const, text: dbMessage.content || '' }],
  };
}

export function convertUIMessageToDbMessage(
  uiMessage: UIMessage,
  userId: string,
  sessionId: string
): Omit<ChatMessage, 'id' | 'created_at'> {
  // Extract text content for backward compatibility
  const content = uiMessage.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join(' ');

  return {
    user_id2: userId,
    session_id: sessionId,
    role: uiMessage.role as 'user' | 'assistant' | 'system' | 'tool',
    content, // Keep for backward compatibility
    parts: uiMessage.parts, // Store full parts array
  };
}

export interface ChatSession {
  id: string;
  user_id2: string;
  title?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChatMessageForHistory {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

// Save a single message to database
export async function saveChatMessage(message: Omit<ChatMessage, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([message])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }
}

// Save multiple messages to database
export async function saveChatMessages(messages: Omit<ChatMessage, 'id' | 'created_at'>[]) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(messages)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving chat messages:', error);
    throw error;
  }
}

// Get chat history for a user
export async function getChatHistory(userId: string, sessionId?: string, limit: number = 50) {
  try {
    let query = supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id2', userId)
      .order('created_at', { ascending: true });

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as ChatMessage[];
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
}

// Get recent sessions for a user
export async function getUserSessions(userId: string, limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id2', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as ChatSession[];
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    return [];
  }
}

// Create or update a chat session
export async function upsertChatSession(session: Omit<ChatSession, 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .upsert([{
        ...session,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error upserting chat session:', error);
    throw error;
  }
}

// Generate session ID (you can customize this)
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get all sessions for a user with message count
export async function getUserSessionsWithCount(userId: string, limit: number = 20) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select(`
        *,
        chat_messages(count)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user sessions with count:', error);
    return [];
  }
}

// Create a new chat session
export async function createChatSession(userId: string, title?: string) {
  try {
    const sessionId = generateSessionId();
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert([{
        id: sessionId,
        user_id: userId,
        title: title || 'New Chat'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
}

// Update session title
export async function updateSessionTitle(sessionId: string, title: string) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ 
        title,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating session title:', error);
    throw error;
  }
}

// Delete a chat session and all its messages
export async function deleteChatSession(sessionId: string) {
  try {
    // Delete messages first (due to foreign key constraint)
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .delete()
      .eq('session_id', sessionId);

    if (messagesError) throw messagesError;

    // Delete session
    const { error: sessionError } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    if (sessionError) throw sessionError;
    return true;
  } catch (error) {
    console.error('Error deleting chat session:', error);
    throw error;
  }
}

// Get chat session by ID
export async function getChatSession(sessionId: string) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) throw error;
    return data as ChatSession;
  } catch (error) {
    console.error('Error fetching chat session:', error);
    return null;
  }
}

// Get all sessions for user with message count and last message
export async function getUserChatSessions(userId: string, limit: number = 20) {
  try {
    // First get all sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('chat_sessions')
      .select('id, title, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (sessionsError) throw sessionsError;
    
    if (!sessions || sessions.length === 0) {
      return [];
    }

    // Get message counts and last messages for each session
    const sessionIds = sessions.map(s => s.id);
    
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('session_id, content, role, created_at')
      .in('session_id', sessionIds)
      .order('created_at', { ascending: false });

    if (messagesError) throw messagesError;

    // Group messages by session_id
    const messagesBySession = messages?.reduce((acc, msg) => {
      if (!acc[msg.session_id]) {
        acc[msg.session_id] = [];
      }
      acc[msg.session_id].push(msg);
      return acc;
    }, {} as Record<string, Array<{session_id: string, content: string, role: string, created_at: string}>>) || {};

    // Transform sessions to include message count and last message
    const sessionsWithMessages = sessions.map(session => {
      const sessionMessages = messagesBySession[session.id] || [];
      return {
        id: session.id,
        user_id: userId,
        title: session.title,
        created_at: session.created_at,
        updated_at: session.updated_at,
        message_count: sessionMessages.length,
        last_message: sessionMessages[0]?.content || ''
      };
    });

    return sessionsWithMessages;
  } catch (error) {
    console.error('Error fetching user chat sessions:', error);
    return [];
  }
}

// Get messages for a specific session
export async function getSessionMessages(sessionId: string, limit: number = 100) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data as ChatMessage[];
  } catch (error) {
    console.error('Error fetching session messages:', error);
    return [];
  }
}

// Add a message to a session (with full UIMessage support)
export async function addMessageToSession(
  sessionId: string,
  userId: string,
  role: 'user' | 'assistant' | 'system' | 'tool',
  content: string,
  parts?: any[] // Optional parts array from UIMessage
) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{
        session_id: sessionId,
        user_id: userId,
        role,
        content, // Keep for backward compatibility
        parts: parts || [{ type: 'text', text: content }], // Save parts array
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    // Update session's updated_at timestamp
    await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    return data as ChatMessage;
  } catch (error) {
    console.error('Error adding message to session:', error);
    throw error;
  }
}

// Save a full UIMessage to database
export async function saveUIMessage(
  uiMessage: UIMessage,
  sessionId: string,
  userId: string
) {
  const dbMessage = convertUIMessageToDbMessage(uiMessage, userId, sessionId);

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{
        ...dbMessage,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    // Update session's updated_at timestamp
    await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    return data as ChatMessage;
  } catch (error) {
    console.error('Error saving UIMessage:', error);
    throw error;
  }
}
