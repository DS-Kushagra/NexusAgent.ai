"use server";

import { db } from "@/firebase/admin";
import { sendWeeklyReport } from "@/lib/email-service";
import { generateWeeklyReportPDF } from "@/lib/pdf-service";
import { getUserStreak } from "./streak.action";
import { generateInterviewSuggestions } from "./suggestions.action";
import { logger } from "@/lib/logger";
import dayjs from "dayjs";

// Generate weekly report data for a user
export async function generateWeeklyReportData(
  userId: string
): Promise<WeeklyReportData | null> {
  const sessionId = logger.createSession();

  try {
    // Get user information
    const userDoc = await db.collection("users").doc(userId).get();
    const user = userDoc.data() as User;

    if (!user) {
      return null;
    }

    // Calculate week range (Monday to Sunday of current week)
    const today = dayjs();
    const weekStart = today.startOf("week").add(1, "day"); // Monday of this week
    const weekEnd = today.endOf("week").add(1, "day"); // Sunday of this week

    // Get interviews from the past week
    const interviewsSnapshot = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .where("finalized", "==", true)
      .where("createdAt", ">=", weekStart.toISOString())
      .where("createdAt", "<=", weekEnd.toISOString())
      .orderBy("createdAt", "desc")
      .get();

    const interviews = interviewsSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Interview)
    );

    if (interviews.length === 0) {
      // No interviews this week, don't send report
      return null;
    }

    // Get feedback for each interview
    const feedbackPromises = interviews.map(async (interview) => {
      const feedbackSnapshot = await db
        .collection("feedback")
        .where("interviewId", "==", interview.id)
        .where("userId", "==", userId)
        .limit(1)
        .get();

      if (!feedbackSnapshot.empty) {
        return {
          interview,
          feedback: feedbackSnapshot.docs[0].data() as Feedback,
        };
      }
      return null;
    });

    const interviewsWithFeedback = (await Promise.all(feedbackPromises)).filter(
      (item) => item !== null
    ) as Array<{ interview: Interview; feedback: Feedback }>;

    // Calculate statistics
    const totalInterviews = interviewsWithFeedback.length;
    const totalScore = interviewsWithFeedback.reduce(
      (sum, item) => sum + item.feedback.totalScore,
      0
    );
    const averageScore = Math.round(totalScore / totalInterviews);

    // Find best performance
    const bestInterview = interviewsWithFeedback.reduce((best, current) =>
      current.feedback.totalScore > best.feedback.totalScore ? current : best
    );
    const bestPerformance = `${bestInterview.interview.role} (${bestInterview.feedback.totalScore}/100)`;

    // Get current streak
    const streakData = await getUserStreak(userId);
    const currentStreak = streakData?.currentStreak || 0;

    // Calculate category averages
    const categoryScores = new Map<string, { total: number; count: number }>();

    interviewsWithFeedback.forEach(({ feedback }) => {
      feedback.categoryScores.forEach((category) => {
        const existing = categoryScores.get(category.name) || {
          total: 0,
          count: 0,
        };
        categoryScores.set(category.name, {
          total: existing.total + category.score,
          count: existing.count + 1,
        });
      });
    });

    const categoryAverages = Array.from(categoryScores.entries()).map(
      ([name, data]) => ({
        name,
        average: Math.round(data.total / data.count),
      })
    );

    // Collect top strengths (most common)
    const strengthsMap = new Map<string, number>();
    interviewsWithFeedback.forEach(({ feedback }) => {
      feedback.strengths.forEach((strength) => {
        strengthsMap.set(strength, (strengthsMap.get(strength) || 0) + 1);
      });
    });

    const topStrengths = Array.from(strengthsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((entry) => entry[0]);

    // Collect common areas for improvement
    const improvementsMap = new Map<string, number>();
    interviewsWithFeedback.forEach(({ feedback }) => {
      feedback.areasForImprovement.forEach((area) => {
        improvementsMap.set(area, (improvementsMap.get(area) || 0) + 1);
      });
    });

    const commonImprovements = Array.from(improvementsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((entry) => entry[0]);

    // Generate suggestions
    const suggestions = await generateInterviewSuggestions(userId);
    const suggestionTexts = suggestions
      .slice(0, 3)
      .map(
        (s) =>
          `Practice ${s.role} interviews to improve ${s.reason.toLowerCase()}`
      );

    // Prepare interview list for report
    const interviewsList = interviewsWithFeedback.map(
      ({ interview, feedback }) => ({
        role: interview.role,
        type: interview.type,
        score: feedback.totalScore,
        date: interview.createdAt,
      })
    );

    const reportData: WeeklyReportData = {
      userId,
      userName: user.name,
      userEmail: user.email,
      weekStart: weekStart.format("MMM D, YYYY"),
      weekEnd: weekEnd.format("MMM D, YYYY"),
      totalInterviews,
      averageScore,
      bestPerformance,
      currentStreak,
      suggestions: suggestionTexts,
      interviews: interviewsList,
      categoryAverages,
      topStrengths,
      commonImprovements,
    };

    await logger.logProcessing(sessionId, userId, "weekly_report_generated", {
      totalInterviews,
      averageScore,
      currentStreak,
    });

    return reportData;
  } catch (error) {
    await logger.logError(
      sessionId,
      userId,
      error instanceof Error ? error.message : String(error),
      {
        action: "generateWeeklyReportData",
        stack: error instanceof Error ? error.stack : undefined,
      }
    );

    return null;
  }
}

