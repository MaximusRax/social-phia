import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, 
    bio: { type: String },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, 
    },
    jobsCompleted: { type: Number, default: 0 },
    defaultLocation: { lat: Number, lng: Number },
  },
  { timestamps: true },
);

UserSchema.index({ location: "2dsphere" });

export default mongoose.models.User || mongoose.model("User", UserSchema);
