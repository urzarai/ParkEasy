import express from "express";
import { getUserEmails } from "../controllers/deviceController.js";

const router = express.Router();

// Route to get user emails - requires API key
router.get("/emails", getUserEmails);

export default router;