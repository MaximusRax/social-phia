import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const user = await User.findById(session.user.id).lean();

    return NextResponse.json(
      { defaultLocation: user?.defaultLocation || null },
      { status: 200 },
    );
  } catch (error) {
    console.error("Location Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { lat, lng } = await req.json();
    if (lat === undefined || lng === undefined)
      return NextResponse.json(
        { error: "Coordinates required" },
        { status: 400 },
      );

    await dbConnect();
    await User.findByIdAndUpdate(session.user.id, {
      $set: { defaultLocation: { lat, lng } },
    });

    return NextResponse.json(
      { message: "Location updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Location Save Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
