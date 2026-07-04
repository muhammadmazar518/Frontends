import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });
      setEmailSent(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg("");
    try {
      await axios.post("http://localhost:5000/api/auth/resend-verification", {
        email,
      });
      setResendMsg("✅ Verification email resent! Please check your inbox.");
    } catch (err) {
      setResendMsg(
        "❌ " + (err.response?.data?.message || "Failed to resend email.")
      );
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📬</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Check Your Email!
          </h2>
          <p className="text-gray-400 mb-2">
            Verification link has been sent to:
          </p>
          <p className="text-green-400 font-semibold mb-6">{email}</p>
          <p className="text-gray-500 text-sm mb-8">
            Click the link in your email to activate your account.
            The link will expire in 24 hours.
          </p>
          {resendMsg && (
            <p className={`text-sm mb-4 ${resendMsg.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>
              {resendMsg}
            </p>
          )}
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="w-full border border-gray-600 text-gray-300 py-3 rounded-xl hover:bg-slate-800 transition disabled:opacity-50 mb-4"
          >
            {resendLoading ? "Sending..." : "Resend Verification Email"}
          </button>
          <a href="/login" className="block text-center text-sm text-green-500 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Sign up to get started
        </p>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-600"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-600"></div>
        </div>
        <button
          onClick={handleGoogleSignup}
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
          Already have an account?{" "}
          <a href="/login" className="text-green-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}