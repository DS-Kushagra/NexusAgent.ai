import { NextRequest, NextResponse } from "next/server";
import { sendAllWeeklyReports } from "@/lib/actions/weekly-reports.action";

// Weekly cron job to send progress reports
// Run every Monday morning
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "your-secret-key";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Send weekly reports to all active users
    const result = await sendAllWeeklyReports();

    return NextResponse.json({
      success: result.success,
      reportsSent: result.reportsSent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in weekly reports:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
