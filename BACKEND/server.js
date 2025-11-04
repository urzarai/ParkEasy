import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables as early as possible so other modules (mailer, etc.)
// see the correct values when they're imported.
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import buildingRoutes from "./routes/buildingRoutes.js";
import spotRoutes from "./routes/spotRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import initMailer from "./utils/mailer.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/spots", spotRoutes);
app.use("/api/reservations", reservationRoutes);


app.get("/", (req, res) => {
  res.send("✅ Server is running and routes are active");
});

// Log mailer initialization status (server-level)
try {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log(`Mailer: configured to use SMTP ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
  } else if (process.env.NODE_ENV !== "production") {
    console.log("Mailer: no SMTP credentials found — Ethereal will be used for dev previews");
  } else {
    console.log("Mailer: no SMTP configured — emails will be skipped in production");
  }
} catch (e) {
  // ignore
}

// Initialize mailer (will prefer SMTP when env vars are present)
initMailer()
  .then(() => {
    console.log("Mailer initialized (checked transporter)");
  })
  .catch((err) => {
    console.error("Mailer initialization error:", err && err.message ? err.message : err);
  });


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