// Send weekly report to a user
export async function sendUserWeeklyReport(userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const sessionId = logger.createSession();

  try {
    // Check user preferences
    const prefsDoc = await db.collection("user_preferences").doc(userId).get();
    const prefs = prefsDoc.data() as UserPreferences | undefined;

    if (prefs?.weeklyReports === false) {
      return { success: false, error: "User has disabled weekly reports" };
    }

    // Generate report data
    const reportData = await generateWeeklyReportData(userId);

    if (!reportData) {
      return {
        success: false,
        error: "No interview activity this week or user not found",
      };
    }

    // Generate PDF report
    const pdfBuffer = await generateWeeklyReportPDF(reportData);

    // Send email with PDF attachment
    const emailResult = await sendWeeklyReport(
      {
        to: reportData.userEmail,
        userName: reportData.userName,
        weekStart: reportData.weekStart,
        weekEnd: reportData.weekEnd,
        totalInterviews: reportData.totalInterviews,
        averageScore: reportData.averageScore,
        bestPerformance: reportData.bestPerformance,
        currentStreak: reportData.currentStreak,
        suggestions: reportData.suggestions,
      },
      pdfBuffer
    );

    if (emailResult.success) {
      await logger.logProcessing(sessionId, userId, "weekly_report_sent", {
        weekStart: reportData.weekStart,
        weekEnd: reportData.weekEnd,
      });

      return { success: true };
    } else {
      return { success: false, error: emailResult.error };
    }
  } catch (error) {
    await logger.logError(
      sessionId,
      userId,
      error instanceof Error ? error.message : String(error),
      {
        action: "sendUserWeeklyReport",
        stack: error instanceof Error ? error.stack : undefined,
      }
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Send weekly reports to all active users (run via cron on Monday)
export async function sendAllWeeklyReports(): Promise<{
  success: boolean;
  reportsSent: number;
}> {
  const sessionId = logger.createSession();
  let reportsSent = 0;

  try {
    // Get users who completed interviews in the past 7 days (this week)
    const weekAgo = dayjs().subtract(7, "days").toISOString();

    const interviewsSnapshot = await db
      .collection("interviews")
      .where("finalized", "==", true)
      .where("createdAt", ">", weekAgo)
      .get();

    const userIds = new Set<string>();
    interviewsSnapshot.docs.forEach((doc) => {
      const interview = doc.data() as Interview;
      userIds.add(interview.userId);
    });

    await logger.logProcessing(sessionId, "system", "sending_weekly_reports", {
      activeUsers: userIds.size,
    });

    for (const userId of userIds) {
      try {
        const result = await sendUserWeeklyReport(userId);
        if (result.success) {
          reportsSent++;
        }
      } catch (error) {
        await logger.logError(
          sessionId,
          userId,
          error instanceof Error ? error.message : String(error),
          {
            action: "sendWeeklyReportToUser",
            stack: error instanceof Error ? error.stack : undefined,
          }
        );
      }
    }

    await logger.logProcessing(sessionId, "system", "weekly_reports_complete", {
      reportsSent,
    });

    return { success: true, reportsSent };
  } catch (error) {
    await logger.logError(
      sessionId,
      "system",
      error instanceof Error ? error.message : String(error),
      {
        action: "sendAllWeeklyReports",
        stack: error instanceof Error ? error.stack : undefined,
      }
    );

    return { success: false, reportsSent };
  }
}
