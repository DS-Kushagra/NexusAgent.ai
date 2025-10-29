import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewById,
  getFeedbackByInterviewId,
} from "@/lib/actions/general.action";
import { generateFeedbackPDF } from "@/lib/pdf-service";

// GET: Generate and download PDF report for an interview
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const interviewId = searchParams.get("interviewId");

    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID is required" },
        { status: 400 }
      );
    }

    // Get interview and feedback data
    const interview = await getInterviewById(interviewId);
    const feedback = await getFeedbackByInterviewId({
      interviewId,
      userId: user.id,
    });

    if (!interview || !feedback) {
      return NextResponse.json(
        { error: "Interview or feedback not found" },
        { status: 404 }
      );
    }

    // Generate PDF
    const pdfBuffer = await generateFeedbackPDF({
      userName: user.name,
      userEmail: user.email,
      interview: {
        role: interview.role,
        level: interview.level,
        type: interview.type,
        techstack: interview.techstack,
      },
      feedback: {
        totalScore: feedback.totalScore,
        categoryScores: feedback.categoryScores,
        strengths: feedback.strengths,
        areasForImprovement: feedback.areasForImprovement,
        finalAssessment: feedback.finalAssessment,
        createdAt: feedback.createdAt,
      },
    });

    // Return PDF as download
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Interview_Feedback_${
          interview.role
        }_${new Date().toISOString().split("T")[0]}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
