import MemoryClient from "mem0ai";

// Initialize Mem0 client with API key from environment variables
const mem0Client = new MemoryClient({
  apiKey: process.env.MEM0_API_KEY!,
});

export { mem0Client };

// Helper function to search memories for a specific user
export async function searchUserMemories(userId: string, query: string) {
  try {
    console.log("Searching memories for user:", userId);
    console.log("Search query:", query);
    
    const filters = {
      OR: [{ user_id: userId }],
    };

    const results = await mem0Client.search(query, {
      api_version: "v2",
      filters: filters,
    });

    console.log("Search results:", { results, filters, query });

    return results;
  } catch (error) {
    console.error("Error searching memories:", error);
    return [];
  }
}

// Helper to fetch all memories for a specific user (best-effort by using large top_k)
export async function listAllUserMemories(userId: string) {
  try {
    console.log("Listing ALL memories for user:", userId);
    const filters = { OR: [{ user_id: userId }] };
    // Use wildcard-style non-empty query and high top_k to retrieve as many as possible
    let results = await mem0Client.search("*", {
      api_version: "v2",
      filters,
      // Many vector/search APIs support top_k or limit; include both for compatibility
      top_k: 1000 as any,
      limit: 1000 as any,
    } as any);
    // Fallback if API doesn't support '*'
    if (!Array.isArray(results) || results.length === 0) {
      results = await mem0Client.search("a", {
        api_version: "v2",
        filters,
        top_k: 1000 as any,
        limit: 1000 as any,
      } as any);
    }
    console.log("All memories results count:", Array.isArray(results) ? results.length : 0);
    return results;
  } catch (error) {
    console.error("Error listing all memories:", error);
    return [];
  }
}

// Helper function to add memories for a specific user
export async function addUserMemories(
  userId: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>
) {
  try {
    const result = await mem0Client.add(messages, { user_id: userId });
    return result;
  } catch (error) {
    console.error("Error adding memories:", error);
    throw error;
  }
}

// Helper function to add memories with intelligent extraction (default behavior)
export async function addIntelligentMemories(
  userId: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>
) {
  try {
    console.log("Adding memories for user:", userId);
    console.log("Messages to add:", messages);
    
    // Mem0 will automatically extract relevant facts, preferences, and important information
    // from the conversation and store only the meaningful parts
    const result = await mem0Client.add(messages, {
      user_id: userId,
      // Let Mem0's AI decide what's worth remembering
      // This will extract ~8-10 relevant memories from 25 messages
    });
    
    console.log("Memory add result:", result);
    return result;
  } catch (error) {
    console.error("Error adding intelligent memories:", error);
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

// Update a single memory by id; fallback to delete+add if SDK lacks update
export async function updateUserMemory(
  userId: string,
  memoryId: string,
  newText: string
) {
  try {
    if ((mem0Client as any).update) {
      const res = await (mem0Client as any).update(memoryId, { memory: newText });
      return res;
    }
  } catch (e) {
    console.warn("mem0.update failed, will try delete+add fallback", e);
  }

  // Fallback: delete the old and add new
  try {
    if ((mem0Client as any).delete) {
      await (mem0Client as any).delete(memoryId);
    }
  } catch (e) {
    console.warn("mem0.delete failed; proceeding to add replacement", e);
  }

  const replacement = [
    { role: "assistant" as const, content: newText },
  ];
  return addUserMemories(userId, replacement);
}

export async function deleteUserMemory(memoryId: string) {
  try {
    if ((mem0Client as any).delete) {
      const res = await (mem0Client as any).delete(memoryId);
      return res;
    }
  } catch (e) {
    console.error("mem0.delete failed", e);
    throw e;
  }
}
