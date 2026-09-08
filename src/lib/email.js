import nodemailer from "nodemailer";

export function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT || 587),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendEmail({ to, subject, html, text, attachments = [] }) {
  if (!to) {
    console.warn("sendEmail: No recipient email provided");
    return;
  }

  const transporter = getTransporter();
  const fromAddress = process.env.EMAIL_FROM || `"Job Portal" <${process.env.EMAIL_USER}>`;

  return transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    text,
    html,
    attachments,
  });
}

/**
 * Auto-respond to a user who submitted an inquiry or contact email
 */
export async function sendContactAutoReply({ to, name, subject }) {
  const safeName = name || "there";
  const safeSubject = subject || "your inquiry";

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 24px; color: #333333;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
      <tr style="background: linear-gradient(135deg, #2563eb, #1d4ed8);">
        <td style="padding: 28px 32px; text-align: left; color: #ffffff;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Job Portal</h1>
          <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">We've received your message</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 32px;">
          <p style="margin-top: 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
            Hello <strong>${safeName}</strong>,
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Thank you for reaching out to us. This is an automated confirmation to let you know that we have received your inquiry regarding:
          </p>
          <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
            <strong style="color: #0f172a; font-size: 15px;">"${safeSubject}"</strong>
          </div>
          <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Our team is reviewing your message and will get back to you as soon as possible, typically within 24–48 business hours.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin-top: 24px;">
            If your request is urgent, please feel free to follow up on this thread or contact our support directly.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
          <p style="font-size: 14px; line-height: 1.5; color: #334155; margin: 0;">
            Best regards,<br/>
            <strong>The Support Team</strong>
          </p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f8fafc; padding: 18px 32px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          This is an automated message confirming receipt of your message. Please do not reply directly to this automated notice.
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  return sendEmail({
    to,
    subject: `We've received your message: ${safeSubject}`,
    text: `Hello ${safeName},\n\nThank you for reaching out. We have received your message regarding "${safeSubject}". Our team will review it and get back to you shortly.\n\nBest regards,\nSupport Team`,
    html,
  });
}

/**
 * Auto-respond to a candidate/job seeker who applied for a job
 */
export async function sendJobApplicationAutoReply({
  to,
  applicantName,
  jobTitle,
  companyName,
}) {
  const safeName = applicantName || "Candidate";
  const safeJobTitle = jobTitle || "the position";
  const safeCompany = companyName ? ` at ${companyName}` : "";

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 24px; color: #333333;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
      <tr style="background: linear-gradient(135deg, #059669, #047857);">
        <td style="padding: 28px 32px; text-align: left; color: #ffffff;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Application Submitted! 🎉</h1>
          <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">Your application has been received</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 32px;">
          <p style="margin-top: 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
            Hello <strong>${safeName}</strong>,
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Thank you for applying for <strong>${safeJobTitle}</strong>${safeCompany}. Your application has been successfully submitted and forwarded to the hiring team.
          </p>
          
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 16px 20px; margin: 24px 0;">
            <p style="margin: 0 0 8px; font-weight: 600; color: #166534; font-size: 15px;">Application Summary</p>
            <p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><strong>Position:</strong> ${safeJobTitle}</p>
            ${companyName ? `<p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><strong>Company:</strong> ${companyName}</p>` : ""}
            <p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><strong>Status:</strong> Under Review</p>
          </div>

          <h3 style="font-size: 16px; color: #0f172a; margin: 24px 0 10px;">What happens next?</h3>
          <ul style="padding-left: 20px; margin: 0; font-size: 14px; line-height: 1.7; color: #475569;">
            <li>The hiring team will review your qualifications, skills, and experience.</li>
            <li>If your profile matches the role, they will contact you directly to schedule the next steps or an interview.</li>
            <li>You can log in to your dashboard at any time to monitor your application status.</li>
          </ul>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
          <p style="font-size: 14px; line-height: 1.5; color: #334155; margin: 0;">
            We wish you the best of luck with your job search!<br/>
            <strong>The Hiring & Recruitment Team</strong>
          </p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f8fafc; padding: 18px 32px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          Job Portal © All rights reserved. You received this email because you submitted an application for this role.
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  return sendEmail({
    to,
    subject: `Application Received: ${safeJobTitle}${safeCompany}`,
    text: `Hello ${safeName},\n\nThank you for applying for ${safeJobTitle}${safeCompany}. Your application has been successfully submitted and forwarded to the hiring team.\n\nWe wish you the best of luck!\n\nHiring Team`,
    html,
  });
}

/**
 * Optional: Alert the recruiter or employer when a new seeker applies
 */
export async function sendRecruiterApplicationAlert({
  to,
  applicantName,
  applicantEmail,
  applicantPhone,
  jobTitle,
}) {
  if (!to) return;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
  </head>
  <body style="font-family: sans-serif; background-color: #f8fafc; padding: 20px; color: #333;">
    <div style="max-width: 550px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
      <h2 style="color: #0f172a; margin-top: 0;">New Job Application Received</h2>
      <p>A new candidate has applied for your job opening: <strong>${jobTitle}</strong>.</p>
      <div style="background: #f1f5f9; padding: 12px 16px; border-radius: 6px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Candidate Name:</strong> ${applicantName}</p>
        <p style="margin: 4px 0;"><strong>Email:</strong> ${applicantEmail}</p>
        ${applicantPhone ? `<p style="margin: 4px 0;"><strong>Phone:</strong> ${applicantPhone}</p>` : ""}
      </div>
      <p>Log in to your recruiter portal to view the candidate's complete profile, resume, and manage their status.</p>
    </div>
  </body>
  </html>
  `;

  return sendEmail({
    to,
    subject: `New Candidate Application for: ${jobTitle}`,
    text: `A candidate (${applicantName}, ${applicantEmail}) has applied for ${jobTitle}. Log in to your recruiter portal to review.`,
    html,
  });
}
