"use server";

import { db } from "@/firebase/admin";
import { sendStreakReminder } from "@/lib/email-service";
import { logger } from "@/lib/logger";
import dayjs from "dayjs";

// Get or initialize user streak
export async function getUserStreak(
  userId: string
): Promise<UserStreak | null> {
  try {
    const doc = await db.collection("user_streaks").doc(userId).get();

    if (!doc.exists) {
      // Initialize streak for new user
      const streak: UserStreak = {
        id: userId,
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastInterviewDate: "",
        totalInterviews: 0,
        updatedAt: new Date().toISOString(),
      };

      await db.collection("user_streaks").doc(userId).set(streak);
      return streak;
    }

    return doc.data() as UserStreak;
  } catch (error) {
    console.error("Error getting user streak:", error);
    return null;
  }
}

// Update streak when user completes an interview
export async function updateStreak(userId: string): Promise<{
  success: boolean;
  currentStreak: number;
  isNewRecord: boolean;
}> {
  const sessionId = logger.createSession();

  try {
    const streakDoc = await db.collection("user_streaks").doc(userId).get();
    const today = dayjs().format("YYYY-MM-DD");

    let currentStreak = 0;
    let longestStreak = 0;
    let totalInterviews = 0;
    let lastInterviewDate = "";
    let isNewRecord = false;

    if (streakDoc.exists) {
      const data = streakDoc.data() as UserStreak;
      totalInterviews = data.totalInterviews;
      lastInterviewDate = data.lastInterviewDate;
      currentStreak = data.currentStreak;
      longestStreak = data.longestStreak;
    }

    // Increment total interviews
    totalInterviews++;

    // Check if this is the first interview of the day
    if (lastInterviewDate !== today) {
      const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

      if (lastInterviewDate === yesterday) {
        // Consecutive day - increment streak
        currentStreak++;
      } else if (lastInterviewDate === "") {
        // First interview ever
        currentStreak = 1;
      } else {
        // Streak broken - restart
        currentStreak = 1;
      }

      lastInterviewDate = today;

      // Check if this is a new record
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
        isNewRecord = true;
      }
    }

    // Update in database
    const updatedStreak: UserStreak = {
      id: userId,
      userId,
      currentStreak,
      longestStreak,
      lastInterviewDate,
      totalInterviews,
      updatedAt: new Date().toISOString(),
    };

    await db.collection("user_streaks").doc(userId).set(updatedStreak);

    await logger.logProcessing(sessionId, userId, "streak_updated", {
      currentStreak,
      longestStreak,
      totalInterviews,
      isNewRecord,
    });

    return { success: true, currentStreak, isNewRecord };
  } catch (error) {
    await logger.logError(
      sessionId,
      userId,
      error instanceof Error ? error.message : String(error),
      {
        action: "updateStreak",
        stack: error instanceof Error ? error.stack : undefined,
      }
    );

    return { success: false, currentStreak: 0, isNewRecord: false };
  }
}

