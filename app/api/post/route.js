import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Post from "@/lib/models/Post";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, type, image, location } = body;

    await dbConnect();

    const newPost = await Post.create({
      content,
      type: type || "news",
      image: image || "",
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

    if (lat && lng && radius) {
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
