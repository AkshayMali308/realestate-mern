import asyncHandler from "express-async-handler";
import Property from "../models/Property.js";

// @desc  Get all properties with search, filters, sort, pagination
// @route GET /api/properties
export const getProperties = asyncHandler(async (req, res) => {
  const {
    keyword,
    city,
    locality,
    listingType,
    propertyType,
    minPrice,
    maxPrice,
    bedrooms,
    minArea,
    maxArea,
    furnishing,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const query = { status: "active" };

  if (keyword) {
    query.$text = { $search: keyword };
  }
  if (city) query["address.city"] = new RegExp(`^${city}$`, "i");
  if (locality) query["address.locality"] = new RegExp(locality, "i");
  if (listingType) query.listingType = listingType;
  if (propertyType) query.propertyType = { $in: propertyType.split(",") };
  if (furnishing) query.furnishing = furnishing;
  if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (minArea || maxArea) {
    query.area = {};
    if (minArea) query.area.$gte = Number(minArea);
    if (maxArea) query.area.$lte = Number(maxArea);
  }

  const sortMap = {
    newest: { createdAt: -1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    "area-desc": { area: -1 },
  };
  const sortBy = sortMap[sort] || { isFeatured: -1, createdAt: -1 };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(48, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const [properties, total] = await Promise.all([
    Property.find(query).sort(sortBy).skip(skip).limit(limitNum).populate("owner", "name role company isVerified"),
    Property.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: properties.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    properties,
  });
});

// @desc  Get single property by slug or id
// @route GET /api/properties/:id
export const getProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };

  const property = await Property.findOne(query).populate("owner", "name email phone role company isVerified avatar");
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }
  property.views += 1;
  await property.save();
  res.json({ success: true, property });
});

// @desc  Create a property listing
// @route POST /api/properties
export const createProperty = asyncHandler(async (req, res) => {
  const property = await Property.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, property });
});

// @desc  Update a property listing
// @route PUT /api/properties/:id
export const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }
  if (property.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this listing");
  }
  Object.assign(property, req.body);
  const updated = await property.save();
  res.json({ success: true, property: updated });
});

// @desc  Delete a property listing
// @route DELETE /api/properties/:id
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }
  if (property.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this listing");
  }
  await property.deleteOne();
  res.json({ success: true, message: "Listing removed" });
});

// @desc  Get listings owned by logged in user
// @route GET /api/properties/mine/all
export const getMyProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: properties.length, properties });
});

// @desc  Get similar properties
// @route GET /api/properties/:id/similar
export const getSimilarProperties = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }
  const similar = await Property.find({
    _id: { $ne: property._id },
    "address.city": property.address.city,
    propertyType: property.propertyType,
    listingType: property.listingType,
    status: "active",
  })
    .limit(4)
    .populate("owner", "name role isVerified");
  res.json({ success: true, properties: similar });
});
