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
      <div className="min-h-screen flex items-center justify-center bg-[#F1FAEE]">
        <div className="animate-spin w-14 h-14 border-4 border-[#A8DADC] border-t-[#457B9D] rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1FAEE] py-10 px-4 font-sans text-[#1D3557]">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full text-[#3D405B] hover:text-[#457B9D] hover:bg-[#A8DADC]/30 transition-colors font-bold shadow-sm mb-6 border border-[#A8DADC]/50 w-max">
          <span className="text-xl leading-none pb-0.5">&larr;</span> Back to Dashboard
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-[#3D405B]/10 overflow-hidden border border-[#A8DADC]/30">
          <div className="bg-[#457B9D] px-8 py-10 text-center relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#457B9D] to-[#1D3557] opacity-80 mix-blend-multiply"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-[#F1FAEE] text-[#457B9D] rounded-[2rem] mx-auto flex items-center justify-center text-4xl font-extrabold shadow-lg mb-4">
                {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{formData.name || "Neighbor"}</h1>
              <p className="text-[#F1FAEE] font-medium mt-1">{formData.email}</p>
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-bold mt-4 backdrop-blur-sm">
                🏆 {formData.jobsCompleted} Jobs Completed
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <h2 className="text-2xl font-extrabold text-[#1D3557] mb-6 tracking-tight">Edit Profile</h2>

            {message.text && (
              <div className={`p-4 rounded-2xl mb-8 font-bold text-sm ${message.type === "success" ? "bg-[#81B29A]/20 text-[#1D3557]" : "bg-[#E63946]/10 text-[#E63946]"}`}>
                {message.type === "success" ? "✅ " : "⚠️ "} {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#3D405B] mb-2 pl-2">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-4 bg-[#F4F1DE] rounded-2xl border-none font-medium focus:bg-white focus:ring-2 focus:ring-[#457B9D] outline-none transition-all text-[#1D3557]"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#3D405B] mb-2 pl-2">Bio</label>
                <p className="text-xs font-bold text-[#3D405B]/70 mb-3 pl-2 uppercase tracking-wide">Tell your neighbors a little about yourself and your skills</p>
                <textarea
                  rows={4}
                  className="w-full p-4 bg-[#F4F1DE] rounded-2xl border-none font-medium focus:bg-white focus:ring-2 focus:ring-[#457B9D] outline-none transition-all resize-none text-[#1D3557]"
                  placeholder="E.g. I'm a software engineer who loves baking cookies and walking dogs!"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                ></textarea>
              </div>

              <div className="pt-4 border-t border-[#A8DADC]/50 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#457B9D] text-white px-8 py-4 rounded-full font-bold hover:bg-[#1D3557] hover:shadow-lg transition-all active:scale-95 disabled:bg-[#A8DADC]/50 disabled:text-[#3D405B] disabled:shadow-none"
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