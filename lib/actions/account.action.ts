"use server";

import { getCurrentUser } from "./auth.action";
import { sendEmail } from "@/lib/email-service";

export async function requestAccountDeletion(reason: string) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Send email to admin about deletion request
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    if (!adminEmail) {
      console.error("Admin email not configured for deletion requests");
      return { success: false, error: "Admin email not configured" };
    }

    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #ef4444; border-radius: 5px; }
          .user-details { background: #fff; padding: 15px; margin: 15px 0; border-radius: 5px; border: 1px solid #e5e7eb; }
          .reason-box { background: #fef2f2; padding: 15px; margin: 15px 0; border-radius: 5px; border: 1px solid #fecaca; }
          .footer { text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px; }
          .alert { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 15px; border-radius: 5px; margin: 15px 0; }
          h1 { margin: 0; font-size: 24px; }
          h2 { color: #1f2937; margin-top: 0; }
          .label { font-weight: bold; color: #4b5563; display: inline-block; width: 120px; }
          .value { color: #1f2937; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Account Deletion Request</h1>
          </div>
          <div class="content">
            <div class="alert">
              <strong>⚠️ URGENT:</strong> A user has requested account deletion from NexusAgent.ai
            </div>
            
            <h2>User Information</h2>
            <div class="user-details">
              <p><span class="label">User ID:</span> <span class="value">${
                user.id
              }</span></p>
              <p><span class="label">Name:</span> <span class="value">${
                user.name
              }</span></p>
              <p><span class="label">Email:</span> <span class="value">${
                user.email
              }</span></p>
              <p><span class="label">Request Date:</span> <span class="value">${new Date().toLocaleString(
                "en-US",
                { dateStyle: "full", timeStyle: "long" }
              )}</span></p>
            </div>

            <h2>Deletion Reason</h2>
            <div class="reason-box">
              <p style="margin: 0; white-space: pre-wrap;">${
                reason || "No reason provided"
              }</p>
            </div>

            <div class="info-box">
              <h3 style="margin-top: 0; color: #ef4444;">Action Required</h3>
              <p>Please review this deletion request and take appropriate action:</p>
              <ol>
                <li>Verify the user's identity and request authenticity</li>
                <li>Backup any necessary data before deletion</li>
                <li>Delete user data from:
                  <ul>
                    <li>Firebase Authentication</li>
                    <li>Firestore collections (users, interviews, feedback, preferences, streaks, scheduled_interviews)</li>
                    <li>Any uploaded files in Firebase Storage</li>
                  </ul>
                </li>
                <li>Send confirmation email to the user</li>
                <li>Log the deletion for compliance purposes</li>
              </ol>
            </div>

            <div style="background: #eff6ff; padding: 15px; border-radius: 5px; border: 1px solid #bfdbfe; margin-top: 20px;">
              <p style="margin: 0; color: #1e40af;">
                <strong>Note:</strong> According to GDPR and data protection regulations, user data should be deleted within 30 days of the request.
              </p>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated notification from NexusAgent.ai</p>
            <p>&copy; ${new Date().getFullYear()} NexusAgent.ai - All rights reserved</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: adminEmail,
      subject: `🚨 Account Deletion Request - ${user.name} (${user.email})`,
      html: emailContent,
    });

    // Also send confirmation email to user
    const userConfirmationEmail = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border: 1px solid #e5e7eb; }
          .footer { text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px; }
          h1 { margin: 0; font-size: 24px; }
          h2 { color: #1f2937; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Account Deletion Request Received</h1>
          </div>
          <div class="content">
            <h2>Hi ${user.name},</h2>
            <p>We've received your request to delete your NexusAgent.ai account.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0;">What happens next?</h3>
              <ol>
                <li><strong>Review Period:</strong> Our team will review your request within 24-48 hours</li>
                <li><strong>Data Backup:</strong> We'll ensure all necessary backups are completed</li>
                <li><strong>Account Deletion:</strong> Your account and all associated data will be permanently deleted</li>
                <li><strong>Confirmation:</strong> You'll receive a final confirmation email once the deletion is complete</li>
              </ol>
            </div>

            <div style="background: #fef2f2; padding: 15px; border-radius: 5px; border: 1px solid #fecaca; margin-top: 20px;">
              <p style="margin: 0; color: #991b1b;">
                <strong>⚠️ Important:</strong> This action is permanent and cannot be undone. All your interview history, feedback, and progress will be lost.
              </p>
            </div>

            <div style="background: #eff6ff; padding: 15px; border-radius: 5px; border: 1px solid #bfdbfe; margin-top: 15px;">
              <p style="margin: 0; color: #1e40af;">
                <strong>Changed your mind?</strong> If you didn't request this deletion or would like to cancel, please contact us immediately at ${adminEmail}
              </p>
            </div>

            <p style="margin-top: 30px;">We're sorry to see you go. If there's anything we could have done better, please let us know.</p>
            
            <p>Best regards,<br>The NexusAgent.ai Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} NexusAgent.ai - All rights reserved</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: user.email,
      subject: "Account Deletion Request Received - NexusAgent.ai",
      html: userConfirmationEmail,
    });

    return { success: true };
  } catch (error) {
    console.error("Error requesting account deletion:", error);
    return { success: false, error: "Failed to process deletion request" };
  }
}
