import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed"],
      default: "open",
    },
    // The location of where the job needs to happen
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    exchangeOffer: { type: String }, // e.g., "$20", "Will bake cookies", etc.
  },
  { timestamps: true },
);

JobSchema.index({ location: "2dsphere" });

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
