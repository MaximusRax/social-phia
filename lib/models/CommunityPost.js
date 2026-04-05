import mongoose from "mongoose";

const CommunityPostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["news", "alert", "event"], default: "news" },
    image: { type: String }, // Used to store Base64 image strings
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
  },
  { timestamps: true }
);

// Ensure a 2dsphere index exists for geospatial queries
CommunityPostSchema.index({ location: "2dsphere" });

export default mongoose.models.CommunityPost ||
  mongoose.model("CommunityPost", CommunityPostSchema);