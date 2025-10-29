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
  addIntelligentMemories,
  formatMemoriesForContext,
} from "@/lib/mem0";
import { generateSessionId, saveUIMessage } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { calendarTools } from "@/lib/calendar-tools";

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

  // Get user ID and load memories (with timeout to prevent blocking)
  try {
    if (session?.user?.id) {
      userId = session.user.id;

      // Search for relevant memories from Mem0 - use broader search terms
      const lastMessage = getMessageText(messages[messages.length - 1]) || "";
      const searchQuery =
        lastMessage ||
        "user information personal details education routine schedule";

      if (userId) {
        // Add timeout to prevent memory loading from blocking too long
        const memoriesPromise = searchUserMemories(userId, searchQuery);
        const timeoutPromise = new Promise<any[]>((resolve) =>
          setTimeout(() => resolve([]), 2000)
        );

        const memories = await Promise.race([memoriesPromise, timeoutPromise]);
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
- ALWAYS use the user's MEMORIES first. If memories contain personal information (name, education, routine, etc.), reference them directly in your response.
- When user asks about their basic info, education, or personal details, check memories first and provide information from there.


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

  // Return UIMessage stream response IMMEDIATELY for streaming
  // Save to Mem0 asynchronously without blocking the stream
  if (userId && messages.length > 0) {
    // Fire and forget - don't await this
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
  }

  // Return UIMessage stream response with session ID and custom ID generator
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
