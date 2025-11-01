import express from "express";
import { addSpot, getSpotsByBuilding, deleteSpot } from "../controllers/spotController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/building/:buildingId", protect, adminOnly, addSpot);
router.get("/building/:buildingId", protect, getSpotsByBuilding);
router.delete("/:id", protect, adminOnly, deleteSpot);

export default router;
