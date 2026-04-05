import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Message from "@/lib/models/Message";
import Job from "@/lib/models/Job";
import Pusher from "pusher";

// Initialize Pusher Server-side
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { jobId, text } = await req.json();

    if (!jobId || !text) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    // Check if user is authorized to send messages to this job
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    const isPoster = job.postedBy.toString() === session.user.id;
    const isAccepter = job.acceptedBy && job.acceptedBy.toString() === session.user.id;

    if (!isPoster && !isAccepter) {
      return NextResponse.json({ message: "Unauthorized to send messages to this job" }, { status: 403 });
    }

    // 1. Save to Database
    const newMessage = await Message.create({
      jobId,
      sender: session.user.id,
      text,
    });

    // We need the sender's name to display in the UI
    await newMessage.populate("sender", "name");

    // 2. Broadcast via Pusher
    // We use the Job ID as a unique channel so only the right people hear it
    const channelName = `chat-${jobId}`;
    await pusher.trigger(channelName, "new-message", {
      _id: newMessage._id,
      text: newMessage.text,
      sender: newMessage.sender,
      createdAt: newMessage.createdAt,
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Message Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
