import express from "express";
import { signup, login, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/signup", (req, res, next) => {
  console.log("📩 /api/auth/signup route hit");
  next();
}, signup);

router.post("/login", (req, res, next) => {
  console.log("📩 /api/auth/login route hit");
  next();
}, login);
// Protected route
router.get("/profile", protect, getProfile);

export default router;
