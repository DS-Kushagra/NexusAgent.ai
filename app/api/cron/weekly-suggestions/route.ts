import { NextRequest, NextResponse } from "next/server";
import { sendWeeklySuggestions } from "@/lib/actions/suggestions.action";

// Weekly cron job to send personalized interview suggestions
// Run every Wednesday
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "your-secret-key";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Send suggestions to all active users
    const result = await sendWeeklySuggestions();

    return NextResponse.json({
      success: result.success,
      suggestionsSent: result.suggestionsSent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in weekly suggestions:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
