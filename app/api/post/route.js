import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Post from "@/lib/models/Post"; // Assumes you have a Post mongoose model

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, type, image, location } = body;

    await dbConnect();

    // Create the neighborhood post with the user's ID and location
    const newPost = await Post.create({
      content,
      type: type || "news",
      image: image || "", // This will natively store the Base64 image
      location,
      author: session.user.id,
    });

    return NextResponse.json(
      { message: "Post created successfully", post: newPost },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create Post Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius");

    await dbConnect();

    let query = {};

    // Use MongoDB 2dsphere $centerSphere to filter by radius
    if (lat && lng && radius) {
      // Convert radius in km to radians (Earth's radius is ~6378.1 km)
      const radiusInRadians = Number(radius) / 6378.1;
      query.location = {
        $geoWithin: {
          $centerSphere: [[Number(lng), Number(lat)], radiusInRadians],
        },
      };
    }

    const posts = await Post.find(query)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Fetch Posts Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
