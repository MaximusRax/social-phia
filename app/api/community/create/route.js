import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import User from "@/lib/models/User"; // Required for population

// Force Next.js to always treat this as a live API route instead of caching a 404!
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find the database ID using the session email to ensure Mongoose accepts the insert
    let authorId = session.user.id;
    if (!authorId && session.user.email) {
      const dbUser = await User.findOne({ email: session.user.email }).select("_id");
      if (dbUser) authorId = dbUser._id;
    }

    if (!authorId) {
      return NextResponse.json({ message: "User account not found" }, { status: 400 });
    }

    const body = await req.json();
    const { content, type, coordinates, image } = body;

    if (!content || !coordinates) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newPost = await Post.create({
      content,
      type,
      image,
      author: authorId,
      location: {
        type: "Point",
        coordinates,
      },
    });

    return NextResponse.json(
      { message: "Post created successfully", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Post Error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}