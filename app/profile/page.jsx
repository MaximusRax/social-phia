"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({ name: "", bio: "", email: "", jobsCompleted: 0 });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.user.name || "",
          bio: data.user.bio || "",
          email: data.user.email || "",
          jobsCompleted: data.user.jobsCompleted || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, bio: formData.bio }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to update profile." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="animate-spin w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10 px-4 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors font-bold shadow-sm mb-6 border border-slate-100 w-max">
          <span className="text-xl leading-none pb-0.5">&larr;</span> Back to Dashboard
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="bg-indigo-600 px-8 py-10 text-center relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-50 mix-blend-multiply"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white text-indigo-600 rounded-[2rem] mx-auto flex items-center justify-center text-4xl font-extrabold shadow-lg mb-4">
                {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{formData.name || "Neighbor"}</h1>
              <p className="text-indigo-100 font-medium mt-1">{formData.email}</p>
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-bold mt-4 backdrop-blur-sm">
                🏆 {formData.jobsCompleted} Jobs Completed
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6 tracking-tight">Edit Profile</h2>

            {message.text && (
              <div className={`p-4 rounded-2xl mb-8 font-bold text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                {message.type === "success" ? "✅ " : "⚠️ "} {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 pl-2">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-4 bg-slate-100 rounded-2xl border-none font-medium focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-slate-900"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 pl-2">Bio</label>
                <p className="text-xs font-bold text-slate-500 mb-3 pl-2 uppercase tracking-wide">Tell your neighbors a little about yourself and your skills</p>
                <textarea
                  rows={4}
                  className="w-full p-4 bg-slate-100 rounded-2xl border-none font-medium focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all resize-none text-slate-900"
                  placeholder="E.g. I'm a software engineer who loves baking cookies and walking dogs!"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}