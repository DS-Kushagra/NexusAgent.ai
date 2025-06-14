import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  // Create session for logging
  const sessionId = logger.createSession();

  try {
    // Log the API call request
    await logger.logApiCall(
      sessionId,
      userid,
      "/api/vapi/generate",
      {
        type,
        role,
        level,
        techstack,
        amount,
        userid,
      },
      null
    );

    // Log processing start
    await logger.logProcessing(sessionId, userid, "question_generation_start", {
      requestParams: { type, role, level, techstack, amount },
    });

    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
          Thank you! <3
    `,
    });

    // Log successful question generation
    await logger.logProcessing(
      sessionId,
      userid,
      "question_generation_success",
      {
        questionsGenerated: questions,
        questionsCount: questions.length,
      }
    );

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    // Log database save attempt
    await logger.logProcessing(sessionId, userid, "database_save_start", {
      interviewData: interview,
    });

    await db.collection("interviews").add(interview);

    // Log successful completion
    await logger.logProcessing(
      sessionId,
      userid,
      "interview_creation_success",
      {
        interviewId: "generated",
        sessionId,
      }
    );

    // Log the API response
    await logger.logApiCall(
      sessionId,
      userid,
      "/api/vapi/generate",
      {
        type,
        role,
        level,
        techstack,
        amount,
        userid,
      },
      { success: true }
    );

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);

    // Log the error
    await logger.logError(
      sessionId,
      userid,
      error instanceof Error ? error.message : String(error),
      {
        endpoint: "/api/vapi/generate",
        requestParams: { type, role, level, techstack, amount, userid },
        stack: error instanceof Error ? error.stack : undefined,
      }
    );

    // Log the API error response
    await logger.logApiCall(
      sessionId,
      userid,
      "/api/vapi/generate",
      {
        type,
        role,
        level,
        techstack,
        amount,
        userid,
      },
      { success: false, error: error }
    );

    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
