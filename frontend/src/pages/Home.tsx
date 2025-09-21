import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">LinkedUp</h1>
        <div>
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col md:flex-row items-center justify-between px-8 md:px-16">
        {/* Left Content */}
        <div className="max-w-lg text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Welcome to your professional community
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Connect with colleagues, build your career, and discover new
            opportunities — all in one place.
          </p>
          <div className="mt-6 flex justify-center md:justify-start">
            <Link
              to="/login"
              className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
            >
              Join now
            </Link>
          </div>
        </div>

        {/* Right Content: Illustration */}
        <div className="mt-10 md:mt-0">
          <img
            src="https://illustrations.popsy.co/gray/work-from-home.svg"
            alt="community"
            className="w-96 max-w-full"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} LinkedUp, Inc.
      </footer>
    </div>
  );
}
