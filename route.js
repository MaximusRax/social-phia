import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import User from "@/lib/models/User"; // Required for population

// Force Next.js to always treat this as a live API route instead of caching a 404!
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    console.log("✅ NEIGHBORHOOD FEED API HIT");

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const lng = parseFloat(searchParams.get("lng"));
    const lat = parseFloat(searchParams.get("lat"));
    const radius = parseInt(searchParams.get("radius")) || 10000;

    if (isNaN(lng) || isNaN(lat)) {
      return NextResponse.json({ message: "Invalid coordinates" }, { status: 400 });
    }

    await dbConnect();

    // Find posts within the specified radius
    const posts = await Post.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: radius,
        },
      },
    })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Fetch Nearby Posts Error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}