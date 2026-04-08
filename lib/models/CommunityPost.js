import mongoose from "mongoose";

const CommunityPostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["news", "alert", "event"], default: "news" },
    image: { type: String },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, 
    },
  },
  { timestamps: true }
);

CommunityPostSchema.index({ location: "2dsphere" });

export default mongoose.models.CommunityPost ||
  mongoose.model("CommunityPost", CommunityPostSchema);