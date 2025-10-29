import { searchUserMemories, listAllUserMemories, updateUserMemory, addUserMemories, deleteUserMemory } from "@/lib/mem0";
import { isCharacterSlug } from "@/lib/characters";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = (searchParams.get("userId") || "").toLowerCase();
    const q = searchParams.get("q") || "user information personal details preferences goals health schedule";
    const all = searchParams.get("all") === "true";

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Only allow character slugs here to avoid exposing user memories
    if (!isCharacterSlug(userId)) {
      return new Response(JSON.stringify({ error: "Invalid character" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const results = all
      ? await listAllUserMemories(userId)
      : await searchUserMemories(userId, q);

    // Normalize output
    const memories = (results || []).map((r: any) => ({
      id: r.id || r._id || Math.random().toString(36).slice(2),
      memory: r.memory || r.text || "",
      score: r.score ?? r.similarity ?? undefined,
    }));

    return new Response(JSON.stringify({ memories }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching character memories:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch memories" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const userId = (body.userId || "").toLowerCase();
    const memoryId = body.memoryId as string;
    const memory = body.memory as string;

    if (!userId || !memoryId || !memory) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!isCharacterSlug(userId)) {
      return new Response(JSON.stringify({ error: "Invalid character" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await updateUserMemory(userId, memoryId, memory);
    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating character memory:", error);
    return new Response(JSON.stringify({ error: "Failed to update memory" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = (body.userId || "").toLowerCase();
    const memory = (body.memory || "").toString();

    if (!userId || !memory) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!isCharacterSlug(userId)) {
      return new Response(JSON.stringify({ error: "Invalid character" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const res = await addUserMemories(userId, [{ role: "assistant", content: memory }]);
    return new Response(JSON.stringify({ success: true, result: res }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding character memory:", error);
    return new Response(JSON.stringify({ error: "Failed to add memory" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const memoryId = searchParams.get("memoryId");

    if (!memoryId) {
      return new Response(JSON.stringify({ error: "Missing memoryId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const res = await deleteUserMemory(memoryId);
    return new Response(JSON.stringify({ success: true, result: res }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting character memory:", error);
    return new Response(JSON.stringify({ error: "Failed to delete memory" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


