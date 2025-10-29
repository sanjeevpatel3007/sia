import { NextRequest, NextResponse } from "next/server";
import { addIntelligentMemories } from "@/lib/mem0";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, messages } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Validate message format
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return NextResponse.json(
          { error: "Each message must have 'role' and 'content' fields" },
          { status: 400 }
        );
      }
      if (!["user", "assistant"].includes(msg.role)) {
        return NextResponse.json(
          { error: "Message role must be 'user' or 'assistant'" },
          { status: 400 }
        );
      }
    }

    // Store memories using mem0
    const result = await addIntelligentMemories(userId, messages);

    return NextResponse.json({
      success: true,
      result,
      message: "Memories stored successfully",
    });
  } catch (error) {
    console.error("Error in /api/mem0/add:", error);
    return NextResponse.json(
      {
        error: "Failed to store memories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
