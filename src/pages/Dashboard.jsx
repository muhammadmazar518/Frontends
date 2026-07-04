import { useEffect, useState } from "react";
import { getDashboardStats, getProfile } from "../api";
import { useNavigate } from "react-router-dom";

const StatCard = ({ label, value, icon, badge, color }) => (
  <div className="bg-[#161824] border border-[#1e2130] rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
    <div className="flex justify-between items-center mb-4">
      <span className="text-3xl">{icon}</span>
      <span className={`text-xs px-3 py-1 rounded-full border ${color}`}>
        {badge}
      </span>
    </div>
    <h2 className={`text-3xl font-bold ${color.split(" ")[0]}`}>
      {value ?? "--"}
    </h2>
    <p className="text-gray-400 mt-2">{label}</p>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));

    getProfile()
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, []);

  const isPro = user?.is_pro || user?.isPro || user?.has_purchased || user?.hasPurchased;
  const planLabel = isPro ? "Pro" : "Free";

  return (
    <div>
      <h1 className="text-4xl font-bold text-white">Dashboard</h1>
      <p className="text-gray-400 mt-2 mb-8">
        Welcome Back, <span className="text-white font-semibold">{user?.name || "User"}</span> 👋
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          label="Plan"
          value={planLabel}
          icon="💎"
          badge="PLAN"
          color={isPro ? "text-yellow-400 border-yellow-400" : "text-cyan-400 border-cyan-400"}
        />
        <StatCard label="Status"  value="Active"                       icon="🟢" badge="STATUS"  color="text-green-400 border-green-400"   />
        <StatCard label="Member"  value={stats.memberSince || "2026"}  icon="📅" badge="MEMBER"  color="text-yellow-400 border-yellow-400" />
        <StatCard label="Courses" value={stats.lockedCourses || 0}     icon="📚" badge="COURSES" color="text-purple-400 border-purple-400" />
      </div>

      {/* Quick Actions */}
      <div className="mt-10 bg-[#161824] rounded-2xl border border-[#1e2130] p-6">
        <h2 className="text-2xl font-bold text-white mb-5">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => navigate("/profile")} className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold">Edit Profile</button>
          <button onClick={() => navigate("/weather")} className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold">Weather</button>
          <button onClick={() => navigate("/courses")} className="px-6 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold">Courses</button>
          <button onClick={() => navigate("/pricing")} className="px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold">Upgrade Plan</button>
        </div>
      </div>
    </div>
  );
}