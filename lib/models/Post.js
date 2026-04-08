import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    type: { type: String, enum: ["news", "alert", "event"], default: "news" },
    image: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
  },
  { timestamps: true }
);

PostSchema.index({ location: "2dsphere" });

export default mongoose.models.Post || mongoose.model("Post", PostSchema);