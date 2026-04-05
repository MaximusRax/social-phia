import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { message: "Job ID is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Find and update the job ONLY if the logged-in user is the one who posted it
    const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId, postedBy: session.user.id },
      {
        $set: { status: "open" }, // Put it back on the neighborhood board
        $unset: { acceptedBy: "" }, // Completely remove the person who accepted it
      },
      { new: true },
    );

    if (!updatedJob) {
      return NextResponse.json(
        { message: "Job not found or you are not authorized to edit it" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Job reopened successfully", job: updatedJob },
      { status: 200 },
    );
  } catch (error) {
    console.error("Job Reopen Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
