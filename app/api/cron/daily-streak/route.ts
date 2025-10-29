import { NextRequest, NextResponse } from "next/server";
import {
  checkAndNotifyStreaks,
  resetBrokenStreaks,
} from "@/lib/actions/streak.action";

// Daily cron job to check streaks and send reminders
// Set up in Vercel Cron Jobs or run via external scheduler
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "your-secret-key";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check streaks and send notifications
    const notifyResult = await checkAndNotifyStreaks();

    // Reset broken streaks
    const resetResult = await resetBrokenStreaks();

    return NextResponse.json({
      success: true,
      notificationsSent: notifyResult.notificationsSent,
      streaksReset: resetResult.streaksReset,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in daily streak check:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
