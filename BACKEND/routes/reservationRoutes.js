import express from "express";
import {
  reserveSpot,
  getReservationsByBuilding,
} from "../controllers/reservationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/spot/:spotId", protect, reserveSpot);
router.get("/building/:buildingId", protect, getReservationsByBuilding);

export default router;
