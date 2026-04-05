"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("board"); // 'board', 'my-tasks', or 'news'
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", description: "" });
  const [newNews, setNewNews] = useState({ content: "", type: "news", image: "" });
  const [submitting, setSubmitting] = useState(false);
  
  const [location, setLocation] = useState(null); // {lat, lng}
  const [radius, setRadius] = useState(5); // Default 5 km
  const [locationInput, setLocationInput] = useState({ lat: "", lng: "" });

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch data depending on active tab
  useEffect(() => {
    if (status === "authenticated") {
      if (activeTab === "board") {
        fetchBoardJobs();
      } else if (activeTab === "my-tasks") {
        fetchMyJobs();
      } else if (activeTab === "news") {
        fetchNews();
      }
    }
  }, [activeTab, status, location, radius]);

  const handleAutoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(coords);
          setLocationInput(coords);
        },
        (err) => alert("Failed to get location automatically. Please allow location access or enter manually.")
      );
    }
  };

  // Auto-detect location on initial load
  useEffect(() => {
    if (status === "authenticated" && !location) {
      handleAutoLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleManualLocation = () => {
    if (locationInput.lat && locationInput.lng) {
      setLocation({ lat: parseFloat(locationInput.lat), lng: parseFloat(locationInput.lng) });
    }
  };

  const fetchBoardJobs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (location) {
        queryParams.append("lat", location.lat);
        queryParams.append("lng", location.lng);
        queryParams.append("radius", radius);
      }
      
      const res = await fetch(`/api/jobs/nearby?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const openJobs = (data.jobs || []).filter((job) => {
          const posterId = job.postedBy?._id || job.postedBy;
          return job.status === "open" && posterId !== session?.user?.id;
        });
        setJobs(openJobs);
      }
    } catch (error) {
      console.error("Error fetching board jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs/my-active");
      if (res.ok) {
        const data = await res.json();
        setMyJobs(data.jobs || []);
      }
    } catch (error) {
      console.error("Error fetching my jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (location) {
        queryParams.append("lat", location.lat);
        queryParams.append("lng", location.lng);
        queryParams.append("radius", radius);
      }

      const res = await fetch(`/api/post?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setNews(data.posts || []);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...newJob };
      if (location) {
        payload.location = { type: "Point", coordinates: [location.lng, location.lat] };
      }

      const res = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewJob({ title: "", description: "" });
        if (activeTab === "my-tasks") {
          fetchMyJobs();
        } else {
          setActiveTab("my-tasks");
        }
      } else {
        alert("Failed to create job.");
      }
    } catch (error) {
      console.error("Create job error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...newNews };
      if (location) {
        payload.location = { type: "Point", coordinates: [location.lng, location.lat] };
      }

      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsNewsModalOpen(false);
        setNewNews({ content: "", type: "news", image: "" });
        if (activeTab === "news") {
          fetchNews();
        } else {
          setActiveTab("news");
        }
      } else {
        alert("Failed to post news.");
      }
    } catch (error) {
      console.error("Create news error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewNews((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAcceptJob = async (jobId) => {
    try {
      const res = await fetch("/api/jobs/accept", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      if (res.ok) {
        // Redirect straight to the chat room after accepting
        router.push(`/chat/${jobId}`);
      } else {
        const err = await res.json();
        alert(`Failed to accept: ${err.message}`);
      }
    } catch (error) {
      console.error("Accept job error:", error);
    }
  };

  const handleReopenJob = async (jobId) => {
    try {
      const res = await fetch("/api/jobs/reopen", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      if (res.ok) {
        fetchMyJobs(); // Refresh the list
      } else {
        const err = await res.json();
        alert(`Failed to reopen: ${err.message}`);
      }
    } catch (error) {
      console.error("Reopen job error:", error);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">Social-Phia</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              Hello, {session.user?.name || "Neighbor"}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors font-medium"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm shadow-indigo-200"
            >
              + Post Request
            </button>
            <button
              onClick={() => setIsNewsModalOpen(true)}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors font-medium shadow-sm shadow-emerald-200"
            >
              + Post News
            </button>
          </div>
        </div>

        {/* Location & Filtering Panel */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-8 flex flex-wrap items-end gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Location Setup</label>
            <button onClick={handleAutoLocation} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition">
              Auto Detect 📍
            </button>
          </div>
          <div className="flex gap-2">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Latitude</label>
              <input type="number" step="any" value={locationInput.lat} onChange={e => setLocationInput({...locationInput, lat: e.target.value})} className="border border-gray-300 rounded-lg p-2 w-28 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 40.71" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Longitude</label>
              <input type="number" step="any" value={locationInput.lng} onChange={e => setLocationInput({...locationInput, lng: e.target.value})} className="border border-gray-300 rounded-lg p-2 w-28 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. -74.00" />
            </div>
            <button onClick={handleManualLocation} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 self-end transition">
              Set Manual
            </button>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Search Radius</label>
            <select value={radius} onChange={e => setRadius(Number(e.target.value))} className="border border-gray-300 rounded-lg p-2 text-sm bg-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none min-w-[100px]">
              {[1, 2, 4, 5, 10].map(r => <option key={r} value={r}>{r} km</option>)}
            </select>
          </div>
          {location && (
            <div className="ml-auto flex items-center text-sm text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
              ✓ Active Location Filter
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8 max-w-2xl">
          <button
            onClick={() => setActiveTab("board")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "board"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
            }`}
          >
            Neighborhood Board
          </button>
          <button
            onClick={() => setActiveTab("my-tasks")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "my-tasks"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
            }`}
          >
            My Active Tasks
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "news"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
            }`}
          >
            Neighborhood News
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeTab === "board" ? (
              jobs.length > 0 ? (
                jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-lg mb-3">
                        Open
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">{job.description}</p>
                      <p className="text-xs text-gray-400 mb-4">
                        Posted by {job.postedBy?.name || "a neighbor"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAcceptJob(job._id)}
                      className="w-full bg-gray-900 text-white font-medium py-2.5 rounded-xl hover:bg-indigo-600 transition-colors"
                    >
                      Accept & Help
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center bg-white border border-gray-100 rounded-3xl">
                  <div className="text-4xl mb-4">🏘️</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">It's quiet around here</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    There are no open requests in your neighborhood right now. Be the first to post a request!
                  </p>
                </div>
              )
            ) : activeTab === "my-tasks" ? (
              myJobs.length > 0 ? (
              myJobs.map((job) => {
                const posterId = job.postedBy?._id || job.postedBy;
                const isPoster = posterId === session.user.id;
                
                return (
                  <div
                    key={job._id}
                    className="bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden"
                  >
                    {job.status === "in-progress" && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                    )}
                    
                    <div className="flex-1 mt-2">
                      <div className="flex justify-between items-start mb-3">
                        <span
                          className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg ${
                            job.status === "open"
                              ? "bg-yellow-50 text-yellow-700"
                              : job.status === "in-progress"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {job.status}
                        </span>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                          {isPoster ? "Your Request" : "Helping Out"}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{job.description}</p>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      {job.status === "in-progress" ? (
                        <Link
                          href={`/chat/${job._id}`}
                          className="w-full text-center bg-indigo-600 text-white font-medium py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                          Open Live Chat
                        </Link>
                      ) : job.status === "open" ? (
                        <Link
                          href={`/chat/${job._id}`}
                          className="w-full text-center bg-gray-100 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          Waiting for a helper...
                        </Link>
                      ) : null}

                      {/* Only poster can reopen a closed/completed job or if someone canceled */}
                      {isPoster && job.status !== "open" && (
                        <button
                          onClick={() => {
                            if (job.status === "in-progress") {
                              if (confirm("Are you sure you want to reopen this request? This will cancel the current helper.")) {
                                handleReopenJob(job._id);
                              }
                            } else {
                              handleReopenJob(job._id);
                            }
                          }}
                          className="w-full text-center text-sm font-medium text-red-600 py-2 hover:bg-red-50 rounded-xl transition-colors mt-2"
                        >
                          {job.status === "in-progress" ? "Cancel Helper & Reopen" : "Reopen Request"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
              ) : (
                <div className="col-span-full py-16 text-center bg-white border border-gray-100 rounded-3xl">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No active tasks</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    You haven't posted any requests or accepted any jobs recently.
                  </p>
                </div>
              )
            ) : activeTab === "news" ? (
              news.length > 0 ? (
                news.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col"
                  >
                    {post.image && (
                      <img src={post.image} alt="News upload" className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-100" />
                    )}
                    <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider rounded-lg mb-3 w-max">
                      {post.type}
                    </span>
                    <p className="text-gray-800 font-medium text-lg mb-4 whitespace-pre-wrap">{post.content}</p>
                    <p className="text-xs text-gray-400 mt-auto pt-4 border-t border-gray-50">
                      Posted by {post.author?.name || "a neighbor"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center bg-white border border-gray-100 rounded-3xl">
                  <div className="text-4xl mb-4">📰</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No news yet</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    There are no news posts in your neighborhood right now. Be the first to share!
                  </p>
                </div>
              )
            ) : null}
            
          </div>
        )}
      </main>

      {/* Create Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a Request</h2>
            <form onSubmit={handleCreateJob} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border"
                  placeholder="e.g. Need help moving a couch"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border"
                  placeholder="Describe what you need help with..."
                  value={newJob.description}
                  onChange={(e) =>
                    setNewJob({ ...newJob, description: e.target.value })
                  }
                ></textarea>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 text-white font-medium py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Posting..." : "Post Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create News Modal */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Neighborhood News</h2>
            <form onSubmit={handleCreateNews} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 bg-gray-50 border"
                  value={newNews.type}
                  onChange={(e) => setNewNews({ ...newNews, type: e.target.value })}
                >
                  <option value="news">General News</option>
                  <option value="alert">Safety Alert</option>
                  <option value="event">Local Event</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What's happening?
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 bg-gray-50 border"
                  placeholder="Share updates, events, or alerts..."
                  value={newNews.content}
                  onChange={(e) =>
                    setNewNews({ ...newNews, content: e.target.value })
                  }
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-colors"
                />
              </div>
              
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-emerald-600 text-white font-medium py-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Posting..." : "Share Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}