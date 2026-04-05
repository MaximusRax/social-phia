import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Hashed password
    bio: { type: String },
    // GeoJSON for location-based searching
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    jobsCompleted: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Crucial: Create a 2dsphere index so we can search "nearby" users
UserSchema.index({ location: "2dsphere" });

export default mongoose.models.User || mongoose.model("User", UserSchema);
