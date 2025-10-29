import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { generateInterviewSuggestions } from "@/lib/actions/suggestions.action";

// GET: Get personalized interview suggestions for the user
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const suggestions = await generateInterviewSuggestions(user.id);

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
