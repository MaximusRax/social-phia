import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-slate-900">
      {/* Navigation Bar */}
      <header className="w-full bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-extrabold text-2xl text-slate-800 tracking-tight">
              Social-Phia
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/api/auth/signin"
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2 rounded-full hover:bg-indigo-50"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-indigo-700 hover:shadow-md transition-all active:scale-95"
            >
              Join Neighborhood
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-24 md:py-32 bg-white rounded-b-[3rem] shadow-sm relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
          Now active in your area
        </div>

        <h1 className="max-w-4xl text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter leading-[1.1] mb-6">
          Your neighborhood, <br className="hidden sm:block" />
          <span className="text-indigo-600">
            connected like never before.
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
          Need a hand moving a couch? Want to trade home-baked goods for dog
          walking? Social-Phia connects you with trusted neighbors nearby to
          exchange skills, favors, and time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Link
            href="/register"
            className="w-full sm:w-auto bg-indigo-600 text-white text-lg font-bold px-8 py-4 rounded-full hover:bg-indigo-700 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            Find Nearby Requests
          </Link>
          <Link
            href="/about"
            className="w-full sm:w-auto bg-indigo-50 text-indigo-700 text-lg font-bold px-8 py-4 rounded-full hover:bg-indigo-100 transition-all active:scale-95"
          >
            How it works
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-24 bg-[#f8f9fa] relative z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-4rem] pt-[4rem]">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Everything you need to thrive locally
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto font-medium text-lg">
              Our platform is designed specifically for hyper-local
              interactions, ensuring safety, speed, and real community building.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow duration-300 group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                Hyper-Local Radius
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Our geospatial engine connects you strictly with people in your
                immediate vicinity. Help is never more than a few blocks away.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow duration-300 group">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                Skill Exchange
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Offer what you&apos;re good at in exchange for what you need. A
                cashless economy built on mutual neighborhood support.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow duration-300 group">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                Real-Time Chat
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Once a job is accepted, instantly coordinate details through our
                secure, real-time WebSocket messaging system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-center rounded-t-[3rem]">
        <p className="text-slate-400 font-medium">
          © {new Date().getFullYear()} Social-Phia. Built for the community.
        </p>
      </footer>
    </div>
  );
}
