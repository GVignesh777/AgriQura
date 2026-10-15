const nodemailer = require('nodemailer');
const emailjs = require('@emailjs/nodejs');
const env = require('../config/env');

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort == 465, // true for 465, false for other ports
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
});

/**
 * Send email using Nodemailer (For Contact Form / Official Email)
 */
const sendMailNodemailer = async (toEmail, subject, htmlContent, customReplyTo = null) => {
  try {
    const targetEmail = (toEmail || '').trim() || 'agriqura@gmail.com';

    if (!env.smtpUser || !env.smtpPass) {
      console.warn('⚠️ [SMTP Warning]: Missing SMTP credentials in .env. Email logging to console instead.');
      console.log(`✉️ [DEMO EMAIL TO ${targetEmail}]:\nSubject: ${subject}\nBody: ${htmlContent}`);
      return { success: true, simulated: true };
    }

    const mailOptions = {
      from: `"AgriQura Platform" <${env.smtpUser}>`,
      to: targetEmail,
      subject: subject,
      html: htmlContent,
      replyTo: customReplyTo || env.smtpUser,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Nodemailer Sent] To: ${targetEmail} | MessageID: ${info.messageId}`);
    return { success: true, info };
  } catch (error) {
    console.error(`❌ [Nodemailer Error] Failed to send email to ${toEmail}:`, error.message || error);
    return { success: false, error: error.message };
  }
};

/**
 * Send email using EmailJS Node.js SDK (For OTP & Alerts)
 */
const sendMailEmailJS = async (toEmail, templateId, templateParams = {}, customReplyTo = null) => {
  try {
    const targetEmail = (toEmail || '').trim() || 'agriqura@gmail.com';

    if (!env.emailjsServiceId || !env.emailjsPublicKey || !env.emailjsPrivateKey) {
      console.warn('⚠️ [EmailJS Warning]: Missing EmailJS credentials in .env. Email logging to console instead.');
      console.log(`✉️ [DEMO EMAIL TO ${targetEmail}]:`, templateParams);
      return { success: true, simulated: true };
    }

    const emailPayload = {
      to_email: targetEmail,
      email: targetEmail,
      user_email: targetEmail,
      to_name: templateParams.user_name || 'AgriQura User',
      reply_to: customReplyTo || 'agriqura@gmail.com',
      from_name: templateParams.from_name || 'AgriQura Platform',
      ...templateParams,
      to_email: targetEmail,
      email: targetEmail,
    };

    const response = await emailjs.send(
      env.emailjsServiceId,
      templateId,
      emailPayload,
      {
        publicKey: env.emailjsPublicKey,
        privateKey: env.emailjsPrivateKey,
      }
    );

    console.log(`✅ [EmailJS Sent] To: ${targetEmail} | Status: ${response.status}`);
    return { success: true, response };
  } catch (error) {
    console.error(`❌ [EmailJS Error] Failed to send email to ${toEmail}:`, error.text || error.message || error);
    return { success: false, error: error.text || error.message };
  }
};

/**
 * Send OTP Verification Email to user (Uses EmailJS)
 */
const sendOTPEmail = async (toEmail, otpCode, userName = 'Farmer') => {
  const templateId = env.emailjsOtpTemplateId || 'template_otp';
  const templateParams = {
    user_name: userName,
    otp_code: otpCode,
    expiry_minutes: '10',
    app_name: 'AgriQura',
  };
  return await sendMailEmailJS(toEmail, templateId, templateParams);
};

/**
 * Send Critical Alert Email to user (Uses EmailJS)
 */
const sendAlertEmail = async (toEmail, alertTitle, alertMessage, userName = 'Farmer') => {
  const templateId = env.emailjsAlertTemplateId || 'template_alert';
  const templateParams = {
    user_name: userName,
    alert_title: alertTitle,
    alert_message: alertMessage,
    app_name: 'AgriQura',
  };
  return await sendMailEmailJS(toEmail, templateId, templateParams);
};

/**
 * Send New Contact Inquiry Email to AgriQura Official Inbox (agriqura@gmail.com) (Uses Nodemailer)
 */
const sendSupportTeamNotification = async (ticketData) => {
  const supportTargetEmail = 'agriqura@gmail.com';
  const subject = `[Contact Form - ${ticketData.ticketId}] ${ticketData.subject} from ${ticketData.name}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2e7d32;">🌾 NEW INQUIRY RECEIVED ON AGRIQURA CONTACT PAGE</h2>
      <hr>
      <p><strong>From:</strong> ${ticketData.name} (${ticketData.email})</p>
      <p><strong>Phone:</strong> ${ticketData.phone || 'Not provided'}</p>
      <p><strong>User Type:</strong> ${ticketData.userType}</p>
      <p><strong>Subject:</strong> ${ticketData.subject}</p>
      <p><strong>Reference Ticket ID:</strong> ${ticketData.ticketId}</p>
      
      <h3>--- USER MESSAGE ---</h3>
      <p style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #2e7d32;">
        ${ticketData.message.replace(/\n/g, '<br>')}
      </p>

      ${ticketData.attachment ? `<p><strong>Attachment Attached:</strong> ${ticketData.attachment.filename} (${Math.round(ticketData.attachment.fileSize / 1024)} KB)</p>` : ''}
      
      <hr>
      <p>To reply to this user, click 'Reply' in your Gmail or write directly to <a href="mailto:${ticketData.email}">${ticketData.email}</a>.</p>
    </div>
  `;

  return await sendMailNodemailer(supportTargetEmail, subject, htmlContent, ticketData.email);
};

/**
 * Send Confirmation Receipt Email to the User who submitted the form (Uses Nodemailer)
 */
const sendContactConfirmationEmail = async (toEmail, ticketId, userName = 'Farmer', subject = 'General Inquiry', message = '') => {
  if (!toEmail || !toEmail.includes('@')) return { success: false, error: 'Invalid user email' };

  const mailSubject = `AgriQura Inquiry Confirmation: [${ticketId}]`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Hello ${userName},</h2>
      <p>Thank you for reaching out to AgriQura. Your message regarding "<strong>${subject}</strong>" has been received by our agricultural support team under Reference ID: <strong>${ticketId}</strong>.</p>
      
      <p>We are reviewing your query:</p>
      <blockquote style="background-color: #f5f5f5; padding: 10px; border-left: 3px solid #ccc;">
        "${message.length > 250 ? message.substring(0, 250) + '...' : message}"
      </blockquote>
      
      <p>We will respond to you at ${toEmail} as soon as possible.</p>
      
      <p>Best regards,<br>
      <strong>AgriQura Agricultural Support Team</strong><br>
      agriqura@gmail.com</p>
    </div>
  `;

  return await sendMailNodemailer(toEmail, mailSubject, htmlContent, 'agriqura@gmail.com');
};

module.exports = {
  sendOTPEmail,
  sendAlertEmail,
  sendSupportTeamNotification,
  sendContactConfirmationEmail,
};
