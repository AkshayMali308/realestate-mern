import express from "express";
import { createInquiry, getReceivedInquiries } from "../controllers/inquiryController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createInquiry);
router.get("/received", protect, getReceivedInquiries);

export default router;
