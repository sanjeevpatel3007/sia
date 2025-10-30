import { geminiModel } from "@/lib/google-ai";
import {
  streamText,
  convertToModelMessages,
  UIMessage,
  createIdGenerator,
  stepCountIs,
  smoothStream,
} from "ai";
import {
  searchUserMemories,
  formatMemoriesForContext,
} from "@/lib/mem0";
import { generateSessionId, saveUIMessage } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { dummyCalendarTools } from "@/lib/dummy-calendar-tools";
import { memoryTools } from "@/lib/memory-tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    session,
    sessionId,
    personaId,
  }: { messages: UIMessage[]; session: any; sessionId?: string; personaId?: string } =
    await req.json();

  let memoryContext = "";
  let userId: string | null = null;

  // Generate or use existing session ID
  let currentSessionId = sessionId;

  // If no session ID provided, this is a new conversation - generate one
  if (!currentSessionId) {
    currentSessionId = generateSessionId();
  }

  // Helper function to extract text from UIMessage
  const getMessageText = (message: UIMessage): string => {
    return message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(" ");
  };

  // Get user ID and load memories
  try {
    // Use persona ID if provided, otherwise fall back to session user ID
    if (personaId) {
      userId = personaId;
    } else if (session?.user?.id) {
      userId = session.user.id;
    }

    if (userId) {
      // Search for relevant memories from Mem0 - use broader search terms
      const lastMessage = getMessageText(messages[messages.length - 1]) || "";
      const searchQuery =
        lastMessage ||
        "user information personal details education routine schedule";

      const memories = await searchUserMemories(userId, searchQuery);
      memoryContext = formatMemoriesForContext(memories);

      console.log({ memoryContext });
      console.log("Found memories for user:", memories.length);
    }
  } catch (error) {
    console.error("Error retrieving memories:", error);
    // Continue without context if there's an error
  }

  const result = streamText({
    model: geminiModel,
    messages: convertToModelMessages(messages),
    system: `
    You are SIA, a warm and empathetic AI wellness companion.
Your purpose is to help users find calm, balance, and mindfulness in daily life.

Current Date and Time: ${new Date().toLocaleString('en-IN', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Kolkata',
  timeZoneName: 'short'
})} (India Standard Time)

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
You can access the user's calendar via: getTodayEvents, getUpcomingEvents (days), searchCalendarEvents (keyword), getEventsInRange (date range). Use these automatically when users mention meetings or schedules. After checking events, suggest wellness breaks, meditation slots, or stress-relief moments.

IMPORTANT: When referring to event dates, always compare them to the Current Date above to determine if they are "today", "tomorrow", or a specific future date. Be accurate with date references.

Reminder:
SIA supports wellness, not professional medical advice.

Memory Context about the user:${memoryContext}

IMPORTANT: When users share personal information, preferences, goals, or important facts about themselves,
use the saveMemory tool to store this information for future conversations. This helps create a personalized experience.

Your User ID for saving memories: ${userId}`,
    // Include dummy calendar tools and memory tools
    tools: { ...dummyCalendarTools, ...memoryTools },
    stopWhen: stepCountIs(7),
    experimental_transform: smoothStream({
      delayInMs: 30,
      chunking: "word",
    }),
    onFinish: async ({ text }) => {
      // Save messages to database (both user and assistant)
      if (userId && currentSessionId) {
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
