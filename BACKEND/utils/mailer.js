import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT || 587;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const secure = process.env.SMTP_SECURE === "true";

let transporter;
if (host && user && pass) {
  transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: secure,
    auth: {
      user,
      pass,
    },
  });
} else if (process.env.NODE_ENV !== "production") {
  // In development, create an Ethereal test account so emails can be inspected
  // without real SMTP credentials.
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("Using Ethereal test account for email. Preview URL will be logged after sending.");
  } catch (err) {
    console.warn("Failed to create Ethereal test account:", err);
    transporter = null;
  }
} else {
  transporter = null;
}

export async function sendMail({ to, subject, text, html }) {
  if (!transporter) {
    console.warn("SMTP transporter not configured. Skipping sendMail.");
    return;
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });

  // If using Ethereal, log the preview URL for development testing
  if (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info)) {
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  }

  return info;
}

export default transporter;
