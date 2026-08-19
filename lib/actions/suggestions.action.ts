"use server";

import { db } from "@/firebase/admin";
import { sendInterviewSuggestion } from "@/lib/email-service";
import { logger } from "@/lib/logger";
import dayjs from "dayjs";

// Analyze user history and generate personalized interview suggestions
export async function generateInterviewSuggestions(
  userId: string
): Promise<InterviewSuggestion[]> {
  const sessionId = logger.createSession();

  try {
    // Get user's interview history
    const interviewsSnapshot = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .where("finalized", "==", true)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const interviews = interviewsSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Interview)
    );

    // Get feedback for these interviews
    const feedbackPromises = interviews.map(async (interview) => {
      const feedbackSnapshot = await db
        .collection("feedback")
        .where("interviewId", "==", interview.id)
        .where("userId", "==", userId)
        .limit(1)
        .get();

      if (!feedbackSnapshot.empty) {
        return feedbackSnapshot.docs[0].data() as Feedback;
      }
      return null;
    });

    const feedbacks = (await Promise.all(feedbackPromises)).filter(
      (f) => f !== null
    ) as Feedback[];

    // Analyze performance by category
    const categoryPerformance = new Map<
      string,
      { total: number; count: number }
    >();

    feedbacks.forEach((feedback) => {
      feedback.categoryScores.forEach((category) => {
        const existing = categoryPerformance.get(category.name) || {
          total: 0,
          count: 0,
        };
        categoryPerformance.set(category.name, {
          total: existing.total + category.score,
          count: existing.count + 1,
        });
      });
    });

    // Find weak categories (average score < 60)
    const weakCategories = Array.from(categoryPerformance.entries())
      .map(([name, data]) => ({
        name,
        average: data.total / data.count,
      }))
      .filter((cat) => cat.average < 60)
      .sort((a, b) => a.average - b.average);

    // Analyze tech stack usage
    const techStackUsage = new Map<string, number>();
    interviews.forEach((interview) => {
      interview.techstack.forEach((tech) => {
        techStackUsage.set(tech, (techStackUsage.get(tech) || 0) + 1);
      });
    });

    // Find underrepresented tech stacks
    const allTechStacks = [
      "React",
      "Node.js",
      "Python",
      "JavaScript",
      "TypeScript",
      "Java",
      "AWS",
      "Docker",
      "MongoDB",
      "PostgreSQL",
    ];
    const underrepresentedTech = allTechStacks.filter(
      (tech) => !techStackUsage.has(tech) || techStackUsage.get(tech)! < 2
    );

    // Analyze interview types
    const typeCount = new Map<string, number>();
    interviews.forEach((interview) => {
      typeCount.set(interview.type, (typeCount.get(interview.type) || 0) + 1);
    });

    const suggestions: InterviewSuggestion[] = [];

    // Suggestion 1: Focus on weak categories
    if (weakCategories.length > 0) {
      const weakestCategory = weakCategories[0];
      const relatedRole =
        weakestCategory.name.includes("Technical") ||
        weakestCategory.name.includes("Problem")
          ? "Software Engineer"
          : "Product Manager";

      suggestions.push({
        role: relatedRole,
        level: "Mid-Level",
        type: "Technical",
        techStack: Array.from(techStackUsage.keys()).slice(0, 3),
        reason: `You scored ${Math.round(weakestCategory.average)}/100 in ${
          weakestCategory.name
        }. Practice this area to improve your overall performance.`,
        priority: 1,
      });
    }

    // Suggestion 2: Explore new tech stacks
    if (underrepresentedTech.length > 0) {
      const newTechStack = underrepresentedTech.slice(0, 3);
      suggestions.push({
        role: "Full Stack Developer",
        level: "Mid-Level",
        type: "Technical",
        techStack: newTechStack,
        reason: `Expand your skills with ${newTechStack.join(
          ", "
        )}. Diversifying your tech stack knowledge improves job prospects.`,
        priority: 2,
      });
    }

    // Suggestion 3: Balance interview types
    const hasLessBehavioral =
      (typeCount.get("Behavioral") || 0) <
      (typeCount.get("Technical") || 0) / 2;
    if (hasLessBehavioral) {
      suggestions.push({
        role: "Software Engineer",
        level: "Senior",
        type: "Behavioral",
        techStack: [],
        reason:
          "Balance your preparation with behavioral interviews. Many companies weigh soft skills heavily in hiring decisions.",
        priority: 3,
      });
    }

    // Suggestion 4: Level progression
    const avgScore =
      feedbacks.reduce((sum, f) => sum + f.totalScore, 0) / feedbacks.length;
    if (avgScore > 75 && !interviews.some((i) => i.level === "Senior")) {
      suggestions.push({
        role: "Senior Software Engineer",
        level: "Senior",
        type: "Technical",
        techStack: Array.from(techStackUsage.keys()).slice(0, 4),
        reason: `Your average score is ${Math.round(
          avgScore
        )}/100. Challenge yourself with senior-level interviews!`,
        priority: 4,
      });
    }

    // Suggestion 5: Reinforce strengths with advanced topics
    if (avgScore > 65) {
      const mostUsedTech = Array.from(techStackUsage.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map((entry) => entry[0]);

      suggestions.push({
        role: "Technical Lead",
        level: "Senior",
        type: "System Design",
        techStack: mostUsedTech,
        reason: `You're performing well! Deepen your expertise in ${mostUsedTech.join(
          " and "
        )} with system design interviews.`,
        priority: 5,
      });
    }

    // If no specific suggestions, provide general ones
    if (suggestions.length === 0) {
      suggestions.push({
        role: "Software Engineer",
        level: "Mid-Level",
        type: "Technical",
        techStack: ["JavaScript", "React", "Node.js"],
        reason:
          "Start with fundamental full-stack interviews to build a strong foundation.",
        priority: 1,
      });

      suggestions.push({
        role: "Frontend Developer",
        level: "Mid-Level",
        type: "Behavioral",
        techStack: ["React", "TypeScript"],
        reason:
          "Practice behavioral questions to complement your technical skills.",
        priority: 2,
      });
    }

    await logger.logProcessing(sessionId, userId, "suggestions_generated", {
      suggestionCount: suggestions.length,
      interviewsAnalyzed: interviews.length,
    });

    return suggestions.sort((a, b) => a.priority - b.priority).slice(0, 5);
  } catch (error) {
    await logger.logError(
      sessionId,
      userId,
      error instanceof Error ? error.message : String(error),
      {
        action: "generateInterviewSuggestions",
        stack: error instanceof Error ? error.stack : undefined,
      }
    );

    // Return default suggestions on error
    return [
      {
        role: "Software Engineer",
        level: "Mid-Level",
        type: "Technical",
        techStack: ["JavaScript", "React"],
        reason: "Build a strong foundation with general technical interviews.",
        priority: 1,
      },
    ];
  }
}

