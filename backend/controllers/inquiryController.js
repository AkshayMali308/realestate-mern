import asyncHandler from "express-async-handler";
import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";

// @desc  Send inquiry / contact owner about a listing
// @route POST /api/inquiries
export const createInquiry = asyncHandler(async (req, res) => {
  const { propertyId, name, email, phone, message } = req.body;
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const inquiry = await Inquiry.create({
    property: propertyId,
    sender: req.user._id,
    receiver: property.owner,
    name,
    email,
    phone,
    message,
  });

  res.status(201).json({ success: true, inquiry });
});

// @desc  Get inquiries received for my listings
// @route GET /api/inquiries/received
export const getReceivedInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find({ receiver: req.user._id })
    .populate("property", "title slug images address")
    .sort({ createdAt: -1 });
  res.json({ success: true, inquiries });
});
