import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  getSimilarProperties,
} from "../controllers/propertyController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProperties);
router.get("/mine/all", protect, getMyProperties);
router.get("/:id", getProperty);
router.get("/:id/similar", getSimilarProperties);
router.post("/", protect, authorize("owner", "agent", "admin"), createProperty);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);

export default router;
