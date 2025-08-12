import React, { useState } from "react";
import Sidebar from "../../components/user/Sidebar";
import {
  Users,
  UserCheck,
  Briefcase,
  CheckCircle,
  IndianRupee,
} from "lucide-react";

const adminMenuItems = [
  { icon: Users, label: "Dashboard", id: "dashboard" },
  { icon: Briefcase, label: "Reports", id: "reports" },
  { icon: CheckCircle, label: "Analytics", id: "analytics" },
];

const statCards = [
  {
    label: "Total Users",
    value: 1200,
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Total Mentors",
    value: 150,
    icon: UserCheck,
    color: "from-purple-500 to-pink-500",
  },
  {
    label: "Active Projects",
    value: 45,
    icon: Briefcase,
    color: "from-green-500 to-emerald-500",
  },
  {
    label: "Completed Projects",
    value: 320,
    icon: CheckCircle,
    color: "from-indigo-500 to-blue-500",
  },
  {
    label: "Total Payment Collected",
    value: "25,000",
    icon: IndianRupee,
    color: "from-yellow-400 to-orange-500",
  },
];

export default function AdminDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showUserList, setShowUserList] = useState(false);
  const [showMentorList, setShowMentorList] = useState(false);

  // Dummy data for lists
  const users = ["Alice", "Bob", "Charlie", "David", "Eva"];
  const mentors = ["Mentor1", "Mentor2", "Mentor3", "Mentor4"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex relative">
      {/* Mobile Sidebar Toggle Button */}
      {!isSidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800/80 text-white shadow-lg lg:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          {/* Hamburger icon */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        activeItem={activeTab}
        setActiveItem={setActiveTab}
        menuItems={adminMenuItems}
      />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Admin Dashboard
          </h1>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {statCards.map((card) => (
              <div
                key={card.label}
                className={`bg-gradient-to-r ${card.color} rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-white hover:scale-105 transition-transform duration-300`}
              >
                <card.icon size={32} className="mb-2" />
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="text-lg mt-1">{card.label}</div>
                {card.label === "Total Users" && (
                  <button
                    className="mt-4 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
                    onClick={() => setShowUserList((v) => !v)}
                  >
                    {showUserList ? "Hide List" : "List Users"}
                  </button>
                )}
                {card.label === "Total Mentors" && (
                  <button
                    className="mt-4 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
                    onClick={() => setShowMentorList((v) => !v)}
                  >
                    {showMentorList ? "Hide List" : "List Mentors"}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* User List */}
          {showUserList && (
            <div className="bg-slate-800/60 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">User List</h2>
              <ul className="space-y-2">
                {users.map((user) => (
                  <li key={user} className="text-white/80">
                    {user}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mentor List */}
          {showMentorList && (
            <div className="bg-slate-800/60 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Mentor List</h2>
              <ul className="space-y-2">
                {mentors.map((mentor) => (
                  <li key={mentor} className="text-white/80">
                    {mentor}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
