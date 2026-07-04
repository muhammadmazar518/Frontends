import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const getLevelColor = (level) => {
  switch (level?.toLowerCase()) {
    case "beginner":     return { bg: "#10b98120", text: "#10b981" };
    case "intermediate": return { bg: "#3b82f620", text: "#3b82f6" };
    case "advanced":     return { bg: "#ef444420", text: "#ef4444" };
    default:             return { bg: "#6b728020", text: "#6b7280" };
  }
};

export default function Courses({ onNavigate }) {
  const navigate = useNavigate();
  const [courses, setCourses]           = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [levelFilter, setLevelFilter]   = useState("All");
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [visible, setVisible]           = useState(5); // pehle 5 dikhao

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get("/courses");
        setCourses(response.data);
        setError(null);
      } catch (err) {
        console.error("Database connection error:", err);
        setError("Cannot connect to the database. Please check the backend server.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter change hone par reset
  useEffect(() => {
    setVisible(5);
    setActiveCourse(null);
  }, [levelFilter]);

  const filtered = levelFilter === "All"
    ? courses
    : courses.filter((c) => c.level?.toLowerCase() === levelFilter.toLowerCase());

  const visibleCourses = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="text-2xl mb-4">⏳</div>
        <p className="text-slate-400 text-sm">Fetching courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 p-6 rounded-xl text-red-400 m-8">
        <strong>⚠️ Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex gap-6">

        {/* ── List Column ── */}
        <div
          className="transition-all duration-300"
          style={{ flex: activeCourse ? "0 0 360px" : 1 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-2xl font-extrabold text-white tracking-tight m-0">
              Courses
              <span className="ml-2 text-sm font-normal text-slate-500">
                ({filtered.length} total)
              </span>
            </h2>
            <div className="flex gap-1.5 bg-[#111322] p-1 rounded-[24px]">
              {["All", "Beginner", "Intermediate", "Advanced"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevelFilter(l)}
                  className="px-3.5 py-1.5 rounded-[20px] text-xs font-semibold border-none cursor-pointer transition-all duration-200"
                  style={{
                    background: levelFilter === l ? "#6366f1" : "transparent",
                    color:      levelFilter === l ? "#fff"    : "#64748b",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Courses List */}
          <div className="flex flex-col gap-3">
            {visibleCourses.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                Is category mein abhi koi course nahi hai.
              </p>
            ) : (
              visibleCourses.map((c) => {
                const lc     = getLevelColor(c.level);
                const active = activeCourse?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveCourse(active ? null : c)}
                    className="border rounded-[14px] p-5 cursor-pointer flex items-center gap-4 transition-all duration-200"
                    style={{
                      background:  active ? "#1e1b4b" : "#0f111a",
                      borderColor: active ? "#6366f1" : "#1e293b",
                    }}
                  >
                    <span className="text-[28px] shrink-0 bg-[#1e293b] p-2 rounded-[10px]">
                      {c.icon || "🎓"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-slate-100 truncate m-0 mb-1.5">
                        {c.title}
                      </p>
                      <div className="flex gap-2.5 text-[11px] font-semibold">
                        <span
                          className="px-2 py-0.5 rounded-xl"
                          style={{ background: lc.bg, color: lc.text }}
                        >
                          {c.level}
                        </span>
                        <span className="text-slate-400">⏱ {c.duration}</span>
                        <span className="text-amber-400">★ {c.rating}</span>
                      </div>
                    </div>
                    <span className="text-xs" style={{ color: active ? "#6366f1" : "#475569" }}>
                      {active ? "▼" : "▶"}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Load More Button ── */}
          {hasMore && (
            <div className="flex flex-col items-center mt-6 gap-2">
              <button
                onClick={() => setVisible((v) => v + 5)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border border-[#6366f1] text-[#6366f1] bg-[#6366f110] hover:bg-[#6366f1] hover:text-white transition-all duration-200 cursor-pointer"
              >
                Load More
              </button>
            </div>
          )}

          {!hasMore && filtered.length > 5 && (
            <p className="text-center text-slate-600 text-xs mt-6">
              ✅ Sare {filtered.length} courses load ho gaye
            </p>
          )}
        </div>

        {/* ── Details Sidebar ── */}
        {activeCourse && (
          <div className="flex-1 bg-[#0f111a] border border-[#1e293b] rounded-2xl p-8 self-start sticky top-[30px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.5)]">
            <button
              onClick={() => setActiveCourse(null)}
              className="float-right bg-[#1e293b] border-none text-slate-400 w-7 h-7 rounded-full text-sm cursor-pointer flex items-center justify-center"
            >
              ✕
            </button>

            <div className="text-5xl mb-4">{activeCourse.icon || "🎓"}</div>

            <span
              className="text-[11px] font-bold px-3 py-1 rounded-xl inline-block mb-4"
              style={{
                background: getLevelColor(activeCourse.level).bg,
                color:      getLevelColor(activeCourse.level).text,
              }}
            >
              {activeCourse.level}
            </span>

            <h2 className="text-2xl font-extrabold text-white m-0 mb-4 leading-snug">
              {activeCourse.title}
            </h2>

            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {activeCourse.description || activeCourse.desc}
            </p>

            <div className="flex gap-6 text-[13px] text-slate-500 mb-8 border-t border-b border-[#1e293b] py-3">
              <span>⏱ <strong>{activeCourse.duration}</strong></span>
              <span>📹 <strong>{activeCourse.lessons || 0} lessons</strong></span>
              <span className="text-amber-400">★ <strong>{activeCourse.rating}</strong></span>
            </div>

            <p className="text-[11px] text-indigo-400 uppercase font-bold tracking-wider mb-3">
              What you will learn
            </p>

            <ul className="pl-5 flex flex-col gap-1.5 mb-8">
              {Array.isArray(activeCourse.topics) ? (
                activeCourse.topics.map((t, i) => (
                  <li key={i} className="text-[13px] text-slate-400">{t}</li>
                ))
              ) : (
                <li className="text-[13px] text-slate-400">Full course curriculum included.</li>
              )}
            </ul>

            <button
              onClick={() =>
                navigate(`/purchase-success?course=${encodeURIComponent(activeCourse.title)}`)
              }
              onMouseEnter={(e) => (e.target.style.background = "#4f46e5")}
              onMouseLeave={(e) => (e.target.style.background = "#6366f1")}
              className="w-full py-3.5 bg-[#6366f1] text-white border-none rounded-xl text-[15px] font-bold cursor-pointer shadow-[0_4px_14px_0_rgba(99,102,241,0.4)]"
            >
              Buy Course — Unlock Pro Features
            </button>
          </div>
        )}
      </div>
    </div>
  );
}