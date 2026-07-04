import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notVerified, setNotVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotVerified(false);
    setResendMsg("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Login Failed";
      setError(msg);

      if (err.response?.data?.emailNotVerified) {
        setNotVerified(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg("");
    try {
      await axios.post(
        "http://localhost:5000/api/auth/resend-verification",
        { email }
      );
      setResendMsg("✅ Verification email bhej diya! Inbox check karein.");
    } catch (err) {
      setResendMsg(
        "❌ " + (err.response?.data?.message || "Resend fail ho gaya.")
      );
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Welcome Back
        </h2>

        <p className="text-center text-gray-400 mb-6">Login to your account</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
            {error}

            {notVerified && (
              <div className="mt-3 pt-3 border-t border-red-500/20">
                <p className="text-gray-400 text-xs mb-2">
                  Email verify nahi ki? Dobara link mangwayein:
                </p>
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-green-400 hover:text-green-300 font-semibold text-xs disabled:opacity-50"
                >
                  {resendLoading
                    ? "Bhej raha hai..."
                    : "Verification Email Dobara Bhejein →"}
                </button>
                {resendMsg && (
                  <p
                    className={`text-xs mt-2 ${
                      resendMsg.startsWith("✅")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {resendMsg}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end text-sm">
            <a href="#" className="text-blue-500 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Login ho raha hai..." : "Login"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-600"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-600"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            className="w-5 h-5"
            alt="Google"
          />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{" "}
          <a href="/signup" className="text-green-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}