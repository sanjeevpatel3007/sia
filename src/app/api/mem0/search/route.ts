import { NextRequest, NextResponse } from "next/server";
import { searchUserMemories } from "@/lib/mem0";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const query = searchParams.get("query");

    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }

    if (!query) {
      return NextResponse.json(
        { error: "query query parameter is required" },
        { status: 400 }
      );
    }

    // Search memories using mem0
    const memories = await searchUserMemories(userId, query);

    return NextResponse.json({
      success: true,
      memories,
      count: memories.length,
    });
  } catch (error) {
    console.error("Error in /api/mem0/search:", error);
    return NextResponse.json(
      {
        error: "Failed to search memories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
