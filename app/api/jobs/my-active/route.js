import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const myJobs = await Job.find({
      $or: [{ postedBy: session.user.id }, { acceptedBy: session.user.id }],
    })
      .populate("postedBy", "name")
      .populate("acceptedBy", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ jobs: myJobs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching active jobs:", error);
    return NextResponse.json(
      { message: "Error fetching active jobs" },
      { status: 500 },
    );
  }
}
