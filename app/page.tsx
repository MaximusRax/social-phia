import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Bar */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              Social-Phia
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/api/auth/signin"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Join Neighborhood
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
          Now active in your area
        </div>

        <h1 className="max-w-4xl text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          Your neighborhood, <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            connected like never before.
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
          Need a hand moving a couch? Want to trade home-baked goods for dog
          walking? Social-Phia connects you with trusted neighbors nearby to
          exchange skills, favors, and time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto bg-slate-900 text-white text-lg font-medium px-8 py-4 rounded-full hover:bg-slate-800 transition-transform hover:scale-105 shadow-lg"
          >
            Find Nearby Requests
          </Link>
          <Link
            href="/about"
            className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 text-lg font-medium px-8 py-4 rounded-full hover:bg-slate-50 transition-colors"
          >
            How it works
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything you need to thrive locally
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our platform is designed specifically for hyper-local
              interactions, ensuring safety, speed, and real community building.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Hyper-Local Radius
              </h3>
              <p className="text-slate-600">
                Our geospatial engine connects you strictly with people in your
                immediate vicinity. Help is never more than a few blocks away.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Skill Exchange
              </h3>
              <p className="text-slate-600">
                Offer what you&apos;re good at in exchange for what you need. A
                cashless economy built on mutual neighborhood support.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Real-Time Chat
              </h3>
              <p className="text-slate-600">
                Once a job is accepted, instantly coordinate details through our
                secure, real-time WebSocket messaging system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800 text-center">
        <p className="text-slate-400 font-medium">
          © {new Date().getFullYear()} Social-Phia. Built for the community.
        </p>
      </footer>
    </div>
  );
}
