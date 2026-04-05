import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Import the options
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";
import User from "@/lib/models/User";

export async function POST(req) {
  try {
    // CRITICAL: Pass authOptions here so NextAuth can find the user ID
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized - No User ID" },
        { status: 401 },
      );
    }

    const { title, description, exchangeOffer, coordinates } = await req.json();
    await dbConnect();

    // ... (Your location logic from before) ...
    let finalCoords = coordinates;
    if (!finalCoords) {
      const user = await User.findById(session.user.id);
      finalCoords = user.location.coordinates;
    }

    const newJob = await Job.create({
      title,
      description,
      exchangeOffer,
      postedBy: session.user.id, // This will now be defined!
      location: {
        type: "Point",
        coordinates: finalCoords,
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
