import { testCalendarAccess } from "@/lib/google-calendar";

export async function POST(req: Request) {
  try {
    const { session } = await req.json();

    if (!session) {
      return Response.json({ error: "No session provided" }, { status: 400 });
    }

    const result = await testCalendarAccess(session);

    return Response.json({
      success: result.success,
      message: result.success
        ? "Calendar access working"
        : `Calendar access failed: ${result.error}`,
      sessionData: {
        hasProviderToken: !!session.provider_token,
        hasCalendarPermission:
          !!session.user?.user_metadata?.calendar_permission_granted,
        userEmail: session.user?.email,
      },
      details: result.details,
      error: result.error,
    });
  } catch (error) {
    console.error("Calendar test error:", error);
    return Response.json(
      {
        error: "Calendar test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
