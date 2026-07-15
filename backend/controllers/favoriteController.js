import asyncHandler from "express-async-handler";
import Favorite from "../models/Favorite.js";

// @desc  Get my favorite properties
// @route GET /api/favorites
export const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user._id }).populate({
    path: "property",
    populate: { path: "owner", select: "name role isVerified" },
  });
  res.json({ success: true, favorites: favorites.map((f) => f.property).filter(Boolean) });
});

// @desc  Toggle favorite (add/remove)
// @route POST /api/favorites/:propertyId
export const toggleFavorite = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const existing = await Favorite.findOne({ user: req.user._id, property: propertyId });

  if (existing) {
    await existing.deleteOne();
    return res.json({ success: true, favorited: false });
  }

  await Favorite.create({ user: req.user._id, property: propertyId });
  res.json({ success: true, favorited: true });
});
