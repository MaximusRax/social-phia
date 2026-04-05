import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors font-medium shadow-sm mb-6">
          <span className="text-xl leading-none">&larr;</span> Back to Dashboard
        </Link>
        
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white p-8 sm:p-10">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold uppercase shadow-inner">
              {session.user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{session.user?.name}</h1>
              <p className="text-gray-500 mt-1">{session.user?.email}</p>
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Details</h2>
            <p className="text-gray-600 mb-2"><strong className="text-gray-900">User ID:</strong> {session.user?.id || "N/A"}</p>
            <p className="text-gray-600 mb-2"><strong className="text-gray-900">Member Since:</strong> Just joined</p>
          </div>
        </div>
      </div>
    </div>
  );
}
