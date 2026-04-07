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
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", description: "", range: 5, reward: "" });
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
      } else if (activeTab === "suggestions") {
        fetchSuggestions();
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
    // Prevent calling the nearby endpoint if we don't have coordinates yet
    if (!location) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("lat", location.lat);
      queryParams.append("lng", location.lng);
      queryParams.append("radius", radius);
      
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

  const fetchSuggestions = async () => {
    if (!location) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("lat", location.lat);
      queryParams.append("lng", location.lng);
      queryParams.append("radius", radius);

      const res = await fetch(`/api/jobs/suggestions?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.matches || []);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
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
        payload.coordinates = [location.lng, location.lat];
      }

      const res = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewJob({ title: "", description: "", range: 5, reward: "" });
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
      <div className="min-h-screen flex items-center justify-center bg-[#F1FAEE]">
        <div className="animate-spin w-14 h-14 border-4 border-[#A8DADC] border-t-[#457B9D] rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1FAEE] font-sans text-[#1D3557] pb-12">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-40 shadow-sm border-b border-[#A8DADC]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#457B9D] rounded-xl flex items-center justify-center shadow-md shadow-[#457B9D]/30">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-extrabold text-2xl text-[#1D3557] tracking-tight">Social-Phia</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="text-sm font-bold text-[#1D3557] hidden sm:block bg-[#A8DADC]/30 hover:bg-[#A8DADC]/50 px-4 py-2 rounded-full transition-colors cursor-pointer">
              Hello, {session.user?.name || "Neighbor"}
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-[#3D405B] hover:text-[#E63946] hover:bg-[#E63946]/10 px-4 py-2 rounded-full transition-colors font-bold"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <h1 className="text-4xl font-extrabold text-[#1D3557] tracking-tight">Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#457B9D] text-white px-6 py-3 rounded-full hover:bg-[#1D3557] transition-all font-bold shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
            >
              <span>+</span> Post Request
            </button>
            <button
              onClick={() => setIsNewsModalOpen(true)}
              className="bg-[#81B29A]/20 text-[#1D3557] px-6 py-3 rounded-full hover:bg-[#81B29A]/40 transition-all font-bold active:scale-95 flex items-center gap-2"
            >
              <span>+</span> Share News
            </button>
          </div>
        </div>

        {/* Location & Filtering Panel */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm mb-8 flex flex-wrap items-end gap-5 border border-[#A8DADC]/50">
          <div>
            <label className="block text-xs font-extrabold text-[#3D405B]/70 uppercase tracking-wider mb-2 pl-1">Location Setup</label>
            <button onClick={handleAutoLocation} className="bg-[#457B9D]/10 text-[#1D3557] px-5 py-3 rounded-2xl text-sm font-bold hover:bg-[#457B9D]/20 transition-colors">
              Auto Detect 📍
            </button>
          </div>
          <div className="flex gap-2">
            <div>
              <label className="block text-xs font-extrabold text-[#3D405B]/70 uppercase tracking-wider mb-2 pl-1">Latitude</label>
              <input type="number" step="any" value={locationInput.lat} onChange={e => setLocationInput({...locationInput, lat: e.target.value})} className="bg-[#F4F1DE] border-none rounded-2xl p-3 w-28 text-sm font-medium focus:ring-2 focus:ring-[#457B9D] outline-none" placeholder="e.g. 40.71" />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#3D405B]/70 uppercase tracking-wider mb-2 pl-1">Longitude</label>
              <input type="number" step="any" value={locationInput.lng} onChange={e => setLocationInput({...locationInput, lng: e.target.value})} className="bg-[#F4F1DE] border-none rounded-2xl p-3 w-28 text-sm font-medium focus:ring-2 focus:ring-[#457B9D] outline-none" placeholder="e.g. -74.00" />
            </div>
            <button onClick={handleManualLocation} className="bg-[#A8DADC]/30 text-[#1D3557] px-5 py-3 rounded-2xl text-sm font-bold hover:bg-[#A8DADC]/50 self-end transition-colors">
              Set Manual
            </button>
          </div>
          <div>
            <label className="block text-xs font-extrabold text-[#3D405B]/70 uppercase tracking-wider mb-2 pl-1">Search Radius</label>
            <select value={radius} onChange={e => setRadius(Number(e.target.value))} className="bg-[#F4F1DE] border-none rounded-2xl p-3 text-sm font-bold focus:ring-2 focus:ring-[#457B9D] outline-none min-w-[120px] cursor-pointer">
              {[1, 2, 4, 5, 10].map(r => <option key={r} value={r}>{r} km</option>)}
            </select>
          </div>
          {location && (
            <div className="ml-auto flex items-center text-sm text-[#81B29A] font-bold bg-[#81B29A]/10 px-4 py-2 rounded-full">
              ✓ Active Location Filter
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 bg-[#A8DADC]/30 p-1.5 rounded-full mb-10 max-w-4xl overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab("board")}
            className={`flex-1 min-w-max px-6 py-3 text-sm font-bold rounded-full transition-all ${
              activeTab === "board"
                ? "bg-white text-[#1D3557] shadow-sm"
                : "text-[#3D405B] hover:text-[#1D3557] hover:bg-[#A8DADC]/40"
            }`}
          >
            Neighborhood Board
          </button>
          <button
            onClick={() => setActiveTab("my-tasks")}
            className={`flex-1 min-w-max px-6 py-3 text-sm font-bold rounded-full transition-all ${
              activeTab === "my-tasks"
                ? "bg-white text-[#1D3557] shadow-sm"
                : "text-[#3D405B] hover:text-[#1D3557] hover:bg-[#A8DADC]/40"
            }`}
          >
            My Active Tasks
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`flex-1 min-w-max px-6 py-3 text-sm font-bold rounded-full transition-all ${
              activeTab === "news"
                ? "bg-white text-[#81B29A] shadow-sm"
                : "text-[#3D405B] hover:text-[#1D3557] hover:bg-[#A8DADC]/40"
            }`}
          >
            Neighborhood News
          </button>
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`flex-1 min-w-max px-6 py-3 text-sm font-bold rounded-full transition-all flex items-center justify-center gap-1 ${
              activeTab === "suggestions"
                ? "bg-white text-[#E07A5F] shadow-sm"
                : "text-[#3D405B] hover:text-[#1D3557] hover:bg-[#A8DADC]/40"
            }`}
          >
            <span>Suggestions</span> <span>✨</span>
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin w-12 h-12 border-4 border-[#A8DADC] border-t-[#457B9D] rounded-full"></div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {activeTab === "board" ? (
              jobs.length > 0 ? (
                jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all flex flex-col border border-[#A8DADC]/50"
                  >
                    <div className="flex-1">
                      <span className="inline-block px-4 py-1.5 bg-[#81B29A]/20 text-[#1D3557] text-xs font-extrabold uppercase tracking-wider rounded-full mb-4">
                        Open
                      </span>
                      <h3 className="text-2xl font-bold text-[#1D3557] mb-3 tracking-tight leading-snug">{job.title}</h3>
                      {job.reward && (
                        <p className="text-sm font-bold text-[#1D3557] bg-[#F2CC8F]/40 px-3 py-2 rounded-xl mb-4 inline-block">
                          🎁 Return: <span className="font-medium">{job.reward}</span>
                        </p>
                      )}
                      <p className="text-[#3D405B] text-[15px] leading-relaxed line-clamp-3 mb-5">{job.description}</p>
                      <p className="text-xs font-bold text-[#3D405B]/70 mb-6">
                        POSTED BY {String(job.postedBy?.name || "NEIGHBOR").toUpperCase()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAcceptJob(job._id)}
                      className="w-full bg-[#457B9D] text-white font-bold py-3.5 rounded-full hover:bg-[#1D3557] transition-all active:scale-95 shadow-sm"
                    >
                      Accept & Help
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white border border-[#A8DADC]/50 rounded-[2.5rem] shadow-sm">
                  <div className="text-4xl mb-4">🏘️</div>
                  <h3 className="text-xl font-extrabold text-[#1D3557] mb-2">It's quiet around here</h3>
                  <p className="text-[#3D405B]/70 max-w-sm mx-auto font-medium">
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
                    className="bg-white p-6 rounded-[2rem] border border-[#A8DADC]/50 shadow-sm hover:shadow-xl transition-all flex flex-col relative overflow-hidden"
                  >
                    {job.status === "in-progress" && (
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#81B29A]"></div>
                    )}
                    
                    <div className="flex-1 mt-2">
                      <div className="flex justify-between items-start mb-3">
                        <span
                          className={`px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-full ${
                            job.status === "open"
                              ? "bg-[#F2CC8F] text-[#1D3557]"
                              : job.status === "in-progress"
                              ? "bg-[#81B29A]/20 text-[#1D3557]"
                              : "bg-[#F4F1DE] text-[#3D405B]"
                          }`}
                        >
                          {job.status}
                        </span>
                        <span className="text-xs font-bold text-[#3D405B] bg-[#F4F1DE] px-3 py-1.5 rounded-full">
                          {isPoster ? "Your Request" : "Helping Out"}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-[#1D3557] mb-3 tracking-tight">{job.title}</h3>
                      {job.reward && (
                        <p className="text-sm font-bold text-[#1D3557] bg-[#F2CC8F]/40 px-3 py-2 rounded-xl mb-4 inline-block">
                          🎁 Return: <span className="font-medium">{job.reward}</span>
                        </p>
                      )}
                      <p className="text-[#3D405B] text-[15px] leading-relaxed line-clamp-2 mb-4">{job.description}</p>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      {job.status === "in-progress" ? (
                        <Link
                          href={`/chat/${job._id}`}
                          className="w-full text-center bg-[#457B9D] text-white font-bold py-3.5 rounded-full hover:bg-[#1D3557] transition-all active:scale-95 shadow-sm"
                        >
                          Open Live Chat
                        </Link>
                      ) : job.status === "open" ? (
                        <Link
                          href={`/chat/${job._id}`}
                          className="w-full text-center bg-[#F4F1DE] text-[#3D405B] font-bold py-3.5 rounded-full hover:bg-[#A8DADC]/40 transition-all"
                        >
                          Waiting for a helper...
                        </Link>
                      ) : null}

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
                          className="w-full text-center text-sm font-bold text-[#E63946] py-2.5 hover:bg-[#E63946]/10 rounded-full transition-colors mt-2"
                        >
                          {job.status === "in-progress" ? "Cancel Helper & Reopen" : "Reopen Request"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
              ) : (
                <div className="col-span-full py-20 text-center bg-white border border-[#A8DADC]/50 rounded-[2.5rem] shadow-sm">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-xl font-extrabold text-[#1D3557] mb-2">No active tasks</h3>
                  <p className="text-[#3D405B]/70 max-w-sm mx-auto font-medium">
                    You haven't posted any requests or accepted any jobs recently.
                  </p>
                </div>
              )
            ) : activeTab === "news" ? (
              news.length > 0 ? (
                news.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white p-6 rounded-[2rem] border border-[#A8DADC]/50 shadow-sm hover:shadow-xl transition-all flex flex-col"
                  >
                    {post.image && (
                      <img src={post.image} alt="News upload" className="w-full h-52 object-cover rounded-2xl mb-5" />
                    )}
                    <span className="inline-block px-4 py-1.5 bg-[#81B29A]/20 text-[#1D3557] text-xs font-extrabold uppercase tracking-wider rounded-full mb-4 w-max">
                      {post.type}
                    </span>
                    <p className="text-[#1D3557] font-medium text-lg mb-6 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                    <p className="text-xs font-bold text-[#3D405B]/70 mt-auto pt-5 border-t border-[#A8DADC]/30 uppercase tracking-wide">
                      POSTED BY {post.author?.name || "NEIGHBOR"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white border border-[#A8DADC]/50 rounded-[2.5rem] shadow-sm">
                  <div className="text-4xl mb-4">📰</div>
                  <h3 className="text-xl font-extrabold text-[#1D3557] mb-2">No news yet</h3>
                  <p className="text-[#3D405B]/70 max-w-sm mx-auto font-medium">
                    There are no news posts in your neighborhood right now. Be the first to share!
                  </p>
                </div>
              )
            ) : activeTab === "suggestions" ? (
              suggestions.length > 0 ? (
                suggestions.map((match) => (
                  <div key={match.id} className="bg-gradient-to-br from-[#A8DADC]/20 to-[#F2CC8F]/20 p-6 rounded-[2rem] border border-[#A8DADC]/50 shadow-sm hover:shadow-xl transition-all flex flex-col">
                    <span className="inline-block px-4 py-1.5 bg-[#457B9D]/20 text-[#1D3557] text-xs font-extrabold uppercase tracking-wider rounded-full mb-4 w-max">
                      Match Found ✨
                    </span>
                    <p className="text-[15px] font-bold text-[#E07A5F] mb-5 leading-relaxed">{match.reason}</p>
                    
                    <div className="bg-white p-4 rounded-2xl mb-3 border border-white shadow-sm text-sm">
                      <p className="text-xs font-bold text-[#3D405B]/70 mb-1 uppercase tracking-wide">Your Request</p>
                      <p className="font-bold text-[#1D3557]">{match.myJob.title}</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl mb-6 border border-white shadow-sm text-sm">
                      <p className="text-xs font-bold text-[#3D405B]/70 mb-1 uppercase tracking-wide">Their Request</p>
                      <p className="font-bold text-[#1D3557]">{match.theirJob.title}</p>
                      {match.theirJob.reward && (
                        <p className="text-[#1D3557] font-bold text-xs mt-2 bg-[#F2CC8F]/40 px-2 py-1 rounded inline-block">🎁 Return: {match.theirJob.reward}</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleAcceptJob(match.theirJob._id)}
                      className="w-full mt-auto bg-[#457B9D] text-white font-bold py-3.5 rounded-full hover:bg-[#1D3557] transition-all shadow-sm active:scale-95"
                    >
                      Accept & Connect
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white border border-[#A8DADC]/50 rounded-[2.5rem] shadow-sm">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-extrabold text-[#1D3557] mb-2">No matches right now</h3>
                  <p className="text-[#3D405B]/70 max-w-sm mx-auto font-medium">
                    We couldn't find any direct matches between what you're offering and what your neighbors need (or vice versa).
                  </p>
                </div>
              )
            ) : null}
            
          </div>
        )}
      </main>

      {/* Create Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D3557]/40 backdrop-blur-sm font-sans">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-3xl font-extrabold text-[#1D3557] mb-6 tracking-tight">Post a Request</h2>
            <form onSubmit={handleCreateJob} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#3D405B] mb-2 pl-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#F4F1DE] border-none rounded-2xl p-4 text-[#1D3557] font-medium focus:bg-white focus:ring-2 focus:ring-[#457B9D] transition-all outline-none"
                  placeholder="e.g. Need help moving a couch"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-[#3D405B] mb-2 pl-2">
                    Range (km)
                  </label>
                  <select
                    className="w-full bg-[#F4F1DE] border-none rounded-2xl p-4 text-[#1D3557] font-medium focus:bg-white focus:ring-2 focus:ring-[#457B9D] transition-all outline-none cursor-pointer"
                    value={newJob.range}
                    onChange={(e) => setNewJob({ ...newJob, range: Number(e.target.value) })}
                  >
                    {[1, 2, 4, 5, 10, 20].map((r) => <option key={r} value={r}>{r} km</option>)}
                  </select>
                </div>
                <div className="flex-[2]">
                  <label className="block text-sm font-bold text-[#3D405B] mb-2 pl-2">
                    What will you give in return?
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#F4F1DE] border-none rounded-2xl p-4 text-[#1D3557] font-medium focus:bg-white focus:ring-2 focus:ring-[#457B9D] transition-all outline-none"
                    placeholder="e.g. $10, a cup of coffee..."
                    value={newJob.reward}
                    onChange={(e) => setNewJob({ ...newJob, reward: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#3D405B] mb-2 pl-2">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-[#F4F1DE] border-none rounded-2xl p-4 text-[#1D3557] font-medium focus:bg-white focus:ring-2 focus:ring-[#457B9D] transition-all outline-none resize-none"
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
                  className="flex-1 bg-[#F4F1DE] text-[#3D405B] font-bold py-3.5 rounded-full hover:bg-[#A8DADC]/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#457B9D] text-white font-bold py-3.5 rounded-full hover:bg-[#1D3557] transition-all active:scale-95 disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D3557]/40 backdrop-blur-sm font-sans">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-3xl font-extrabold text-[#1D3557] mb-6 tracking-tight">Share News</h2>
            <form onSubmit={handleCreateNews} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#3D405B] mb-2 pl-2">
                  Type
                </label>
                <select
                  className="w-full bg-[#F4F1DE] border-none rounded-2xl p-4 text-[#1D3557] font-medium focus:bg-white focus:ring-2 focus:ring-[#81B29A] transition-all outline-none cursor-pointer"
                  value={newNews.type}
                  onChange={(e) => setNewNews({ ...newNews, type: e.target.value })}
                >
                  <option value="news">General News</option>
                  <option value="alert">Safety Alert</option>
                  <option value="event">Local Event</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#3D405B] mb-2 pl-2">
                  What's happening?
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-[#F4F1DE] border-none rounded-2xl p-4 text-[#1D3557] font-medium focus:bg-white focus:ring-2 focus:ring-[#81B29A] transition-all outline-none resize-none"
                  placeholder="Share updates, events, or alerts..."
                  value={newNews.content}
                  onChange={(e) =>
                    setNewNews({ ...newNews, content: e.target.value })
                  }
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#3D405B] mb-2 pl-2">
                  Upload Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-[#3D405B]/70 file:mr-4 file:py-3 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#81B29A]/20 file:text-[#1D3557] hover:file:bg-[#81B29A]/40 transition-colors cursor-pointer"
                />
              </div>
              
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="flex-1 bg-[#F4F1DE] text-[#3D405B] font-bold py-3.5 rounded-full hover:bg-[#A8DADC]/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#81B29A] text-white font-bold py-3.5 rounded-full hover:bg-[#1D3557] transition-all active:scale-95 disabled:opacity-50"
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