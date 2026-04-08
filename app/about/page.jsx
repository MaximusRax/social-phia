import Image from "next/image";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#F1FAEE] flex flex-col font-sans text-[#1D3557]">
      <header className="w-full bg-white/80 backdrop-blur-xl border-b border-[#A8DADC]/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icon.png"
              alt="Social-Phia Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="font-black text-2xl tracking-tighter drop-shadow-sm">
              <span className="text-[#1D3557]">Social</span>
              <span className="text-[#E07A5F]">-Phia</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#3D405B] hover:text-[#457B9D] transition-colors px-3 py-2 rounded-full hover:bg-[#A8DADC]/30"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-[#457B9D] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#1D3557] hover:shadow-md transition-all active:scale-95"
            >
              Join Neighborhood
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white rounded-b-[3rem] shadow-sm relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1D3557] tracking-tight mb-6">
            How Social-Phia Works
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-[#3D405B] font-medium leading-relaxed">
            We believe that neighborhoods are stronger when people help each other.
            Our platform uses secure geospatial technology to connect you exclusively
            with the people who live right around the corner.
          </p>
        </section>

        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-0">
          <div className="space-y-16">

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 flex justify-center md:justify-end">
                <div className="w-48 h-48 bg-[#A8DADC]/30 rounded-full flex items-center justify-center border-8 border-white shadow-xl shadow-[#A8DADC]/40">
                  <svg className="w-20 h-20 text-[#457B9D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
              </div>
              <div className="md:w-1/2 text-center md:text-left">
                <span className="inline-block px-4 py-1.5 bg-[#457B9D]/10 text-[#457B9D] rounded-full text-xs font-extrabold tracking-widest uppercase mb-4">Step 01</span>
                <h3 className="text-3xl font-extrabold text-[#1D3557] mb-3 tracking-tight">Join Your Grid</h3>
                <p className="text-[#3D405B] font-medium leading-relaxed">
                  Sign up and allow basic location access. Social-Phia anchors your account to your current coordinates, ensuring you only see requests within a walkable or short driving distance. Your exact address is never public.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="md:w-1/2 flex justify-center md:justify-start">
                <div className="w-48 h-48 bg-[#81B29A]/20 rounded-full flex items-center justify-center border-8 border-white shadow-xl shadow-[#81B29A]/30">
                  <svg className="w-20 h-20 text-[#81B29A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </div>
              </div>
              <div className="md:w-1/2 text-center md:text-right">
                <span className="inline-block px-4 py-1.5 bg-[#81B29A]/10 text-[#81B29A] rounded-full text-xs font-extrabold tracking-widest uppercase mb-4">Step 02</span>
                <h3 className="text-3xl font-extrabold text-[#1D3557] mb-3 tracking-tight">Post or Browse Requests</h3>
                <p className="text-[#3D405B] font-medium leading-relaxed">
                  Need a tool? Help moving a box? Post a job to the local board. You can offer cash, a return favor, or simply ask for a good deed. Alternatively, scroll through the board to see who needs your skills today.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 flex justify-center md:justify-end">
                <div className="w-48 h-48 bg-[#E07A5F]/20 rounded-full flex items-center justify-center border-8 border-white shadow-xl shadow-[#E07A5F]/30">
                  <svg className="w-20 h-20 text-[#E07A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03-8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                </div>
              </div>
              <div className="md:w-1/2 text-center md:text-left">
                <span className="inline-block px-4 py-1.5 bg-[#E07A5F]/10 text-[#E07A5F] rounded-full text-xs font-extrabold tracking-widest uppercase mb-4">Step 03</span>
                <h3 className="text-3xl font-extrabold text-[#1D3557] mb-3 tracking-tight">Connect & Complete</h3>
                <p className="text-[#3D405B] font-medium leading-relaxed">
                  Once a neighbor accepts your request, our platform opens a secure, real-time chat room. Coordinate the final details safely without giving out your personal phone number until you are ready.
                </p>
              </div>
            </div>

          </div>
        </section>

        <section className="bg-[#1D3557] rounded-[3rem] shadow-xl shadow-[#3D405B]/10 mx-4 sm:mx-6 lg:mx-8 mb-12 py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Built on Trust</h2>
            <p className="text-[#F1FAEE]/80 text-lg mb-8 leading-relaxed font-medium">
              We take community safety seriously. Only authenticated users can view the neighborhood board, and jobs are automatically hidden once accepted to prevent overlaps.
            </p>
            <Link
              href="/register"
              className="inline-block bg-[#E07A5F] text-white text-lg font-bold px-8 py-4 rounded-full hover:bg-[#F2CC8F] hover:text-[#1D3557] hover:shadow-lg transition-all active:scale-95"
            >
              Start Connecting Locally
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#1D3557] py-12 text-center rounded-t-[3rem]">
        <p className="text-[#F1FAEE]/70 font-medium">
          © {new Date().getFullYear()} Social-Phia. Built for the community.
        </p>
      </footer>
    </div>
  );
}