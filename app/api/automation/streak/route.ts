import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getUserStreak } from "@/lib/actions/streak.action";

// GET: Get user's streak information
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const streak = await getUserStreak(user.id);

    return NextResponse.json({
      success: true,
      streak,
    });
  } catch (error) {
    console.error("Error fetching streak:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
