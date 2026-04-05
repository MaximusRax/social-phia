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
      // 1. Register the new user
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to create account.");
        setLoading(false);
        return;
      }

      // 2. Automatically log the user in after registration
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

      // 3. Save the default location using the newly established user session
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

      // 4. Redirect to dashboard
      router.push("/dashboard");
      
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 py-10">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Join Neighborhood</h2>
          <p className="mt-2 text-sm text-gray-600">Create an account to connect locally</p>
        </div>

        {error && (
          <div className="bg-red-50 p-3 rounded-xl border border-red-200">
            <p className="text-red-600 text-sm text-center font-medium">{error}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Account Details */}
          <div className="space-y-4">
            <input required type="text" placeholder="Full Name" className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 outline-none" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input required type="email" placeholder="Email address" className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 outline-none" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input required type="password" placeholder="Password" className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 outline-none" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>

          <hr className="border-gray-100 my-6" />

          {/* Default Location Setup */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Set Default Location</h3>
            <p className="text-xs text-gray-500 mb-4">We'll use this to show nearby requests.</p>
            
            <button onClick={handleAutoDetect} className="w-full bg-indigo-50 text-indigo-700 font-bold py-2.5 rounded-xl mb-4 hover:bg-indigo-100 transition-colors text-sm shadow-sm">
              Auto Detect Current Location 📍
            </button>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Latitude</label>
                <input required type="number" step="any" value={formData.lat} onChange={(e) => setFormData({ ...formData, lat: e.target.value })} className="w-full p-2.5 text-sm border border-gray-200 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="e.g. 40.7128" />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Longitude</label>
                <input required type="number" step="any" value={formData.lng} onChange={(e) => setFormData({ ...formData, lng: e.target.value })} className="w-full p-2.5 text-sm border border-gray-200 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="e.g. -74.0060" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full mt-8 flex justify-center rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors shadow-md">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account? <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}