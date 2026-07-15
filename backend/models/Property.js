import mongoose from "mongoose";
import slugify from "slugify";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    listingType: { type: String, enum: ["sale", "rent"], required: true },
    propertyType: {
      type: String,
      enum: ["apartment", "villa", "independent-house", "plot", "office", "shop", "pg"],
      required: true,
    },
    price: { type: Number, required: true },
    priceUnit: { type: String, enum: ["total", "per-month"], default: "total" },
    area: { type: Number, required: true }, // sq.ft
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    furnishing: { type: String, enum: ["unfurnished", "semi-furnished", "furnished"], default: "unfurnished" },
    floor: { type: String, default: "" },
    ageOfProperty: { type: String, default: "" },
    facing: { type: String, default: "" },
    amenities: [{ type: String }],
    images: [{ type: String }],
    address: {
      locality: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, default: "" },
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ownerType: { type: String, enum: ["owner", "agent", "builder"], default: "owner" },
    status: { type: String, enum: ["active", "sold", "rented", "inactive"], default: "active" },
    isVerified: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    reraId: { type: String, default: "" },
  },
  { timestamps: true }
);

propertySchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(`${this.title}-${this.address?.city || ""}-${Date.now().toString().slice(-5)}`, {
      lower: true,
      strict: true,
    });
  }
  next();
});

propertySchema.index({ title: "text", description: "text", "address.locality": "text", "address.city": "text" });
propertySchema.index({ "address.city": 1, listingType: 1, propertyType: 1, price: 1 });

export default mongoose.model("Property", propertySchema);
