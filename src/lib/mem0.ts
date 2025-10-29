import MemoryClient from "mem0ai";

// Initialize Mem0 client with API key from environment variables
const mem0Client = new MemoryClient({
  apiKey: process.env.MEM0_API_KEY!,
});

export { mem0Client };

// Helper function to search memories for a specific user
export async function searchUserMemories(userId: string, query: string) {
  try {
    const filters = {
      OR: [{ user_id: userId }],
    };

    const results = await mem0Client.search(query, {
      api_version: "v2",
      filters: filters,
    });

    console.log({ results, filters, query });

    return results;
  } catch (error) {
    console.error("Error searching memories:", error);
    return [];
  }
}

// Helper function to add memories with intelligent extraction (default behavior)
export async function addIntelligentMemories(
  userId: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>
) {
  try {
    console.log("Adding memories for user:", userId);
    console.log("Messages to store:", JSON.stringify(messages, null, 2));

    const result = await mem0Client.add(messages, {
      user_id: userId,
    });

    console.log("Mem0 add result:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error("Error adding intelligent memories:", error);
    console.error("Error details:", error);
    throw error;
  }
}

// Helper function to add raw conversation (if you want full chat in Mem0 too)
export async function addRawConversation(
  userId: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>
) {
  try {
    const result = await mem0Client.add(messages, {
      user_id: userId,
      infer: false, // Store exact conversation without AI extraction
    });
    return result;
  } catch (error) {
    console.error("Error adding raw conversation:", error);
    throw error;
  }
}

// Helper function to format memories for LLM context
export function formatMemoriesForContext(
  memories: Array<{ memory?: string }>
): string {
  if (!memories || memories.length === 0) {
    return "";
  }

  const memoryTexts = memories
    .filter((memory) => memory.memory)
    .map((memory) => `- ${memory.memory}`)
    .join("\n");

  if (memoryTexts.length === 0) {
    return "";
  }

  return `\n\nRELEVANT MEMORIES:
${memoryTexts}`;
}
