import { NextRequest, NextResponse } from "next/server";
import { sendUpcomingInterviewReminders } from "@/lib/actions/schedule.action";

// Cron job to send interview reminders (24 hours before)
// Run every hour or every 6 hours
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "your-secret-key";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Send reminders for upcoming interviews
    const result = await sendUpcomingInterviewReminders();

    return NextResponse.json({
      success: result.success,
      remindersSent: result.remindersSent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in interview reminders:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
