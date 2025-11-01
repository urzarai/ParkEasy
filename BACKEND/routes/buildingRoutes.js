import express from "express";
import {
  addBuilding,
  getBuildings,
  editBuilding,
  deleteBuilding,
} from "../controllers/buildingController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, adminOnly, addBuilding);
router.get("/", protect, getBuildings);
router.put("/:id", protect, adminOnly, editBuilding);
router.delete("/:id", protect, adminOnly, deleteBuilding);

export default router;
