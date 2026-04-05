"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterDetailsPage() {
  const router = useRouter();
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [saving, setSaving] = useState(false);

  const handleAutoDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => alert("Failed to get location automatically. Please enter it manually.")
      );
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: parseFloat(location.lat), lng: parseFloat(location.lng) }),
      });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to save default location");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full text-center relative">
        <Link href="/dashboard" className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 transition-colors">&larr; Back</Link>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-4 mb-2">Set Default Location</h1>
        <p className="text-slate-500 mb-8 leading-relaxed text-sm">We'll use this fallback location whenever you sign in, ensuring you can still match with neighbors even if your device's live location is unavailable.</p>

        <button onClick={handleAutoDetect} className="w-full bg-indigo-50 text-indigo-700 font-bold py-3.5 rounded-xl mb-6 hover:bg-indigo-100 transition-colors shadow-sm">
          Auto Detect Current Location 📍
        </button>

        <form onSubmit={handleSave} className="space-y-5 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Latitude</label>
            <input required type="number" step="any" value={location.lat} onChange={(e) => setLocation({ ...location, lat: e.target.value })} className="w-full p-3.5 border border-slate-200 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="e.g. 40.7128" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Longitude</label>
            <input required type="number" step="any" value={location.lng} onChange={(e) => setLocation({ ...location, lng: e.target.value })} className="w-full p-3.5 border border-slate-200 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="e.g. -74.0060" />
          </div>
          <button type="submit" disabled={saving || !location.lat || !location.lng} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 mt-4 shadow-md">
            {saving ? "Saving..." : "Save Default Location"}
          </button>
        </form>
      </div>
    </div>
  );
}
