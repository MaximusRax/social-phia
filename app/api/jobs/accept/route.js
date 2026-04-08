import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; 
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";

export async function PATCH(req) {
  try {
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

    const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId, status: "open", postedBy: { $ne: session.user.id } },
      {
        $set: {
          status: "in-progress",
          acceptedBy: session.user.id,
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
