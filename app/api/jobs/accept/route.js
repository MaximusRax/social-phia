import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // <-- 1. Import authOptions
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";

export async function PATCH(req) {
  try {
    // 2. Pass authOptions into the session so it grabs your User ID
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { message: "Job ID is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // 3. Update the job with your actual ID
    const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId, status: "open", postedBy: { $ne: session.user.id } },
      {
        $set: {
          status: "in-progress",
          acceptedBy: session.user.id, // This will no longer be undefined!
        },
      },
      { new: true },
    );

    if (!updatedJob) {
      return NextResponse.json(
        { message: "Job no longer available or not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Job accepted successfully", job: updatedJob },
      { status: 200 },
    );
  } catch (error) {
    console.error("Job Acceptance Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
