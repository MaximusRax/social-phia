"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: "", description: "", exchangeOffer: "", radius: 10000 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Manual Location State
  const [isManual, setIsManual] = useState(false);
  const [manualCoords, setManualCoords] = useState({ lng: "", lat: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Case A: User chose Manual Input
    if (isManual) {
      if (!manualCoords.lng || !manualCoords.lat) {
        setMessage("Please enter valid coordinates or use GPS.");
        setLoading(false);
        return;
      }
      return await submitJob([parseFloat(manualCoords.lng), parseFloat(manualCoords.lat)]);
    }

    // Case B: Automatic GPS
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await submitJob([position.coords.longitude, position.coords.latitude]);
        },
        async () => {
          setMessage("GPS failed. Please enter location manually below.");
          setIsManual(true); // Switch to manual mode automatically on failure
          setLoading(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsManual(true);
      setLoading(false);
    }
  };

  const submitJob = async (coordinates) => {
    try {
      const res = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, coordinates }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to post.");
      }
    } catch (err) {
      console.error("Error posting job:", err);
      setMessage("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-16 px-4 font-sans text-slate-900 flex items-center justify-center">
      <div className="max-w-2xl w-full p-8 sm:p-12 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">Request Help</h1>
  
        {message && <p className="mb-8 p-5 bg-amber-50 text-amber-900 font-bold rounded-2xl text-sm flex items-center gap-3"><span className="text-xl">⚠️</span> {message}</p>}
  
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 pl-2">What do you need?</label>
            <input required className="w-full p-5 bg-slate-100 rounded-2xl border-none font-medium focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all" placeholder="e.g., Need help moving a couch" onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
  
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 pl-2">Job Details</label>
            <textarea required rows={4} className="w-full p-5 bg-slate-100 rounded-2xl border-none font-medium focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all resize-none" placeholder="Be specific about the task..." onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
  
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 pl-2">Visibility Radius</label>
            <p className="text-xs font-bold text-slate-500 mb-3 pl-2 uppercase tracking-wide">How far should this request reach?</p>
            <select
              value={formData.radius}
              onChange={(e) => setFormData({ ...formData, radius: Number(e.target.value) })}
              className="w-full p-5 bg-slate-100 rounded-2xl border-none focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all cursor-pointer font-bold"
            >
              <option value={1000}>1 km (Immediate Neighborhood)</option>
              <option value={5000}>5 km (Local Area)</option>
              <option value={10000}>10 km (Wider City)</option>
              <option value={25000}>25 km (Regional)</option>
            </select>
          </div>

          {/* --- Location Section --- */}
          <div className="p-6 bg-slate-50 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-800 pl-1">Location Settings</span>
              <button
                type="button"
                onClick={() => setIsManual(!isManual)}
                className="text-xs bg-white px-4 py-2 rounded-full text-indigo-600 font-bold hover:bg-slate-100 transition-colors shadow-sm"
              >
                {isManual ? "Switch to Auto GPS" : "Set Manually"}
              </button>
            </div>
  
            {isManual ? (
              <div className="grid grid-cols-2 gap-5">
                <input
                  type="number" step="any" placeholder="Longitude (e.g. 72.8)"
                  className="p-4 text-sm font-medium bg-white rounded-2xl border-none focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                  onChange={(e) => setManualCoords({ ...manualCoords, lng: e.target.value })}
                />
                <input
                  type="number" step="any" placeholder="Latitude (e.g. 19.0)"
                  className="p-4 text-sm font-medium bg-white rounded-2xl border-none focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                  onChange={(e) => setManualCoords({ ...manualCoords, lat: e.target.value })}
                />
                <p className="col-span-2 text-xs text-slate-500 font-bold flex items-center gap-2 mt-1"><span className="text-base">💡</span> Tip: You can find these by long-pressing any spot on Google Maps.</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm font-bold text-emerald-800 bg-emerald-100/50 p-4 rounded-2xl">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-600"></span>
                </span>
                Will use your current GPS location
              </div>
            )}
          </div>
  
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-full text-lg font-bold hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:transform-none mt-4"
          >
            {loading ? "Processing..." : "Post to Neighborhood"}
          </button>
        </form>
      </div>
    </div>
  );
}