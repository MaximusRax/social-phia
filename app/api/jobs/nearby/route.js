import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";
// Assume dbConnect() is a utility function you create to connect to MongoDB
export const dynamic = "force-dynamic";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const lng = parseFloat(searchParams.get("lng"));
  const lat = parseFloat(searchParams.get("lat"));
  const radiusKm = parseFloat(searchParams.get("radius"));
  const maxDistance = (isNaN(radiusKm) ? 5 : radiusKm) * 1000; // convert km to meters

  try {
    const nearbyJobs = await Job.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: maxDistance, // in meters
        },
      },
      status: "open",
      postedBy: { $ne: session.user.id }, // Exclude own jobs
    }).populate("postedBy", "name");

    return NextResponse.json({ jobs: nearbyJobs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching nearby jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}
