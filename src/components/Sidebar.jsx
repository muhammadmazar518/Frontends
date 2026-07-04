import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getProfile } from "../api";

const navItems = [
  { path: "/dashboard", label: "Overview", icon: "🏠" },
  { path: "/profile", label: "Profile", icon: "👤" },
  { path: "/weather", label: "Weather", icon: "🌤" },
  { path: "/courses", label: "Courses", icon: "📚", pro: true },
  { path: "/pricing", label: "Pricing", icon: "💳" },
  { path: "/services", label: "Services", icon: "🛠️" },
  { path: "/projects", label: "Projects", icon: "📁" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getProfile()
      .then((res) => {
        setUser(res.data);
        if (
          res.data?.is_pro ||
          res.data?.isPro ||
          res.data?.has_purchased ||
          res.data?.hasPurchased
        ) {
          setHasPurchased(true);
        } else {
          setHasPurchased(false);
        }
      })
      .catch((err) => {
        console.error("Profile load karne mein error aaya:", err);
      });

    const saved = localStorage.getItem("profile_photo");
    setPhoto(saved || null);

    const handleStorage = () => {
      const updated = localStorage.getItem("profile_photo");
      setPhoto(updated || null);
    };
    window.addEventListener("profile_photo_updated", handleStorage);
    return () =>
      window.removeEventListener("profile_photo_updated", handleStorage);
  }, [localStorage.getItem("token")]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile_photo");
    navigate("/");
  };

  return (
    <div className="w-60 min-h-screen bg-white flex flex-col fixed top-0 left-0 z-[100] border-r border-black">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 pt-5 pb-4">
        <div className="w-9 h-9 bg-violet-600 rounded-[10px] flex items-center justify-center text-white font-extrabold text-base">
          V
        </div>
        <span className="text-black font-extrabold text-base tracking-tight">
          VoxtaStack
        </span>
      </div>

      {/* User Card */}
      <div className="flex items-center gap-2.5 mx-3 mb-4 p-3 bg-[#161824] rounded-xl border border-[#1e2130]">
        <div className="w-9 h-9 rounded-full bg-violet-600 text-white font-bold text-[15px] flex items-center justify-center shrink-0 overflow-hidden">
          {photo ? (
            <img
              src={photo}
              alt="avatar"
              className="w-full h-full object-cover rounded-full"
            />
          ) : user?.name ? (
            user.name.charAt(0).toUpperCase()
          ) : (
            "U"
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-white font-bold text-[13px] m-0">
            {user?.name || "User"}
          </p>
          <p className="text-white text-[11px] mt-0.5 m-0">
            {user?.email ? user.email.substring(0, 14) + "..." : ""}
          </p>
        </div>
        {!hasPurchased && (
          <span className="bg-[#1e2130] text-gray-400 text-[10px] font-bold px-2 py-[3px] rounded-md tracking-wide shrink-0">
            FREE
          </span>
        )}
      </div>

      {/* Menu Label */}
      <p className="text-gray-500 text-[11px] font-bold tracking-[1.5px] px-4 pb-1.5 m-0">
        MENU
      </p>

      {/* Nav Items */}
      <nav className="flex flex-col px-2 gap-0.5 flex-1">
        {navItems.map((item) => {
          const isLocked = item.pro && !hasPurchased;

          return (
            <NavLink
              key={item.path}
              to={isLocked ? "#" : item.path}
              onClick={(e) => {
                if (isLocked) {
                  e.preventDefault();
                  alert("Please purchase the course first from Pricing page.");
                  navigate("/pricing");
                }
              }}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 px-3 py-[11px] rounded-[10px] text-sm font-medium no-underline transition-all duration-200",
                  isLocked
                    ? "opacity-50 cursor-not-allowed text-gray-600"
                    : "text-black cursor-pointer",
                  isActive && !isLocked
                    ? "bg-[#1e2540] text-indigo-400 border-l-[3px] border-indigo-400"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <span className={`text-[17px] ${isLocked ? "opacity-40" : ""}`}>
                {item.icon}
              </span>
              <span className={`flex-1 ${isLocked ? "text-gray-600" : ""}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom / Logout */}
      <div className="p-3">
        <div className="h-px bg-[#1e2130] mb-3" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 bg-transparent border-[10px] border-transparent rounded-[20px] text-red-500 text-sm font-semibold cursor-pointer"
        >
          <span className="text-base">[→</span>
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;