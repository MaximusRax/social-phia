import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth"; // Ensure you use the new lib/auth path
import dbConnect from "@/lib/mongodb";
import Message from "@/lib/models/Message";
import Job from "@/lib/models/Job";
import ChatRoom from "@/components/ChatRoom";
import Link from "next/link";

export default async function ChatPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // FIX: You must await params before destructuring in Next.js 15
  const resolvedParams = await params;
  const { jobId } = resolvedParams;

  await dbConnect();

  try {
    // 1. Verify the job exists and populate participants
    const job = await Job.findById(jobId)
      .populate('postedBy', 'name')
      .populate('acceptedBy', 'name');

    if (!job) {
      return (
        <div className="p-10 text-center">
          <h1 className="text-xl font-bold">Job not found</h1>
          <p className="text-gray-500">The job ID {jobId} does not exist in our records.</p>
          <Link href="/dashboard" className="text-indigo-600 underline mt-4 inline-block">Return to Dashboard</Link>
        </div>
      );
    }

    // Safely extract the IDs 
    const posterId = job.postedBy?._id?.toString() || job.postedBy?.toString();
    const accepterId = job.acceptedBy?._id?.toString() || job.acceptedBy?.toString();
    const currentUserId = session.user.id?.toString();

    const isPoster = posterId === currentUserId;
    const isAccepter = accepterId === currentUserId;

    // SCENARIO 1: The user has nothing to do with this job
    if (!isPoster && !isAccepter) {
      return (
        <div className="p-10 text-center mt-20">
          <h2 className="text-red-600 font-bold text-2xl mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You are not authorized to view this chat.</p>
          <Link href="/dashboard" className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800">Return to Dashboard</Link>
        </div>
      );
    }

    // SCENARIO 2: The creator is looking at the chat, but nobody has accepted it yet
    if (isPoster && job.status === 'open') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 py-20 px-4 flex flex-col items-center justify-center">
          <div className="bg-white/90 p-12 rounded-3xl shadow-xl shadow-indigo-100/50 border border-white text-center max-w-md w-full backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <div className="text-5xl mb-6 animate-pulse">⏳</div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Waiting for a neighbor</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your request for <strong>&quot;{job.title}&quot;</strong> is currently on the neighborhood board.
              This chat room will activate as soon as someone accepts the job.
            </p>
            <Link href="/dashboard" className="inline-flex items-center justify-center bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-indigo-600 font-bold shadow-md transition-all active:scale-95">
              Return to Dashboard
            </Link>
          </div>
        </div>
      );
    }

    // 2. Fetch initial messages
    const initialMessages = await Message.find({ jobId })
      .populate("sender", "name")
      .sort({ createdAt: 1 })
      .lean();

    // Serialize data for the Client Component
    const serializedMessages = initialMessages.map(msg => ({
      ...msg,
      _id: msg._id.toString(),
      jobId: msg.jobId.toString(),
      sender: {
        ...msg.sender,
        _id: msg.sender._id.toString()
      }
    }));

    const otherPerson = isPoster ? job.acceptedBy : job.postedBy;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors font-medium shadow-sm mb-4">
            <span className="text-xl leading-none">&larr;</span> Back to Dashboard
          </Link>
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Chatting with: <Link href={`/profile/${otherPerson?._id}`} className="font-medium text-indigo-600 hover:underline">{otherPerson?.name}</Link>
                </p>
              </div>
              <span className="bg-blue-100/50 text-blue-700 border border-blue-200 text-xs tracking-wider uppercase font-bold px-3 py-1.5 rounded-lg">{job.status}</span>
            </div>
            <p className="text-gray-600 mt-3 leading-relaxed">{job.description}</p>
          </div>
        </div>

        <ChatRoom jobId={jobId} initialMessages={serializedMessages} />
      </div>
    );
  } catch (error) {
    console.error("Chat Page Error:", error);
    return <div className="p-10 text-center">An error occurred loading the chat.</div>;
  }
}