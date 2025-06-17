"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";
import { logger } from "@/lib/logger";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  // Create session for logging
  const sessionId = logger.createSession();

  try {
    // Log feedback creation start
    await logger.logProcessing(sessionId, userId, "feedback_creation_start", {
      interviewId,
      feedbackId,
      transcriptLength: transcript.length,
    });

    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    // Log AI analysis start
    await logger.logProcessing(
      sessionId,
      userId,
      "ai_feedback_analysis_start",
      {
        transcriptLength: formattedTranscript.length,
      }
    );

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    // Log successful AI analysis
    await logger.logProcessing(
      sessionId,
      userId,
      "ai_feedback_analysis_success",
      {
        totalScore: object.totalScore,
        categoryScores: object.categoryScores,
        strengthsCount: object.strengths?.length || 0,
        improvementsCount: object.areasForImprovement?.length || 0,
      }
    );

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };
    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
      await logger.logProcessing(
        sessionId,
        userId,
        "updating_existing_feedback",
        {
          feedbackId,
        }
      );
    } else {
      feedbackRef = db.collection("feedback").doc();
      await logger.logProcessing(sessionId, userId, "creating_new_feedback", {
        newFeedbackId: feedbackRef.id,
      });
    }

    await feedbackRef.set(feedback);

    // Log successful feedback save
    await logger.logProcessing(sessionId, userId, "feedback_save_success", {
      feedbackId: feedbackRef.id,
      interviewId,
      totalScore: feedback.totalScore,
    });

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);

    // Log the error
    await logger.logError(
      sessionId,
      userId,
      error instanceof Error ? error.message : String(error),
      {
        action: "createFeedback",
        interviewId,
        feedbackId,
        stack: error instanceof Error ? error.stack : undefined,
      }
    );

    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  // Validate userId before making the query
  if (!userId || userId === "undefined" || userId.trim() === "") {
    console.warn("getLatestInterviews called with invalid userId:", userId);
    // Return all latest interviews without userId filter if userId is invalid
    try {
      // Simplified query that doesn't require the complex index
      const interviews = await db
        .collection("interviews")
        .where("finalized", "==", true)
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();

      return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Interview[];
    } catch (error) {
      console.error("Error fetching latest interviews:", error);
      return [];
    }
  }
  try {
    // Query with userId filter
    const interviews = await db
      .collection("interviews")
      .where("finalized", "==", true)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    console.error("Error fetching latest interviews:", error);
    return [];
  }
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  // Validate userId before making the query
  if (!userId || userId === "undefined" || userId.trim() === "") {
    console.warn("getInterviewsByUserId called with invalid userId:", userId);
    return [];
  }

  try {
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    console.error("Error fetching interviews by userId:", error);
    return [];
  }
}
