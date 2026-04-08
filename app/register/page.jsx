"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    lat: "",
    lng: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAutoDetect = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }));
        },
        () => alert("Failed to get location automatically. Please enter it manually.")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        let errorMessage = "Failed to create account.";
        try {
          const data = await res.json();
          errorMessage = data.message || errorMessage;
        } catch (parseError) {
          console.error("Non-JSON error response from server");
        }
        setError(errorMessage);
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (signInResult?.error) {
        setError("Account created, but auto-login failed. Please log in manually.");
        setLoading(false);
        return;
      }

      if (formData.lat && formData.lng) {
        await fetch("/api/user/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng),
          }),
        });
      }

      router.push("/dashboard");
      
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F1FAEE] p-4 py-10 font-sans">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-lg border border-[#A8DADC]/50">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#1D3557]">Join Neighborhood</h2>
          <p className="mt-2 text-sm text-[#3D405B]">Create an account to connect locally</p>
        </div>

        {error && (
          <div className="bg-[#E63946]/10 p-3 rounded-xl border border-[#E63946]/20">
            <p className="text-[#E63946] text-sm text-center font-medium">{error}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input required type="text" placeholder="Full Name" className="block w-full rounded-xl border border-[#A8DADC] px-4 py-3 text-[#1D3557] focus:border-[#457B9D] focus:ring-1 focus:ring-[#457B9D] sm:text-sm bg-[#F4F1DE] outline-none" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input required type="email" placeholder="Email address" className="block w-full rounded-xl border border-[#A8DADC] px-4 py-3 text-[#1D3557] focus:border-[#457B9D] focus:ring-1 focus:ring-[#457B9D] sm:text-sm bg-[#F4F1DE] outline-none" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input required type="password" placeholder="Password" className="block w-full rounded-xl border border-[#A8DADC] px-4 py-3 text-[#1D3557] focus:border-[#457B9D] focus:ring-1 focus:ring-[#457B9D] sm:text-sm bg-[#F4F1DE] outline-none" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>

          <hr className="border-[#A8DADC]/30 my-6" />

          <div>
            <h3 className="text-sm font-bold text-[#1D3557] mb-1">Set Default Location</h3>
            <p className="text-xs text-[#3D405B]/80 mb-4">We&apos;ll use this to show nearby requests.</p>
            
            <button onClick={handleAutoDetect} className="w-full bg-[#A8DADC]/30 text-[#1D3557] font-bold py-2.5 rounded-xl mb-4 hover:bg-[#A8DADC]/50 transition-colors text-sm shadow-sm">
              Auto Detect Current Location 📍
            </button>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-[#3D405B] uppercase tracking-wide mb-1.5">Latitude</label>
                <input required type="number" step="any" value={formData.lat} onChange={(e) => setFormData({ ...formData, lat: e.target.value })} className="w-full p-2.5 text-sm border border-[#A8DADC] bg-[#F4F1DE] rounded-xl outline-none focus:ring-1 focus:ring-[#457B9D] transition-all" placeholder="e.g. 40.7128" />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-[#3D405B] uppercase tracking-wide mb-1.5">Longitude</label>
                <input required type="number" step="any" value={formData.lng} onChange={(e) => setFormData({ ...formData, lng: e.target.value })} className="w-full p-2.5 text-sm border border-[#A8DADC] bg-[#F4F1DE] rounded-xl outline-none focus:ring-1 focus:ring-[#457B9D] transition-all" placeholder="e.g. -74.0060" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full mt-8 flex justify-center rounded-xl bg-[#457B9D] px-4 py-3.5 text-sm font-bold text-white hover:bg-[#1D3557] focus:outline-none focus:ring-2 focus:ring-[#457B9D] focus:ring-offset-2 disabled:opacity-50 transition-colors shadow-md">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-[#3D405B]">
            Already have an account? <Link href="/login" className="font-medium text-[#457B9D] hover:text-[#1D3557]">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}