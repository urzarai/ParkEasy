// BACKEND/scripts/send-test-email.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Ensure we load the BACKEND/.env regardless of current working directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });
import nodemailer from "nodemailer";

async function run() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: "your-personal-test-email@domain.com",
    subject: "ParkEasy test — Gmail SMTP",
    text: "Hello — this is a test from ParkEasy using Gmail SMTP.",
    html: "<p>Hello — this is a <b>test</b> from ParkEasy using Gmail SMTP.</p>",
  });

  console.log("Message sent:", info.messageId);
}
run().catch(console.error);