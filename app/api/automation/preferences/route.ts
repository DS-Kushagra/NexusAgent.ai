import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getUserPreferences,
  updateUserPreferences,
} from "@/lib/actions/schedule.action";

// GET: Get user's notification preferences
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = await getUserPreferences(user.id);

    return NextResponse.json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}

// PATCH: Update user's notification preferences
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      emailNotifications,
      weeklyReports,
      streakReminders,
      interviewSuggestions,
      preferredInterviewTime,
      preferredDays,
    } = body;

    const result = await updateUserPreferences({
      userId: user.id,
      preferences: {
        emailNotifications,
        weeklyReports,
        streakReminders,
        interviewSuggestions,
        preferredInterviewTime,
        preferredDays,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
