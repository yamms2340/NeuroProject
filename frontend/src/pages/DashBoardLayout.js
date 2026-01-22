import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleJoinClass = () => {
    navigate("/study-rooms");
  };

  return (
    <div className="flex w-screen h-screen bg-[#0f172a] text-white">
      <Sidebar
        sidebarOpen={sidebarOpen}
        onJoinClass={handleJoinClass}
        onLogout={handleLogout}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