// Send interview suggestions to users (run via cron or on-demand)
export async function sendSuggestionsToUser(userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const sessionId = logger.createSession();

  try {
    // Get user information
    const userDoc = await db.collection("users").doc(userId).get();
    const user = userDoc.data() as User;

    if (!user?.email) {
      return { success: false, error: "User email not found" };
    }

    // Check user preferences
    const prefsDoc = await db.collection("user_preferences").doc(userId).get();
    const prefs = prefsDoc.data() as UserPreferences | undefined;

    if (prefs?.interviewSuggestions === false) {
      return {
        success: false,
        error: "User has disabled interview suggestions",
      };
    }

    // Generate suggestions
    const suggestions = await generateInterviewSuggestions(userId);

    if (suggestions.length === 0) {
      return { success: false, error: "No suggestions generated" };
    }

    // Send email
    const emailResult = await sendInterviewSuggestion({
      to: user.email,
      userName: user.name,
      suggestions: suggestions.map((s) => ({
        role: s.role,
        type: s.type,
        reason: s.reason,
        techStack: s.techStack,
      })),
    });

    if (emailResult.success) {
      await logger.logProcessing(sessionId, userId, "suggestions_email_sent", {
        suggestionCount: suggestions.length,
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
        action: "sendSuggestionsToUser",
        stack: error instanceof Error ? error.stack : undefined,
      }
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Send suggestions to all active users (run weekly via cron)
export async function sendWeeklySuggestions(): Promise<{
  success: boolean;
  suggestionsSent: number;
}> {
  const sessionId = logger.createSession();
  let suggestionsSent = 0;

  try {
    // Get users who have completed at least one interview
    const oneWeekAgo = dayjs().subtract(7, "days").toISOString();

    // Get active users (interviewed in last 30 days)
    const interviewsSnapshot = await db
      .collection("interviews")
      .where("finalized", "==", true)
      .where("createdAt", ">", dayjs().subtract(30, "days").toISOString())
      .get();

    const activeUserIds = new Set<string>();
    interviewsSnapshot.docs.forEach((doc) => {
      const interview = doc.data() as Interview;
      activeUserIds.add(interview.userId);
    });

    await logger.logProcessing(
      sessionId,
      "system",
      "sending_weekly_suggestions",
      {
        activeUsers: activeUserIds.size,
      }
    );

    for (const userId of activeUserIds) {
      try {
        const result = await sendSuggestionsToUser(userId);
        if (result.success) {
          suggestionsSent++;
        }
      } catch (error) {
        await logger.logError(
          sessionId,
          userId,
          error instanceof Error ? error.message : String(error),
          {
            action: "sendWeeklySuggestion",
            stack: error instanceof Error ? error.stack : undefined,
          }
        );
      }
    }

    await logger.logProcessing(
      sessionId,
      "system",
      "weekly_suggestions_complete",
      {
        suggestionsSent,
      }
    );

    return { success: true, suggestionsSent };
  } catch (error) {
    await logger.logError(
      sessionId,
      "system",
      error instanceof Error ? error.message : String(error),
      {
        action: "sendWeeklySuggestions",
        stack: error instanceof Error ? error.stack : undefined,
      }
    );

    return { success: false, suggestionsSent };
  }
}
