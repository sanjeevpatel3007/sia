import { geminiModel } from "@/lib/google-ai";
import {
  streamText,
  convertToModelMessages,
  UIMessage,
  createIdGenerator,
  stepCountIs,
} from "ai";
import { googleCalendarService } from "@/lib/google-calendar";
import {
  searchUserMemories,
  addIntelligentMemories,
  formatMemoriesForContext,
} from "@/lib/mem0";
import { generateSessionId, saveUIMessage } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { calendarTools } from "@/lib/calendar-tools";

export async function POST(req: Request) {
  const {
    messages,
    session,
    sessionId,
  }: { messages: UIMessage[]; session: any; sessionId?: string } =
    await req.json();

  let memoryContext = "";
  let userId: string | null = null;

  // Generate or use existing session ID
  let currentSessionId = sessionId;

  // If no session ID provided, this is a new conversation - generate one
  if (!currentSessionId) {
    currentSessionId = generateSessionId();
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
    if (session?.user?.id) {
      userId = session.user.id;

      // Search for relevant memories from Mem0
      const lastMessage = getMessageText(messages[messages.length - 1]) || "";
      if (userId) {
        const memories = await searchUserMemories(userId, lastMessage);
        memoryContext = formatMemoriesForContext(memories);

        console.log("Found memories for user:", memories.length);
      }
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

  const result = streamText({
    model: geminiModel,
    messages: convertToModelMessages(messages),
    system: `You are SIA, a gentle and supportive AI wellness companion. Your role is to guide users toward balance, calm, and wellness with patience and encouragement.

Key characteristics:
- Always be warm, empathetic, and non-judgmental
- Focus on mental health, mindfulness, and wellness
- Provide gentle guidance and support
- Use encouraging and calming language
- Help users with stress, anxiety, meditation, and self-care
- Keep responses concise but meaningful
- Ask thoughtful questions to understand their needs
- When discussing calendar or schedule, help users find balance and wellness in their busy lives
- Suggest mindful breaks, breathing exercises, or stress relief techniques between meetings
- Help users plan their day with wellness in mind

${
  hasCalendarTools
    ? `CALENDAR TOOLS AVAILABLE:
You have access to the user's Google Calendar through these tools:
- getTodayEvents: Get today's schedule
- getUpcomingEvents: Get upcoming events (specify days parameter)
- searchCalendarEvents: Search for specific events by keyword
- getEventsInRange: Get events in a date range

Use these tools AUTOMATICALLY when users ask about their schedule, meetings, or calendar. Don't ask for permission - just use them to provide accurate, personalized wellness advice based on their actual schedule.

After getting calendar data, help them find wellness opportunities like breaks between meetings, suggest meditation times, or recommend stress-relief activities around their busy schedule.`
    : `CALENDAR NOT CONNECTED:
When users ask calendar-related questions, include [CALENDAR_BUTTON] in your response to show a connect calendar button. Gracefully guide users to connect their calendar for personalized wellness planning.`
}

Remember: You're here to support their wellness journey, not to replace professional medical advice.${memoryContext}`,
    // Only include tools if user has calendar access
    ...(hasCalendarTools && {
      tools: calendarTools,
    }),
    stopWhen: stepCountIs(7),
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
            role: 'assistant',
            parts: [{ type: 'text', text }],
          };
          await saveUIMessage(assistantUIMessage, currentSessionId, userId);

          console.log("Messages saved to database");
        } catch (error) {
          console.error("Error saving messages to database:", error);
        }
      }
    },
  });

  // Save to Mem0 for intelligent memory extraction
  if (userId && messages.length > 0) {
    try {
      // SAVE TO MEM0 (Intelligent Memory Extraction)
      // This will extract only relevant facts from the conversation
      // From 25 messages, it will store only 8-10 important memories
      // Convert UIMessages to simple format for Mem0
      const conversationForMemory = messages
        .slice(-5)
        .filter((msg) => msg.role === "user" || msg.role === "assistant")
        .map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: getMessageText(msg),
        }));
      addIntelligentMemories(userId, conversationForMemory).catch((error) => {
        console.error("Error saving intelligent memories:", error);
      });

      console.log("Extracted memories to Mem0");
    } catch (error) {
      console.error("Error saving to Mem0:", error);
    }
  }

  // Return UIMessage stream response with session ID and custom ID generator
  const response = result.toUIMessageStreamResponse({
    generateMessageId: createIdGenerator({
      prefix: "msg",
      size: 16,
    }),
    headers: {
      "X-Session-ID": currentSessionId,
    },
  });

  return response;
}
