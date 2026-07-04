import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../api";

const Profile = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: "", profession: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then((res) => setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        website: res.data.website || "",
        profession: res.data.profession || "",
      }))
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));

    const token = localStorage.getItem("token");
    const savedPhoto = localStorage.getItem("profile_photo");
    const savedToken = localStorage.getItem("photo_token");

    if (savedPhoto && savedToken === token) {
      setPhoto(savedPhoto);
    } else {
      setPhoto(null);
      localStorage.removeItem("profile_photo");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(""); setError("");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      localStorage.setItem("profile_photo", ev.target.result);
      localStorage.setItem("photo_token", localStorage.getItem("token"));
      window.dispatchEvent(new CustomEvent("profile_photo_updated"));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { setError("Name and email are required."); return; }
    try {
      setSaving(true);
      await updateProfile(form);
      setSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally { setSaving(false); }
  };

  return (
    <div className="p-10 bg-black min-h-screen">
      <h1 className="text-white text-[28px] font-extrabold m-0 mb-1 tracking-tight">
        My Profile
      </h1>
      <p className="text-black text-sm mb-6">
        Manage your account information
      </p>

      <div className="bg-[#161824] border border-[#1e2130] rounded-2xl p-7 max-w-[700px]">

        {/* Top Section */}
        <div className="flex items-center gap-5 mb-6">
          <div
            className="relative w-[90px] h-[90px] rounded-full cursor-pointer shrink-0"
            onClick={() => fileRef.current.click()}
          >
            {photo ? (
              <img
                src={photo}
                alt="Profile"
                className="w-[90px] h-[90px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[90px] h-[90px] rounded-full bg-violet-600 text-white text-4xl font-extrabold flex items-center justify-center">
                {form.name ? form.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="absolute bottom-0.5 right-0.5 w-[26px] h-[26px] rounded-full bg-[#1e2130] border-2 border-[#0d0f14] flex items-center justify-center cursor-pointer">
              <span className="text-sm">📷</span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-white text-[22px] font-extrabold m-0">
              {form.name || "User"}
            </h2>
            <p className="text-gray-500 text-sm m-0 mb-2">
              {form.email}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#1e2130] mb-6" />

        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : editMode ? (

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-[#1f0a0a] border border-red-900 text-red-300 px-3.5 py-2.5 rounded-lg text-[13px]">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-[#052e16] border border-green-800 text-green-300 px-3.5 py-2.5 rounded-lg text-[13px]">
                {success}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "FULL NAME", name: "name", type: "text" },
                { label: "EMAIL", name: "email", type: "email" },
                { label: "PHONE", name: "phone", type: "text" },
                { label: "WEBSITE", name: "website", type: "text" },
                { label: "PROFESSION", name: "profession", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name} className="flex flex-col gap-1.5">
                  <label className="text-gray-600 text-[11px] font-bold tracking-[1px]">
                    {label}
                  </label>
                  <input
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder="—"
                    className="bg-[#0d0f14] border border-[#1e2130] rounded-lg px-3.5 py-2.5 text-white text-sm outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2.5">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-violet-600 border-none rounded-lg text-white text-sm font-bold cursor-pointer disabled:opacity-60"
              >
                {saving ? "Saving..." : "✓ Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-5 py-2.5 bg-transparent border border-gray-700 rounded-lg text-gray-400 text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>

        ) : (
          <>
            <div className="grid grid-cols-3 gap-x-8 gap-y-5 mb-7">
              {[
                { label: "FULL NAME", value: form.name },
                { label: "EMAIL", value: form.email },
                { label: "PHONE", value: form.phone },
                { label: "WEBSITE", value: form.website },
                { label: "PROFESSION", value: form.profession },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-gray-600 text-[11px] font-bold tracking-[1px] m-0 mb-1.5">
                    {label}
                  </p>
                  <p className="text-gray-300 text-[15px] font-medium m-0">
                    {value || "—"}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-gray-700 rounded-[10px] text-gray-300 text-sm font-semibold cursor-pointer"
            >
              ✏️ Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;