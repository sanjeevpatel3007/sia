"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createChatSession,
  getUserChatSessions,
  getSessionMessages as getSessionMessagesFromDB,
  addMessageToSession,
  updateSessionTitle,
  deleteChatSession,
} from "@/lib/database";
import type { ChatMessage as DBChatMessage } from "@/lib/database";

export interface ChatMessage {
  id?: string;
  user_id: string;
  session_id: string;
  role: "user" | "assistant" | "system" | "tool";
  content?: string; // Made optional to match database interface
  parts?: any[]; // Added parts array to match database interface
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

// Get all chat sessions for a user
export async function getUserSessions(userId: string): Promise<ChatSession[]> {
  try {
    const sessions = await getUserChatSessions(userId);
    return sessions;
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    return [];
  }
}

// Get messages for a specific session
export async function getSessionMessages(
  sessionId: string
): Promise<ChatMessage[]> {
  try {
    const messages = await getSessionMessagesFromDB(sessionId);
    // Map DB messages (user_id2) -> action messages (user_id)
    const mapped: ChatMessage[] = (messages as DBChatMessage[]).map((m) => ({
      id: m.id,
      user_id: (m as any).user_id2 ?? (m as any).user_id,
      session_id: m.session_id,
      role: m.role,
      content: m.content,
      parts: m.parts,
      created_at: m.created_at,
      metadata: m.metadata,
    }));
    return mapped;
  } catch (error) {
    console.error("Error fetching session messages:", error);
    return [];
  }
}

// Create a new chat session
export async function createNewSession(
  userId: string,
  title?: string
): Promise<string> {
  try {
    const sessionId = await createChatSession(userId, title);
    revalidatePath("/chat");
    return sessionId;
  } catch (error) {
    console.error("Error creating new session:", error);
    throw error;
  }
}

// Add a message to a session
export async function addMessage(
  sessionId: string,
  userId: string,
  role: "user" | "assistant" | "system" | "tool",
  content: string
): Promise<ChatMessage> {
  try {
    const message = await addMessageToSession(sessionId, userId, role, content);
    // Map DB message to action message shape
    const mapped: ChatMessage = {
      id: message.id,
      user_id: (message as any).user_id2 ?? (message as any).user_id,
      session_id: message.session_id,
      role: message.role,
      content: message.content,
      parts: (message as any).parts,
      created_at: message.created_at,
      metadata: (message as any).metadata,
    };
    revalidatePath("/chat");
    return mapped;
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
}

// Update session title
export async function updateTitle(
  sessionId: string,
  title: string
): Promise<void> {
  try {
    await updateSessionTitle(sessionId, title);
    revalidatePath("/chat");
  } catch (error) {
    console.error("Error updating session title:", error);
    throw error;
  }
}

// Delete a chat session
export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await deleteChatSession(sessionId);
    revalidatePath("/chat");
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
}

// Navigate to a specific chat
export async function navigateToChat(sessionId: string): Promise<void> {
  redirect(`/chat/${sessionId}`);
}

// Create new chat and navigate to it
export async function createAndNavigateToNewChat(
  userId: string
): Promise<void> {
  try {
    const sessionId = await createNewSession(userId, "New Chat");
    redirect(`/chat/${sessionId}`);
  } catch (error) {
    console.error("Error creating and navigating to new chat:", error);
    throw error;
  }
}
