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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 py-12 px-4">
      <div className="max-w-2xl mx-auto p-8 sm:p-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Request Help</h1>
  
        {message && <p className="mb-6 p-4 bg-amber-50 text-amber-800 rounded-xl text-sm border border-amber-200 flex items-center gap-2"><span className="text-lg">⚠️</span> {message}</p>}
  
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">What do you need?</label>
            <input required className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200" placeholder="e.g., Need help moving a couch" onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
  
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Job Details</label>
            <textarea required rows={4} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200 resize-none" placeholder="Be specific about the task..." onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
  
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Visibility Radius</label>
            <p className="text-xs text-gray-500 mb-2">How far away should neighbors be able to see this request?</p>
            <select
              value={formData.radius}
              onChange={(e) => setFormData({ ...formData, radius: Number(e.target.value) })}
              className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200 cursor-pointer font-medium"
            >
              <option value={1000}>1 km (Immediate Neighborhood)</option>
              <option value={5000}>5 km (Local Area)</option>
              <option value={10000}>10 km (Wider City)</option>
              <option value={25000}>25 km (Regional)</option>
            </select>
          </div>

          {/* --- Location Section --- */}
          <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-200/60">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-800">Location Settings</span>
              <button
                type="button"
                onClick={() => setIsManual(!isManual)}
                className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-indigo-600 font-bold hover:bg-gray-50 transition-colors shadow-sm"
              >
                {isManual ? "Switch to Auto GPS" : "Set Manually"}
              </button>
            </div>
  
            {isManual ? (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number" step="any" placeholder="Longitude (e.g. 72.8)"
                  className="p-3 text-sm bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  onChange={(e) => setManualCoords({ ...manualCoords, lng: e.target.value })}
                />
                <input
                  type="number" step="any" placeholder="Latitude (e.g. 19.0)"
                  className="p-3 text-sm bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  onChange={(e) => setManualCoords({ ...manualCoords, lat: e.target.value })}
                />
                <p className="col-span-2 text-xs text-gray-500 italic flex items-center gap-1"><span>💡</span> Tip: You can find these by long-pressing any spot on Google Maps.</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm font-medium text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                Will use your current GPS location
              </div>
            )}
          </div>
  
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl text-lg font-bold hover:bg-indigo-600 hover:-translate-y-0.5 shadow-xl shadow-gray-200 transition-all duration-200 active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none disabled:transform-none mt-4"
          >
            {loading ? "Processing..." : "Post to Neighborhood"}
          </button>
        </form>
      </div>
    </div>
  );
}