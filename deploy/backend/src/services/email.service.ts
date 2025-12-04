import nodemailer from 'nodemailer';
import config from 'config/config';
import logger from 'config/logger';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Create email transporter
 * In development, uses ethereal.email for testing
 * In production, should use real SMTP service
 */
const createTransporter = async () => {
  if (config.nodeEnv === 'development' && !config.smtp.user) {
    // Create ethereal test account for development
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // Production transporter or development with configured SMTP
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.password,
    },
  });
};

/**
 * Send email
 */
export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  try {
    const transporter = await createTransporter();
    
    const info = await transporter.sendMail({
      from: config.smtp.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    logger.info(`Email sent to ${options.to}: ${info.messageId}`);
    
    // For development with ethereal.email, log preview URL
    if (config.nodeEnv === 'development') {
      logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
};

/**
 * Generate HTML template for invitation email
 */
const generateInviteEmailHtml = (inviteLink: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background-color: #4F46E5;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
          }
          .content p {
            margin: 0 0 15px 0;
            font-size: 16px;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background-color: #4F46E5;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
          }
          .button:hover {
            background-color: #4338CA;
          }
          .footer {
            background-color: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
          }
          .link {
            color: #4F46E5;
            text-decoration: none;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Vacation Tracker!</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p>You've been invited to join Vacation Tracker. We're excited to have you on board!</p>
            <p>To complete your registration and set up your account, please click the button below:</p>
            <div class="button-container">
              <a href="${inviteLink}" class="button">Complete Your Registration</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p><a href="${inviteLink}" class="link">${inviteLink}</a></p>
            <p><strong>Note:</strong> This invitation link will expire in 48 hours.</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Vacation Tracker. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Generate plain text version of invitation email
 */
const generateInviteEmailText = (inviteLink: string): string => {
  return `
Welcome to Vacation Tracker!

You've been invited to join Vacation Tracker. We're excited to have you on board!

To complete your registration and set up your account, please visit:
${inviteLink}

Note: This invitation link will expire in 48 hours.

If you didn't expect this invitation, you can safely ignore this email.

© ${new Date().getFullYear()} Vacation Tracker. All rights reserved.
  `.trim();
};

/**
 * Send invitation email
 */
export const sendInvitationEmail = async (email: string, token: string): Promise<void> => {
  const inviteLink = `${config.frontendUrl}/register?invite=${token}`;
  
  await sendEmail({
    to: email,
    subject: 'You\'re invited to join Vacation Tracker',
    html: generateInviteEmailHtml(inviteLink),
    text: generateInviteEmailText(inviteLink),
  });
};

/**
 * Manager notification: new leave request pending approval
 */
type LeaveNotificationPayload = {
  requesterName: string;
  requesterEmail: string;
  type: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
  requestId: string;
};

const formatDate = (d: Date) => d.toISOString().split('T')[0];

const generateLeaveNotificationHtml = (payload: LeaveNotificationPayload): string => {
  const manageLink = `${config.frontendUrl}/team-requests?requestId=${payload.requestId}`;
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background-color: #111827; color: #ffffff; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
          .content { padding: 24px; }
          .row { margin: 8px 0; }
          .label { color: #6b7280; }
          .button-container { text-align: center; margin: 24px 0; }
          .button { display: inline-block; padding: 12px 24px; background-color: #111827; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
          .footer { background-color: #f9fafb; padding: 16px 24px; text-align: center; font-size: 12px; color: #6b7280; }
          .link { color: #111827; text-decoration: none; word-break: break-all; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Leave Request Pending Approval</h1>
          </div>
          <div class="content">
            <div class="row"><span class="label">Requester:</span> <strong>${payload.requesterName}</strong> (${payload.requesterEmail})</div>
            <div class="row"><span class="label">Type:</span> ${payload.type.charAt(0).toUpperCase() + payload.type.slice(1)}</div>
            <div class="row"><span class="label">Dates:</span> ${formatDate(payload.startDate)} → ${formatDate(payload.endDate)}</div>
            ${payload.reason ? `<div class="row"><span class="label">Reason:</span> ${payload.reason}</div>` : ''}
            <div class="button-container">
              <a href="${manageLink}" class="button">Review in Vacation Tracker</a>
            </div>
            <div class="row"><span class="label">Direct link:</span> <a href="${manageLink}" class="link">${manageLink}</a></div>
          </div>
          <div class="footer">You received this because you manage the requester’s team.</div>
        </div>
      </body>
    </html>
  `;
};

const generateLeaveNotificationText = (payload: LeaveNotificationPayload): string => {
  const manageLink = `${config.frontendUrl}/team-requests?requestId=${payload.requestId}`;
  return `New Leave Request Pending Approval

Requester: ${payload.requesterName} (${payload.requesterEmail})
Type: ${payload.type}
Dates: ${formatDate(payload.startDate)} -> ${formatDate(payload.endDate)}
${payload.reason ? `Reason: ${payload.reason}\n` : ''}

Review in Vacation Tracker: ${manageLink}
`;
};

export const sendLeaveRequestNotification = async (
  to: string | string[],
  payload: LeaveNotificationPayload
): Promise<void> => {
  const recipients = Array.isArray(to) ? to : [to];
  if (recipients.length === 0) return;

  const html = generateLeaveNotificationHtml(payload);
  const text = generateLeaveNotificationText(payload);

  await Promise.all(
    recipients.map((email) =>
      sendEmail({
        to: email,
        subject: 'New leave request pending approval',
        html,
        text,
      })
    )
  );
};

/**
 * Notify requester when status changes (approved/declined)
 */
type LeaveStatusUpdatePayload = {
  requesterName: string;
  requesterEmail: string;
  type: string;
  startDate: Date;
  endDate: Date;
  status: 'approved' | 'declined';
  requestId: string;
};

const generateLeaveStatusUpdateHtml = (p: LeaveStatusUpdatePayload): string => {
  const statusColor = p.status === 'approved' ? '#059669' : '#DC2626';
  const statusLabel = p.status.charAt(0).toUpperCase() + p.status.slice(1);
  const viewLink = `${config.frontendUrl}/my-leave-requests?requestId=${p.requestId}`;
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background-color: ${statusColor}; color: #ffffff; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
          .content { padding: 24px; }
          .row { margin: 8px 0; }
          .label { color: #6b7280; }
          .button-container { text-align: center; margin: 24px 0; }
          .button { display: inline-block; padding: 12px 24px; background-color: ${statusColor}; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
          .footer { background-color: #f9fafb; padding: 16px 24px; text-align: center; font-size: 12px; color: #6b7280; }
          .link { color: ${statusColor}; text-decoration: none; word-break: break-all; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Leave Request Was ${statusLabel}</h1>
          </div>
          <div class="content">
            <div class="row"><span class="label">Type:</span> ${p.type.charAt(0).toUpperCase() + p.type.slice(1)}</div>
            <div class="row"><span class="label">Dates:</span> ${formatDate(p.startDate)} → ${formatDate(p.endDate)}</div>
            <div class="row"><span class="label">Status:</span> <strong>${statusLabel}</strong></div>
            <div class="button-container">
              <a href="${viewLink}" class="button">View Details and Comments</a>
            </div>
            <div class="row"><span class="label">Direct link:</span> <a href="${viewLink}" class="link">${viewLink}</a></div>
          </div>
          <div class="footer">You can view any comments or notes in the request details.</div>
        </div>
      </body>
    </html>
  `;
};

const generateLeaveStatusUpdateText = (p: LeaveStatusUpdatePayload): string => {
  const viewLink = `${config.frontendUrl}/my-leave-requests?requestId=${p.requestId}`;
  const statusLabel = p.status.charAt(0).toUpperCase() + p.status.slice(1);
  return `Your Leave Request Was ${statusLabel}

Type: ${p.type}
Dates: ${formatDate(p.startDate)} -> ${formatDate(p.endDate)}
Status: ${statusLabel}

View details and comments: ${viewLink}
`;
};

export const sendLeaveStatusUpdateEmail = async (
  to: string,
  payload: LeaveStatusUpdatePayload
): Promise<void> => {
  await sendEmail({
    to,
    subject: `Your leave request was ${payload.status}`,
    html: generateLeaveStatusUpdateHtml(payload),
    text: generateLeaveStatusUpdateText(payload),
  });
};
