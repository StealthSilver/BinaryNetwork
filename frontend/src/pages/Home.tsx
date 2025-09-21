import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE] to-white flex flex-col">
      <nav className="flex justify-between items-center px-8 py-4 bg-[#1E3A8A] rounded-b-2xl shadow-md mx-auto w-full max-w-6xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Binary Netwrok
        </h1>
        <div>
          <Link
            to="/login"
            className="text-[#93C5FD] font-semibold px-4 py-2 rounded hover:bg-[#2563EB] hover:text-white transition"
          >
            Sign in
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-16 gap-16">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-5xl md:text-6xl font-extrabold text-[#1E3A8A] leading-tight drop-shadow-lg">
              Welcome to your{" "}
              <span className="text-[#2563EB]">professional community</span>
            </h2>
            <p className="mt-6 text-[#334155] text-lg md:text-xl font-light">
              Connect with colleagues, build your career, and discover new
              opportunities — all in one place.
            </p>
            <div className="mt-8 flex justify-center md:justify-start">
              <Link
                to="/login"
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8] text-white font-semibold shadow-lg hover:scale-105 transition-all duration-150"
              >
                Join now
              </Link>
            </div>
          </div>

          <div className="w-full max-w-lg flex justify-center">
            <img
              src="https://illustrations.popsy.co/gray/work-from-home.svg"
              alt="community"
              className="w-full max-w-2xl h-auto rounded-2xl shadow-2xl bg-white p-4"
            />
          </div>
        </div>
      </main>

      <footer className="bg-[#1E3A8A] rounded-t-2xl py-4 text-center text-white text-base tracking-wide shadow-inner mx-auto w-full max-w-6xl">
        © {new Date().getFullYear()} LinkedUp, Inc.
      </footer>
    </div>
  );
}
