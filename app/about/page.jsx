import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">Social-Phia</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Join
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            How Social-Phia Works
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
            We believe that neighborhoods are stronger when people help each other.
            Our platform uses secure geospatial technology to connect you exclusively
            with the people who live right around the corner.
          </p>
        </section>

        {/* The Steps (Timeline Layout) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="space-y-16">

            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 flex justify-center md:justify-end">
                <div className="w-48 h-48 bg-blue-50 rounded-full flex items-center justify-center border-8 border-white shadow-lg">
                  <svg className="w-20 h-20 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
              </div>
              <div className="md:w-1/2 text-center md:text-left">
                <span className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-2 block">Step 01</span>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Join Your Grid</h3>
                <p className="text-slate-600 leading-relaxed">
                  Sign up and allow basic location access. Social-Phia anchors your account to your current coordinates, ensuring you only see requests within a walkable or short driving distance. Your exact address is never public.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="md:w-1/2 flex justify-center md:justify-start">
                <div className="w-48 h-48 bg-green-50 rounded-full flex items-center justify-center border-8 border-white shadow-lg">
                  <svg className="w-20 h-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </div>
              </div>
              <div className="md:w-1/2 text-center md:text-right">
                <span className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-2 block">Step 02</span>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Post or Browse Requests</h3>
                <p className="text-slate-600 leading-relaxed">
                  Need a tool? Help moving a box? Post a job to the local board. You can offer cash, a return favor, or simply ask for a good deed. Alternatively, scroll through the board to see who needs your skills today.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 flex justify-center md:justify-end">
                <div className="w-48 h-48 bg-purple-50 rounded-full flex items-center justify-center border-8 border-white shadow-lg">
                  <svg className="w-20 h-20 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                </div>
              </div>
              <div className="md:w-1/2 text-center md:text-left">
                <span className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-2 block">Step 03</span>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Connect & Complete</h3>
                <p className="text-slate-600 leading-relaxed">
                  Once a neighbor accepts your request, our platform opens a secure, real-time chat room. Coordinate the final details safely without giving out your personal phone number until you are ready.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Trust & Safety Section */}
        <section className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Built on Trust</h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              We take community safety seriously. Only authenticated users can view the neighborhood board, and jobs are automatically hidden once accepted to prevent overlaps.
            </p>
            <Link
              href="/register"
              className="inline-block bg-indigo-500 text-white text-lg font-medium px-8 py-4 rounded-full hover:bg-indigo-400 transition-colors"
            >
              Start Connecting Locally
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 py-8 text-center">
        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Social-Phia. Built for the community.</p>
      </footer>
    </div>
  );
}