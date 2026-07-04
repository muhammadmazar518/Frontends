import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const statusColors = {
  "Live": "#22c55e",
  "In Progress": "#f59e0b",
  "Planning": "#6b7280",
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", status: "Planning", icon: "📁" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchProjects = async () => {
    const res = await axios.get(`${API}/projects`, { headers });
    setProjects(res.data);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async () => {
    if (!form.title) return;
    setLoading(true);
    if (editId) {
      await axios.put(`${API}/projects/${editId}`, form, { headers });
      setEditId(null);
    } else {
      await axios.post(`${API}/projects`, form, { headers });
    }
    setForm({ title: "", description: "", status: "Planning", icon: "📁" });
    fetchProjects();
    setLoading(false);
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ title: p.title, description: p.description, status: p.status, icon: p.icon });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await axios.delete(`${API}/projects/${id}`, { headers });
    fetchProjects();
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ title: "", description: "", status: "Planning", icon: "📁" });
  };

  return (
    <div>
      <h1 className="text-white text-[28px] font-extrabold m-0 mb-1">Projects</h1>
      <p className="text-gray-500 text-sm mb-6">Manage your projects</p>

      {/* Form Card */}
      <div className="bg-[#161824] border border-[#1e2130] rounded-2xl p-5 mb-8 flex flex-col gap-3">
        <h3 className="text-white text-[15px] font-bold m-0">
          {editId ? "✏️ Edit Project" : "➕ Add Project"}
        </h3>

        <div className="flex gap-3 flex-wrap">
          <input
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="flex-1 bg-[#0d0f14] border border-[#1e2130] rounded-lg px-3.5 py-2.5 text-white text-sm outline-none"
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="flex-1 bg-[#0d0f14] border border-[#1e2130] rounded-lg px-3.5 py-2.5 text-white text-sm outline-none"
          >
            <option>Planning</option>
            <option>In Progress</option>
            <option>Live</option>
          </select>
          <input
            placeholder="Icon 📁"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="bg-[#0d0f14] border border-[#1e2130] rounded-lg px-3.5 py-2.5 text-white text-sm outline-none max-w-[80px]"
          />
        </div>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="bg-[#0d0f14] border border-[#1e2130] rounded-lg px-3.5 py-2.5 text-white text-sm outline-none resize-y min-h-[80px]"
        />

        <div className="flex gap-2.5">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-violet-600 border-none rounded-lg px-6 py-2.5 text-white text-sm font-bold cursor-pointer disabled:opacity-60"
          >
            {loading ? "Saving..." : editId ? "✓ Update" : "+ Add"}
          </button>
          {editId && (
            <button
              onClick={handleCancel}
              className="bg-transparent border border-gray-700 rounded-lg px-5 py-2.5 text-gray-400 text-sm cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects yet. Add one above!</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          {projects.map((p) => {
            const color = statusColors[p.status] || "#6b7280";
            return (
              <div
                key={p.id}
                className="bg-[#161824] border border-[#1e2130] rounded-2xl p-6 flex flex-col gap-2.5"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[32px]">{p.icon}</span>
                  <span
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-[20px]"
                    style={{
                      color,
                      border: `1px solid ${color}40`,
                      background: `${color}15`,
                    }}
                  >
                    {p.status}
                  </span>
                </div>

                <h3 className="text-white text-base font-bold m-0">{p.title}</h3>
                <p className="text-gray-500 text-[13px] m-0 flex-1">{p.description}</p>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleEdit(p)}
                    className="flex-1 bg-transparent border border-gray-700 rounded-lg py-1.5 px-2.5 text-gray-300 text-xs cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 bg-transparent border border-red-900 rounded-lg py-1.5 px-2.5 text-red-500 text-xs cursor-pointer"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Projects;