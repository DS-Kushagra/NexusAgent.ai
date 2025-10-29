import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { generateWeeklyReportData } from "@/lib/actions/weekly-reports.action";

// GET: Get user's weekly report data
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reportData = await generateWeeklyReportData(user.id);

    if (!reportData) {
      return NextResponse.json(
        { error: "No interview activity this week" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      reportData,
    });
  } catch (error) {
    console.error("Error generating weekly report:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
