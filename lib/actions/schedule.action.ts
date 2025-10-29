"use server";

import { db } from "@/firebase/admin";
import { sendInterviewReminder } from "@/lib/email-service";
import { logger } from "@/lib/logger";
import dayjs from "dayjs";

// Create a scheduled interview
export async function createScheduledInterview(params: {
  userId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  scheduledTime: string;
}): Promise<{ success: boolean; scheduleId?: string; error?: string }> {
  const sessionId = logger.createSession();

  try {
    const scheduleRef = db.collection("scheduled_interviews").doc();

    const scheduledInterview: ScheduledInterview = {
      id: scheduleRef.id,
      userId: params.userId,
      role: params.role,
      level: params.level,
      type: params.type,
      techstack: params.techstack,
      scheduledTime: params.scheduledTime,
      reminderSent: false,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    };

    await scheduleRef.set(scheduledInterview);

    await logger.logProcessing(
      sessionId,
      params.userId,
      "scheduled_interview_created",
      {
        scheduleId: scheduleRef.id,
        scheduledTime: params.scheduledTime,
        role: params.role,
      }
    );

    return { success: true, scheduleId: scheduleRef.id };
  } catch (error) {
    await logger.logError(
      sessionId,
      params.userId,
      error instanceof Error ? error.message : String(error),
      {
        action: "createScheduledInterview",
        stack: error instanceof Error ? error.stack : undefined,
      }
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get scheduled interviews for a user
export async function getUserScheduledInterviews(
  userId: string
): Promise<ScheduledInterview[]> {
  try {
    const snapshot = await db
      .collection("scheduled_interviews")
      .where("userId", "==", userId)
      .where("status", "==", "scheduled")
      .orderBy("scheduledTime", "asc")
      .get();

    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as ScheduledInterview)
    );
  } catch (error) {
    console.error("Error fetching scheduled interviews:", error);
    return [];
  }
}

// Update scheduled interview status
export async function updateScheduledInterviewStatus(params: {
  scheduleId: string;
  status: "scheduled" | "completed" | "cancelled";
  interviewId?: string;
}): Promise<{ success: boolean }> {
  try {
    const updateData: any = {
      status: params.status,
    };

    if (params.interviewId) {
      updateData.interviewId = params.interviewId;
    }

    await db
      .collection("scheduled_interviews")
      .doc(params.scheduleId)
      .update(updateData);

    return { success: true };
  } catch (error) {
    console.error("Error updating scheduled interview:", error);
    return { success: false };
  }
}

// Send reminders for upcoming interviews (run via cron)
export async function sendUpcomingInterviewReminders(): Promise<{
  success: boolean;
  remindersSent: number;
}> {
  const sessionId = logger.createSession();
  let remindersSent = 0;

  try {
    // Get interviews scheduled for the next 24 hours that haven't had reminders sent
    const tomorrow = dayjs().add(24, "hours").toISOString();
    const now = dayjs().toISOString();

    const snapshot = await db
      .collection("scheduled_interviews")
      .where("status", "==", "scheduled")
      .where("reminderSent", "==", false)
      .where("scheduledTime", ">", now)
      .where("scheduledTime", "<=", tomorrow)
      .get();

    await logger.logProcessing(
      sessionId,
      "system",
      "checking_upcoming_interviews",
      {
        count: snapshot.size,
      }
    );

    for (const doc of snapshot.docs) {
      const schedule = doc.data() as ScheduledInterview;

      try {
        // Get user information
        const userDoc = await db.collection("users").doc(schedule.userId).get();
        const user = userDoc.data() as User;

        if (!user?.email) {
          console.warn(`No email found for user ${schedule.userId}`);
          continue;
        }

        // Check user preferences
        const prefsDoc = await db
          .collection("user_preferences")
          .doc(schedule.userId)
          .get();
        const prefs = prefsDoc.data() as UserPreferences | undefined;

        if (prefs?.emailNotifications === false) {
          console.log(
            `User ${schedule.userId} has email notifications disabled`
          );
          continue;
        }

        // Send reminder email
        const emailResult = await sendInterviewReminder({
          to: user.email,
          userName: user.name,
          role: schedule.role,
          scheduledTime: dayjs(schedule.scheduledTime).format(
            "MMMM D, YYYY [at] h:mm A"
          ),
          interviewId: schedule.interviewId || "",
        });

        if (emailResult.success) {
          // Mark reminder as sent
          await db
            .collection("scheduled_interviews")
            .doc(doc.id)
            .update({ reminderSent: true });

          remindersSent++;

          await logger.logProcessing(
            sessionId,
            schedule.userId,
            "interview_reminder_sent",
            {
              scheduleId: doc.id,
              email: user.email,
              scheduledTime: schedule.scheduledTime,
            }
          );
        }
      } catch (error) {
        await logger.logError(
          sessionId,
          schedule.userId,
          error instanceof Error ? error.message : String(error),
          {
            action: "sendInterviewReminder",
            scheduleId: doc.id,
            stack: error instanceof Error ? error.stack : undefined,
          }
        );
      }
    }

    await logger.logProcessing(sessionId, "system", "reminders_sent_complete", {
      remindersSent,
    });

    return { success: true, remindersSent };
  } catch (error) {
    await logger.logError(
      sessionId,
      "system",
      error instanceof Error ? error.message : String(error),
      {
        action: "sendUpcomingInterviewReminders",
        stack: error instanceof Error ? error.stack : undefined,
      }
    );

    return { success: false, remindersSent };
  }
}

// Initialize user preferences
export async function initializeUserPreferences(
  userId: string
): Promise<{ success: boolean }> {
  try {
    const prefsRef = db.collection("user_preferences").doc(userId);
    const prefsDoc = await prefsRef.get();

    if (!prefsDoc.exists) {
      const preferences: UserPreferences = {
        id: userId,
        userId,
        emailNotifications: true,
        weeklyReports: true,
        streakReminders: true,
        interviewSuggestions: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await prefsRef.set(preferences);
    }

    return { success: true };
  } catch (error) {
    console.error("Error initializing user preferences:", error);
    return { success: false };
  }
}

// Update user preferences
export async function updateUserPreferences(params: {
  userId: string;
  preferences: Partial<UserPreferences>;
}): Promise<{ success: boolean }> {
  try {
    await db
      .collection("user_preferences")
      .doc(params.userId)
      .update({
        ...params.preferences,
        updatedAt: new Date().toISOString(),
      });

    return { success: true };
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return { success: false };
  }
}

// Get user preferences
export async function getUserPreferences(
  userId: string
): Promise<UserPreferences | null> {
  try {
    const doc = await db.collection("user_preferences").doc(userId).get();

    if (!doc.exists) {
      // Initialize preferences if they don't exist
      await initializeUserPreferences(userId);
      const newDoc = await db.collection("user_preferences").doc(userId).get();
      return newDoc.data() as UserPreferences;
    }

    return doc.data() as UserPreferences;
  } catch (error) {
    console.error("Error getting user preferences:", error);
    return null;
  }
}
