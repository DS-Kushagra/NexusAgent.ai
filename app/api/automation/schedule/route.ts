import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  createScheduledInterview,
  getUserScheduledInterviews,
  updateScheduledInterviewStatus,
} from "@/lib/actions/schedule.action";

// GET: Get user's scheduled interviews
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scheduledInterviews = await getUserScheduledInterviews(user.id);

    return NextResponse.json({
      success: true,
      scheduledInterviews,
    });
  } catch (error) {
    console.error("Error fetching scheduled interviews:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}

// POST: Create a new scheduled interview
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { role, level, type, techstack, scheduledTime } = body;

    if (!role || !level || !type || !scheduledTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await createScheduledInterview({
      userId: user.id,
      role,
      level,
      type,
      techstack: techstack || [],
      scheduledTime,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating scheduled interview:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}

// PATCH: Update scheduled interview status
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { scheduleId, status, interviewId } = body;

    if (!scheduleId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await updateScheduledInterviewStatus({
      scheduleId,
      status,
      interviewId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating scheduled interview:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
