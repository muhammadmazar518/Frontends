import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-dark-950">
      <nav className="flex justify-between items-center px-10 py-4 border-b border-dark-800 backdrop-blur bg-slate-900 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center font-bold">
            V
          </div>
          <span className="font-bold">Voxta</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-5 py-2 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </div>
      </nav>

      <section className="flex-1 flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
          Welcome to{" "}
          <span className="text-cyan-400">
            Voxta
          </span>
        </h1>

        <p className="max-w-2xl text-slate-300 text-lg leading-8 mb-10">
          Learn modern web development, AI, machine learning and
          real-world skills with structured courses. Build your
          future with confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 rounded-full border border-slate-500 text-white hover:bg-slate-800 transition"
          >
            Sign In
          </button>
        </div>

        <p className="text-slate-400 text-sm mt-6">
          Free & Pro courses available • Learn at your own pace
        </p>
      </section>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 md:px-12 py-5 bg-black border-t border-slate-800">

        <p className="text-slate-400 text-sm">
          © 2026 Voxta. All rights reserved.
        </p>

        <div className="flex gap-6">
          <button
            onClick={() => navigate("/contact")}
            className="text-slate-300 hover:text-cyan-400 transition"
          >
            Contact
          </button>

          <button className="text-slate-300 hover:text-cyan-400 transition">
            Privacy Policy
          </button>

          <button className="text-slate-300 hover:text-cyan-400 transition">
            GitHub
          </button>
        </div>
      </footer>

    </div>
  );
};

export default Landing;