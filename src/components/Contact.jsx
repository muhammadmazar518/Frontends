import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendContactMessage } from "../api";

const infoItems = [
  { icon: "📧", label: "EMAIL", title: "hello@Voxtastack.dev", sub: "We reply within 24 hours" },
  { icon: "💬", label: "LIVE CHAT", title: "Available on dashboard", sub: "Mon-Fri, 9am-6pm" },
  { icon: "📍", label: "LOCATION", title: "Remote First", sub: "Serving worldwide" },
  { icon: "🚀", label: "RESPONSE TIME", title: "Within 24 Hours", sub: "We read every message" },
];

const Contact = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await sendContactMessage(form);
      setSuccess("Successfully sent your message.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div>
      <nav className="flex justify-between items-center px-10 py-4 border-b border-dark-800 backdrop-blur bg-slate-900 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center font-bold">
            V
          </div>
          <span className="font-bold">Voxta</span>
        </div>
        <div className="flex gap-8 text-gray-400">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button className="text-primary-400">Contact</button>
        </div>
      </nav>
</div>
      <div className="text-center py-20 relative">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-full text-sm mb-6">
          💬 Get in Touch
        </span>

        <h1 className="text-6xl font-black mb-4">
          Let's <span className="text-cyan-400">Talk</span>
        </h1>

        <p className="text-gray-400 max-w-md mx-auto">
          Have a question, idea, or just want to say hello?
        </p>
      </div>

      
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 px-6 pb-20">

    
        <div>
          <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
               <p>
                        Fill out the form or reach us through any of the channels below.
                        We typically respond within 24 hours.
                    </p>
          <div className="space-y-4 mt-6">
            {infoItems.map((item) => (
              <div key={item.label} className="glass-card flex gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-dark-800 rounded-lg">
                  {item.icon}
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase">{item.label}</p>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-gray-500 text-sm">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      
        <div className="glass-card bg-slate-900 p-8">

          <h2 className="text-xl font-bold mb-1">Send us a Message</h2>
          <p className="text-gray-500 mb-6">We read every message carefully.</p>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/30 border border-green-700 text-green-300 p-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="input-field"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="input-field"
              />
            </div>

            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="input-field"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Message"
              rows="6"
              className="input-field"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      <footer className="border-t border-dark-800 py-6 px-10 flex justify-between text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center font-bold">
            V
          </div>
          Voxta
        </div>

        <p>© 2026 Voxta.All rights reserved.</p>

        <div className="flex gap-6">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/dashboard")}></button>
        </div>
      </footer>

    </div>
  );
};

export default Contact;