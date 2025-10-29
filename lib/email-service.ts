"use server";

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

// Create reusable transporter
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport(EMAIL_CONFIG);
  }
  return transporter;
}

// Email templates
const EMAIL_TEMPLATES = {
  interviewReminder: (data: {
    userName: string;
    role: string;
    scheduledTime: string;
    interviewLink: string;
  }) => ({
    subject: `Interview Reminder: ${data.role} Interview Tomorrow`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Interview Reminder</h1>
            </div>
            <div class="content">
              <p>Hi ${data.userName},</p>
              <p>This is a friendly reminder about your upcoming mock interview:</p>
              
              <div class="highlight">
                <strong>📋 Interview Type:</strong> ${data.role}<br>
                <strong>🕐 Scheduled Time:</strong> ${data.scheduledTime}
              </div>
              
              <p>Make sure you're prepared and have tested your audio setup. Good luck! 🍀</p>
              
              <center>
                <a href="${data.interviewLink}" class="button">Start Interview</a>
              </center>
              
              <p><small>💡 <strong>Tip:</strong> Review your previous feedback to focus on areas of improvement.</small></p>
            </div>
            <div class="footer">
              <p>© 2025 NexusAgent.ai - Your AI Interview Coach</p>
              <p>You're receiving this because you scheduled an interview on our platform.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  feedbackReady: (data: {
    userName: string;
    role: string;
    totalScore: number;
    feedbackLink: string;
  }) => ({
    subject: `✅ Your ${data.role} Interview Feedback is Ready!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .score-box { background: white; border: 2px solid #11998e; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0; }
            .score { font-size: 48px; font-weight: bold; color: #11998e; }
            .button { display: inline-block; padding: 12px 30px; background: #11998e; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Feedback Ready!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.userName},</p>
              <p>Great job completing your <strong>${data.role}</strong> interview! Your detailed feedback is now available.</p>
              
              <div class="score-box">
                <p style="margin: 0; color: #666;">Your Overall Score</p>
                <div class="score">${data.totalScore}/100</div>
              </div>
              
              <p>We've analyzed your performance across multiple categories and identified your strengths and areas for improvement.</p>
              
              <center>
                <a href="${data.feedbackLink}" class="button">View Detailed Feedback</a>
              </center>
              
              <p><small>💡 Don't forget to download your PDF report for your records!</small></p>
            </div>
            <div class="footer">
              <p>© 2025 NexusAgent.ai - Your AI Interview Coach</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  weeklyReport: (data: {
    userName: string;
    weekStart: string;
    weekEnd: string;
    totalInterviews: number;
    averageScore: number;
    bestPerformance: string;
    currentStreak: number;
    suggestions: string[];
  }) => ({
    subject: ` Your Weekly Interview Progress Report - ${data.weekStart}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .stat-box { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .stat-value { font-size: 32px; font-weight: bold; color: #f5576c; }
            .stat-label { color: #666; font-size: 14px; }
            .suggestions { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .suggestions ul { margin: 10px 0; padding-left: 20px; }
            .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .streak { background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%); color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1> Weekly Progress Report</h1>
              <p>${data.weekStart} - ${data.weekEnd}</p>
            </div>
            <div class="content">
              <p>Hi ${data.userName},</p>
              <p>Here's your weekly interview practice summary. Keep up the great work! 💪</p>
              
              <div class="stats">
                <div class="stat-box">
                  <div class="stat-value">${data.totalInterviews}</div>
                  <div class="stat-label">Interviews Completed</div>
                </div>
                <div class="stat-box">
                  <div class="stat-value">${data.averageScore}</div>
                  <div class="stat-label">Average Score</div>
                </div>
              </div>
              
              ${
                data.currentStreak > 0
                  ? `
              <div class="streak">
                <h3 style="margin: 0;">🔥 ${data.currentStreak} Day Streak!</h3>
                <p style="margin: 5px 0 0 0;">You're on fire! Keep the momentum going.</p>
              </div>
              `
                  : ""
              }
              
              <div class="suggestions">
                <h3 style="margin-top: 0;">🎯 Best Performance This Week</h3>
                <p><strong>${data.bestPerformance}</strong></p>
                
                <h3>💡 Personalized Suggestions</h3>
                <ul>
                  ${data.suggestions
                    .map((suggestion) => `<li>${suggestion}</li>`)
                    .join("")}
                </ul>
              </div>
              
              <center>
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL ||
                  "https://nexus-agent.vercel.app"
                }" class="button">Continue Practicing</a>
              </center>
            </div>
            <div class="footer">
              <p>© 2025 NexusAgent.ai - Your AI Interview Coach</p>
              <p>Weekly reports are sent every Monday to help you track your progress.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  streakReminder: (data: {
    userName: string;
    currentStreak: number;
    daysInactive: number;
  }) => ({
    subject: `🔥 Don't Break Your ${data.currentStreak} Day Streak!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .streak-box { background: white; border: 3px dashed #fa709a; padding: 30px; text-align: center; border-radius: 10px; margin: 20px 0; }
            .streak-number { font-size: 64px; font-weight: bold; color: #fa709a; }
            .button { display: inline-block; padding: 12px 30px; background: #fa709a; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔥 Streak Alert!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.userName},</p>
              <p>We noticed it's been <strong>${
                data.daysInactive
              } days</strong> since your last interview practice.</p>
              
              <div class="streak-box">
                <div class="streak-number">🔥 ${data.currentStreak}</div>
                <p style="margin: 10px 0 0 0; font-size: 18px;"><strong>Day Streak</strong></p>
                <p style="color: #666;">Don't let it end now!</p>
              </div>
              
              <p>You've built an amazing practice habit. Just one quick interview session today will keep your streak alive and continue your progress! 💪</p>
              
              <center>
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL ||
                  "https://nexus-agent.vercel.app"
                }" class="button">Practice Now</a>
              </center>
              
              <p><small>💡 Even a 5-minute session counts toward your streak!</small></p>
            </div>
            <div class="footer">
              <p>© 2025 NexusAgent.ai - Your AI Interview Coach</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  interviewSuggestion: (data: {
    userName: string;
    suggestions: Array<{
      role: string;
      type: string;
      reason: string;
      techStack: string[];
    }>;
  }) => ({
    subject: `💡 Personalized Interview Suggestions for ${data.userName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .suggestion-card { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .tech-stack { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
            .tech-badge { background: #e0e7ff; color: #667eea; padding: 4px 12px; border-radius: 12px; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💡 Recommended Interviews</h1>
            </div>
            <div class="content">
              <p>Hi ${data.userName},</p>
              <p>Based on your interview history and performance, we've curated these personalized interview suggestions for you:</p>
              
              ${data.suggestions
                .map(
                  (suggestion) => `
                <div class="suggestion-card">
                  <h3 style="margin-top: 0; color: #667eea;">${
                    suggestion.role
                  } - ${suggestion.type}</h3>
                  <p><strong>Why this interview:</strong> ${
                    suggestion.reason
                  }</p>
                  <div class="tech-stack">
                    ${suggestion.techStack
                      .map((tech) => `<span class="tech-badge">${tech}</span>`)
                      .join("")}
                  </div>
                </div>
              `
                )
                .join("")}
              
              <p>Ready to level up your interview skills? Start practicing with any of these suggestions!</p>
              
              <center>
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL ||
                  "https://nexus-agent.vercel.app"
                }" class="button">Start Practicing</a>
              </center>
            </div>
            <div class="footer">
              <p>© 2025 NexusAgent.ai - Your AI Interview Coach</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

// Send email function
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn("SMTP credentials not configured. Email not sent.");
      return {
        success: false,
        error: "SMTP credentials not configured",
      };
    }

    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: `"NexusAgent.ai" <${process.env.SMTP_USER}>`,
      to: params.to,
      subject: params.subject,
      html: params.html,
      attachments: params.attachments,
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Specific email sending functions
export async function sendInterviewReminder(params: {
  to: string;
  userName: string;
  role: string;
  scheduledTime: string;
  interviewId: string;
}) {
  const template = EMAIL_TEMPLATES.interviewReminder({
    userName: params.userName,
    role: params.role,
    scheduledTime: params.scheduledTime,
    interviewLink: `${
      process.env.NEXT_PUBLIC_APP_URL || "https://nexus-agent.vercel.app"
    }/interview/${params.interviewId}`,
  });

  return sendEmail({
    to: params.to,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendFeedbackReady(params: {
  to: string;
  userName: string;
  role: string;
  totalScore: number;
  interviewId: string;
}) {
  const template = EMAIL_TEMPLATES.feedbackReady({
    userName: params.userName,
    role: params.role,
    totalScore: params.totalScore,
    feedbackLink: `${
      process.env.NEXT_PUBLIC_APP_URL || "https://nexus-agent.vercel.app"
    }/interview/${params.interviewId}/feedback`,
  });

  return sendEmail({
    to: params.to,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendWeeklyReport(
  params: {
    to: string;
    userName: string;
    weekStart: string;
    weekEnd: string;
    totalInterviews: number;
    averageScore: number;
    bestPerformance: string;
    currentStreak: number;
    suggestions: string[];
  },
  pdfAttachment?: Buffer
) {
  const template = EMAIL_TEMPLATES.weeklyReport(params);

  const attachments = pdfAttachment
    ? [
        {
          filename: `Weekly_Report_${params.weekStart}.pdf`,
          content: pdfAttachment,
          contentType: "application/pdf",
        },
      ]
    : undefined;

  return sendEmail({
    to: params.to,
    subject: template.subject,
    html: template.html,
    attachments,
  });
}

export async function sendStreakReminder(params: {
  to: string;
  userName: string;
  currentStreak: number;
  daysInactive: number;
}) {
  const template = EMAIL_TEMPLATES.streakReminder(params);

  return sendEmail({
    to: params.to,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendInterviewSuggestion(params: {
  to: string;
  userName: string;
  suggestions: Array<{
    role: string;
    type: string;
    reason: string;
    techStack: string[];
  }>;
}) {
  const template = EMAIL_TEMPLATES.interviewSuggestion(params);

  return sendEmail({
    to: params.to,
    subject: template.subject,
    html: template.html,
  });
}
