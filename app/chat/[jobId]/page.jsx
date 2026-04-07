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
        <div className="p-10 text-center min-h-screen flex flex-col items-center justify-center bg-[#F1FAEE] font-sans">
          <h1 className="text-3xl font-extrabold text-[#1D3557] mb-2 tracking-tight">Job not found</h1>
          <p className="text-[#3D405B] font-medium">The job ID {jobId} does not exist in our records.</p>
          <Link href="/dashboard" className="text-[#457B9D] font-bold mt-6 inline-block bg-[#A8DADC]/30 px-6 py-3 rounded-full hover:bg-[#A8DADC]/50 transition-colors">Return to Dashboard</Link>
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
        <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-[#F1FAEE] font-sans">
          <h2 className="text-[#E63946] font-extrabold text-4xl mb-4 tracking-tight">Access Denied</h2>
          <p className="text-[#3D405B] font-medium mb-8 text-lg">You are not authorized to view this chat.</p>
          <Link href="/dashboard" className="bg-[#1D3557] text-white font-bold px-8 py-4 rounded-full hover:bg-[#3D405B] transition-transform active:scale-95 shadow-md">Return to Dashboard</Link>
        </div>
      );
    }

    // SCENARIO 2: The creator is looking at the chat, but nobody has accepted it yet
    if (isPoster && job.status === 'open') {
      return (
        <div className="min-h-screen bg-[#F1FAEE] py-20 px-4 flex flex-col items-center justify-center font-sans">
          <div className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 text-center max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#457B9D]"></div>
            <div className="text-6xl mb-8 animate-pulse">⏳</div>
            <h2 className="text-3xl font-extrabold text-[#1D3557] mb-4 tracking-tight">Waiting for a neighbor</h2>
            <p className="text-[#3D405B] mb-10 leading-relaxed font-medium">
              Your request for <strong>&quot;{job.title}&quot;</strong> is currently on the neighborhood board.
              This chat room will activate as soon as someone accepts the job.
            </p>
            <Link href="/dashboard" className="inline-flex items-center justify-center bg-[#457B9D] text-white px-8 py-4 rounded-full hover:bg-[#1D3557] font-bold shadow-md transition-all active:scale-95 w-full text-lg">
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
      <div className="min-h-screen bg-[#F1FAEE] py-10 px-4 font-sans">
        <div className="max-w-4xl mx-auto mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full text-[#1D3557] hover:text-[#457B9D] hover:bg-[#A8DADC]/30 transition-colors font-bold shadow-sm mb-6 border border-[#A8DADC]/50">
            <span className="text-xl leading-none pb-0.5">&larr;</span> Back to Dashboard
          </Link>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#A8DADC]/50">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-extrabold text-[#1D3557] tracking-tight">{job.title}</h1>
                <p className="text-sm text-[#3D405B]/70 mt-2 font-medium">
                  Chatting with: <Link href={`/profile/${otherPerson?._id}`} className="font-medium text-[#457B9D] hover:underline">{otherPerson?.name}</Link>
                </p>
              </div>
              <span className="bg-[#457B9D]/20 text-[#1D3557] text-xs tracking-wider uppercase font-extrabold px-4 py-1.5 rounded-full">{job.status}</span>
            </div>
            <p className="text-[#3D405B] mt-4 leading-relaxed font-medium">{job.description}</p>
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