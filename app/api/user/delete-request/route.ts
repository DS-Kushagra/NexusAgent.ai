import { NextRequest, NextResponse } from "next/server";
import { requestAccountDeletion } from "@/lib/actions/account.action";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reason } = body;

    if (!reason || reason.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a detailed reason (minimum 10 characters)" },
        { status: 400 }
      );
    }

    const result = await requestAccountDeletion(reason);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to process request" },
        { status: result.error === "Unauthorized" ? 401 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Account deletion request submitted successfully",
    });
  } catch (error) {
    console.error("Error in POST /api/user/delete-request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
