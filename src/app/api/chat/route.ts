import { geminiModel } from "@/lib/google-ai";
import {
  streamText,
  convertToModelMessages,
  UIMessage,
  createIdGenerator,
  stepCountIs,
  smoothStream,
} from "ai";
import { googleCalendarService } from "@/lib/google-calendar";
import {
  searchUserMemories,
  formatMemoriesForContext,
  addIntelligentMemories,
} from "@/lib/mem0";
import { generateSessionId, saveUIMessage } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { calendarTools } from "@/lib/calendar-tools";
import { createMemoryTools } from "@/lib/memory-tools";
import { isCharacterSlug } from "@/lib/characters";

export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    session,
    sessionId,
  }: { messages: UIMessage[]; session: any; sessionId?: string } =
    await req.json();

  let memoryContext = "";
  let userId: string | null = null;
  let memoryUserId: string | null = null; // Used specifically for Mem0 memory storage

  // Generate or use existing session ID
  let currentSessionId = sessionId;

  // If no session ID provided, this is a new conversation - generate one
  if (!currentSessionId) {
    currentSessionId = generateSessionId();
  }

  // Check if sessionId is a character slug
  // If so, use character slug for memory storage; otherwise use authenticated user ID
  if (isCharacterSlug(currentSessionId)) {
    memoryUserId = currentSessionId.toLowerCase(); // Use character slug for memory (e.g., "sheela", "ritvik")
    // For characters, don't save to Supabase database (only save to Mem0 memory)
    userId = null; // Don't save character chats to Supabase
  } else if (session?.user?.id) {
    userId = session.user.id;
    memoryUserId = session.user.id; // Use authenticated user ID for memory
  }

  // Check if user has calendar permissions
  const hasCalendarAccess =
    session?.user?.user_metadata?.calendar_permission_granted ||
    session?.provider_token;

  // Helper function to extract text from UIMessage
  const getMessageText = (message: UIMessage): string => {
    return message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(" ");
  };

  // Get user ID and load memories
  try {
    if (memoryUserId) {
      // Search for relevant memories from Mem0 - use broader search terms
      const lastMessage = getMessageText(messages[messages.length - 1]) || "";
      const searchQuery =
        lastMessage ||
        "user information personal details education routine schedule";

      const memories = await searchUserMemories(memoryUserId, searchQuery);
      memoryContext = formatMemoriesForContext(memories);

      console.log({ memoryContext, memoryUserId });
      console.log("Found memories for user:", memories.length);
    }
  } catch (error) {
    console.error("Error retrieving memories:", error);
    // Continue without context if there's an error
  }

  // Configure tools based on calendar access
  const hasCalendarTools = hasCalendarAccess;

  // Set session for calendar service if user has access
  if (hasCalendarTools) {
    googleCalendarService.setSession(session);
  }

  // Create memory tools with the correct userId bound (so AI doesn't need to pass it)
  // Use memoryUserId if available (for characters), otherwise userId (for authenticated users), 
  // or fallback to sessionId as a last resort
  const toolsWithUserId = memoryUserId || userId || currentSessionId;
  const memoryToolsWithUserId = createMemoryTools(toolsWithUserId);

  const result = streamText({
    model: geminiModel,
    messages: convertToModelMessages(messages),
    system: `
    You are SIA, a warm and empathetic AI wellness companion.
Your purpose is to help users find calm, balance, and mindfulness in daily life.

Guidelines:

Be gentle, supportive, and non-judgmental.

Focus on mental health, mindfulness, and self-care.

Keep responses short, soothing, and meaningful.

Ask thoughtful questions to understand the user.

Offer practical guidance for stress, anxiety, and wellness routines.

When discussing schedules, suggest mindful breaks or breathing exercises.

Always use MEMORIES for personal details (name, education, habits, etc.).

If the user asks about their info, check MEMORIES first and respond from there.

Calendar Access:
${
  hasCalendarTools
    ? "You can access the user's Google Calendar via: getTodayEvents, getUpcomingEvents (days), searchCalendarEvents (keyword), getEventsInRange (date range), Use these automatically when users mention meetings or schedules. After checking events, suggest wellness breaks, meditation slots, or stress-relief moments."
    : "If the user asks about their calendar, include [CALENDAR_BUTTON] to connect their calendar for personalized planning."
}

Reminder:
SIA supports wellness, not professional medical advice.

Memory Context about the user:${memoryContext}

IMPORTANT: When users share personal information, preferences, goals, or important facts about themselves,
use the saveMemory tool to store this information for future conversations. This helps create a personalized experience.
The user ID has been automatically set, so you don't need to pass it when calling memory tools.`,
    // Include calendar tools if user has access, always include memory tools with bound userId
    tools: hasCalendarTools
      ? { ...calendarTools, ...memoryToolsWithUserId }
      : memoryToolsWithUserId,
    stopWhen: stepCountIs(7),
    experimental_transform: smoothStream({
      delayInMs: 30,
      chunking: "word",
    }),
    onFinish: async ({ text }) => {
      // Handle character-based chats (only save to Mem0 memory, not Supabase)
      if (isCharacterSlug(currentSessionId) && memoryUserId) {
        try {
          // Get the last user message and convert to simple format
          const lastUserMessage = getMessageText(messages[messages.length - 1]);
          const conversationMessages: Array<{ role: "user" | "assistant"; content: string }> = [
            {
              role: "user",
              content: lastUserMessage
            },
            {
              role: "assistant",
              content: text
            }
          ];
          
          await addIntelligentMemories(memoryUserId, conversationMessages);
          console.log("Conversation saved to character memory:", memoryUserId);
        } catch (memoryError) {
          console.error("Error saving to character memory:", memoryError);
        }
      }
      // Handle authenticated user chats (save to both Supabase and Mem0)
      else if (userId && currentSessionId) {
        try {
          // Check if this is the first message in a new session
          const { data: existingSession } = await supabase
            .from("chat_sessions")
            .select("id")
            .eq("id", currentSessionId)
            .single();

          // Create session if it doesn't exist
          if (!existingSession) {
            const firstUserMessage = getMessageText(
              messages[messages.length - 1]
            );
            await supabase.from("chat_sessions").insert([
              {
                id: currentSessionId,
                user_id: userId,
                title:
                  firstUserMessage.length > 50
                    ? firstUserMessage.substring(0, 50) + "..."
                    : firstUserMessage,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ]);
          }

          // Save the user message (last message in the array) with full parts
          const userUIMessage = messages[messages.length - 1];
          await saveUIMessage(userUIMessage, currentSessionId, userId);

          // Save the assistant response with full parts
          // Create a UIMessage from the text response
          const assistantUIMessage: UIMessage = {
            id: `msg-${Date.now()}`,
            role: "assistant",
            parts: [{ type: "text", text }],
          };
          await saveUIMessage(assistantUIMessage, currentSessionId, userId);

          console.log("Messages saved to database");
        } catch (error) {
          console.error("Error saving messages to database:", error);
        }
      }
    },
  });

  // Return UIMessage stream response with session ID and custom ID generator
  // Note: Memories are now saved via the saveMemory tool which the AI can call when needed
  return result.toUIMessageStreamResponse({
    generateMessageId: createIdGenerator({
      prefix: "msg",
      size: 16,
    }),
    headers: {
      "X-Session-ID": currentSessionId,
    },
  });
}
