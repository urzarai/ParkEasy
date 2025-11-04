import nodemailer from "nodemailer";

let transporter = null;
let usingEthereal = false;

async function initTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true";

  // Prefer a real SMTP transporter when credentials are provided
  if (host && user && pass) {
    try {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });

      // Verify connection configuration (best-effort; don't throw on failure)
      try {
        await transporter.verify();
        console.log(`📧 SMTP transporter configured: host=${host} port=${port} secure=${secure}`);
      } catch (verifyErr) {
        console.warn("⚠️  SMTP transporter configured but verification failed:", verifyErr && verifyErr.message ? verifyErr.message : verifyErr);
      }

      usingEthereal = false;
      return transporter;
    } catch (err) {
      console.error("Failed to create SMTP transporter:", err);
      transporter = null;
    }
  }

  // If no SMTP credentials, fall back to Ethereal during development only
  if (process.env.NODE_ENV !== "production") {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      usingEthereal = true;
      console.log("📧 Using Ethereal test account for development (preview URL will be logged after sending).");
      return transporter;
    } catch (err) {
      console.warn("Failed to create Ethereal test account:", err);
      transporter = null;
      return null;
    }
  }

  // No transporter available in production
  console.log("⚠️  No SMTP transporter configured and running in production mode — emails will be skipped.");
  transporter = null;
  return null;
}

export async function sendMail({ to, subject, text, html }) {
  const tr = await initTransporter();
  if (!tr) {
    console.warn("SMTP transporter not configured. Skipping sendMail.");
    return null;
  }

  try {
    const info = await tr.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });

    // If using Ethereal, log the preview URL for development testing
    if (usingEthereal && nodemailer.getTestMessageUrl) {
      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) console.log("📨 Preview URL:", preview);
    }

    console.log("📨 Email sent (messageId):", info && info.messageId ? info.messageId : info);
    return info;
  } catch (err) {
    console.error("Failed to send email:", err && err.message ? err.message : err);
    throw err;
  }
}

// Export init for manual checks from server startup if desired
export async function initMailer() {
  return initTransporter();
}

export default initTransporter;
