import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Services = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", price: "", icon: "🌐" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchServices = async () => {
    const res = await axios.get(`${API}/services`, { headers });
    setServices(res.data);
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async () => {
    if (!form.title) return;
    setLoading(true);
    if (editId) {
      await axios.put(`${API}/services/${editId}`, form, { headers });
      setEditId(null);
    } else {
      await axios.post(`${API}/services`, form, { headers });
    }
    setForm({ title: "", description: "", price: "", icon: "🌐" });
    fetchServices();
    setLoading(false);
  };

  const handleEdit = (s) => {
    setEditId(s.id);
    setForm({ title: s.title, description: s.description, price: s.price, icon: s.icon });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    await axios.delete(`${API}/services/${id}`, { headers });
    fetchServices();
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ title: "", description: "", price: "", icon: "🌐" });
  };

  return (
    <div>
      <h1 className="text-white text-[28px] font-extrabold m-0 mb-1">Services</h1>
      <p className="text-gray-500 text-sm mb-6">Manage your services</p>

      {/* Form Card */}
      <div className="bg-[#161824] border border-[#1e2130] rounded-2xl p-5 mb-8 flex flex-col gap-3">
        <h3 className="text-white text-[15px] font-bold m-0">
          {editId ? "✏️ Edit Service" : "➕ Add Service"}
        </h3>

        <div className="flex gap-3 flex-wrap">
          <input
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="flex-1 bg-[#0d0f14] border border-[#1e2130] rounded-lg px-3.5 py-2.5 text-white text-sm outline-none"
          />
          <input
            placeholder="Price (e.g. $500)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="flex-1 bg-[#0d0f14] border border-[#1e2130] rounded-lg px-3.5 py-2.5 text-white text-sm outline-none"
          />
          <input
            placeholder="Icon 🌐"
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

      {/* Services Grid */}
      {services.length === 0 ? (
        <p className="text-gray-500">No services yet. Add one above!</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-[#161824] border border-[#1e2130] rounded-2xl p-6 flex flex-col gap-2.5"
            >
              <div className="text-[32px]">{s.icon}</div>
              <h3 className="text-white text-base font-bold m-0">{s.title}</h3>
              <p className="text-gray-500 text-[13px] m-0 flex-1">{s.description}</p>

              <div className="flex justify-between items-center mt-auto">
                <span className="text-violet-500 text-lg font-extrabold">{s.price}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="bg-transparent border border-gray-700 rounded-lg px-2.5 py-1.5 cursor-pointer text-sm"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-transparent border border-red-900 rounded-lg px-2.5 py-1.5 cursor-pointer text-sm"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;