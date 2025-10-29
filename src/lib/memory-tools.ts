import { tool } from "ai";
import { z } from "zod";
import { addIntelligentMemories } from "./mem0";

export const memoryTools = {
  saveMemory: tool({
    description: `Save important information about the user to long-term memory. Use this when:
- User shares personal information (name, age, occupation, goals, preferences)
- User mentions important facts about their life, health, or wellness journey
- User expresses preferences, dislikes, or habits
- User shares goals, challenges, or concerns
- Any information that would be useful to remember for future conversations

Examples of what to save:
- "User is a 25-year-old software engineer"
- "User prefers morning workouts"
- "User has anxiety issues and uses meditation"
- "User's goal is to lose 10 pounds"
- "User dislikes spicy food"

Do NOT save:
- Temporary information (today's schedule, current weather)
- Generic responses or small talk
- Information already stored in previous conversations`,
    inputSchema: z.object({
      userId: z.string().describe("The user's unique ID"),
      memoryContent: z
        .string()
        .describe(
          "The important information to save about the user. Be concise and factual."
        ),
      context: z
        .string()
        .optional()
        .describe(
          "Optional context about where this information came from in the conversation"
        ),
    }),
    execute: async ({ userId, memoryContent, context }) => {
      try {
        console.log("saveMemory tool called with:", { userId, memoryContent, context });

        // Create a conversation format for Mem0
        // Format as a more natural conversation that Mem0 can extract from
        const messages = [
          {
            role: "user" as const,
            content: context || `I want to share some information: ${memoryContent}`,
          },
          {
            role: "assistant" as const,
            content: `I understand. Let me note that: ${memoryContent}`,
          },
        ];

        console.log("Calling addIntelligentMemories with messages:", messages);
        const result = await addIntelligentMemories(userId, messages);
        console.log("addIntelligentMemories result:", result);

        return {
          success: true,
          message: `Memory saved successfully: "${memoryContent.substring(
            0,
            50
          )}${memoryContent.length > 50 ? "..." : ""}"`,
          result,
        };
      } catch (error) {
        console.error("Error saving memory:", error);
        return {
          success: false,
          message: "Failed to save memory",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  }),

  saveConversationMemories: tool({
    description: `Save multiple important facts from the current conversation to long-term memory.
Use this at the end of a conversation or when the user shares multiple important pieces of information.
This will extract and save only the most relevant memories from the conversation context provided.`,
    inputSchema: z.object({
      userId: z.string().describe("The user's unique ID"),
      conversationSummary: z
        .array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        )
        .describe(
          "Recent conversation messages to extract memories from (last 3-5 exchanges)"
        ),
    }),
    execute: async ({ userId, conversationSummary }) => {
      try {
        await addIntelligentMemories(userId, conversationSummary);

        return {
          success: true,
          message: `Conversation memories extracted and saved successfully`,
          extractedFrom: conversationSummary.length,
        };
      } catch (error) {
        console.error("Error saving conversation memories:", error);
        return {
          success: false,
          message: "Failed to save conversation memories",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  }),
};