// Check all users for streak status and send reminders (run via cron)
export async function checkAndNotifyStreaks(): Promise<{
  success: boolean;
  notificationsSent: number;
}> {
  const sessionId = logger.createSession();
  let notificationsSent = 0;

  try {
    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    const twoDaysAgo = dayjs().subtract(2, "days").format("YYYY-MM-DD");

    // Get users who last practiced yesterday (at risk of losing streak)
    const streaksSnapshot = await db
      .collection("user_streaks")
      .where("lastInterviewDate", "==", yesterday)
      .where("currentStreak", ">", 0)
      .get();

    await logger.logProcessing(sessionId, "system", "checking_streaks", {
      usersAtRisk: streaksSnapshot.size,
    });

    for (const doc of streaksSnapshot.docs) {
      const streak = doc.data() as UserStreak;

      try {
        // Check if reminder was already sent today
        if (
          streak.lastReminderSent &&
          dayjs(streak.lastReminderSent).format("YYYY-MM-DD") === today
        ) {
          continue;
        }

        // Get user information
        const userDoc = await db.collection("users").doc(streak.userId).get();
        const user = userDoc.data() as User;

        if (!user?.email) {
          continue;
        }

        // Check user preferences
        const prefsDoc = await db
          .collection("user_preferences")
          .doc(streak.userId)
          .get();
        const prefs = prefsDoc.data() as UserPreferences | undefined;

        if (prefs?.streakReminders === false) {
          continue;
        }

        // Calculate days inactive
        const daysInactive = dayjs().diff(
          dayjs(streak.lastInterviewDate),
          "days"
        );

        // Send streak reminder
        const emailResult = await sendStreakReminder({
          to: user.email,
          userName: user.name,
          currentStreak: streak.currentStreak,
          daysInactive,
        });

        if (emailResult.success) {
          // Update last reminder sent time
          await db
            .collection("user_streaks")
            .doc(doc.id)
            .update({ lastReminderSent: new Date().toISOString() });

          notificationsSent++;

          await logger.logProcessing(
            sessionId,
            streak.userId,
            "streak_reminder_sent",
            {
              currentStreak: streak.currentStreak,
              daysInactive,
            }
          );
        }
      } catch (error) {
        await logger.logError(
          sessionId,
          streak.userId,
          error instanceof Error ? error.message : String(error),
          {
            action: "sendStreakReminder",
            stack: error instanceof Error ? error.stack : undefined,
          }
        );
      }
    }

    // Also check for users who practiced 2 days ago (streak will break today)
    const urgentStreaksSnapshot = await db
      .collection("user_streaks")
      .where("lastInterviewDate", "==", twoDaysAgo)
      .where("currentStreak", ">", 2)
      .get();

    for (const doc of urgentStreaksSnapshot.docs) {
      const streak = doc.data() as UserStreak;

      try {
        // Check if reminder was already sent today
        if (
          streak.lastReminderSent &&
          dayjs(streak.lastReminderSent).format("YYYY-MM-DD") === today
        ) {
          continue;
        }

        const userDoc = await db.collection("users").doc(streak.userId).get();
        const user = userDoc.data() as User;

        if (!user?.email) {
          continue;
        }

        const prefsDoc = await db
          .collection("user_preferences")
          .doc(streak.userId)
          .get();
        const prefs = prefsDoc.data() as UserPreferences | undefined;

        if (prefs?.streakReminders === false) {
          continue;
        }

        const daysInactive = dayjs().diff(
          dayjs(streak.lastInterviewDate),
          "days"
        );

        const emailResult = await sendStreakReminder({
          to: user.email,
          userName: user.name,
          currentStreak: streak.currentStreak,
          daysInactive,
        });

        if (emailResult.success) {
          await db
            .collection("user_streaks")
            .doc(doc.id)
            .update({ lastReminderSent: new Date().toISOString() });

          notificationsSent++;

          await logger.logProcessing(
            sessionId,
            streak.userId,
            "urgent_streak_reminder_sent",
            {
              currentStreak: streak.currentStreak,
              daysInactive,
            }
          );
        }
      } catch (error) {
        await logger.logError(
          sessionId,
          streak.userId,
          error instanceof Error ? error.message : String(error),
          {
            action: "sendUrgentStreakReminder",
            stack: error instanceof Error ? error.stack : undefined,
          }
        );
      }
    }

    await logger.logProcessing(sessionId, "system", "streak_check_complete", {
      notificationsSent,
    });

    return { success: true, notificationsSent };
  } catch (error) {
    await logger.logError(
      sessionId,
      "system",
      error instanceof Error ? error.message : String(error),
      {
        action: "checkAndNotifyStreaks",
        stack: error instanceof Error ? error.stack : undefined,
      }
    );

    return { success: false, notificationsSent };
  }
}

// Reset streaks for users who haven't practiced (run daily via cron)
export async function resetBrokenStreaks(): Promise<{
  success: boolean;
  streaksReset: number;
}> {
  const sessionId = logger.createSession();
  let streaksReset = 0;

  try {
    const twoDaysAgo = dayjs().subtract(2, "days").format("YYYY-MM-DD");

    // Get users who haven't practiced in 2+ days and have an active streak
    const streaksSnapshot = await db
      .collection("user_streaks")
      .where("currentStreak", ">", 0)
      .get();

    for (const doc of streaksSnapshot.docs) {
      const streak = doc.data() as UserStreak;

      if (!streak.lastInterviewDate) {
        continue;
      }

      const lastDate = dayjs(streak.lastInterviewDate);
      const daysSinceLastInterview = dayjs().diff(lastDate, "days");

      // If more than 1 day has passed, reset the streak
      if (daysSinceLastInterview > 1) {
        await db.collection("user_streaks").doc(doc.id).update({
          currentStreak: 0,
          updatedAt: new Date().toISOString(),
        });

        streaksReset++;

        await logger.logProcessing(sessionId, streak.userId, "streak_reset", {
          previousStreak: streak.currentStreak,
          daysSinceLastInterview,
        });
      }
    }

    await logger.logProcessing(sessionId, "system", "streak_reset_complete", {
      streaksReset,
    });

    return { success: true, streaksReset };
  } catch (error) {
    await logger.logError(
      sessionId,
      "system",
      error instanceof Error ? error.message : String(error),
      {
        action: "resetBrokenStreaks",
        stack: error instanceof Error ? error.stack : undefined,
      }
    );

    return { success: false, streaksReset };
  }
}
