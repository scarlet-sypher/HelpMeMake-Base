import React, { useState } from "react";
import {
  Rocket,
  Target,
  CheckCircle,
  Clock,
  Flag,
  PieChart,
} from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const milestones = [
  { title: "Kickoff", icon: Rocket, status: "completed" },
  { title: "Plan Goals", icon: Target, status: "completed" },
  { title: "In Progress", icon: Clock, status: "current" },
  { title: "Final Review", icon: Flag, status: "upcoming" },
  { title: "Completed", icon: CheckCircle, status: "upcoming" },
];

const TooltipPie = ({ visible }) => {
  const data = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [
      {
        data: [2, 1, 2],
        backgroundColor: ["#22c55e", "#eab308", "#6b7280"],
        borderColor: ["#16a34a", "#ca8a04", "#4b5563"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#cbd5e1",
          font: { size: 12 },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      duration: 1000,
    },
  };

  if (!visible) return null;

  return (
    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 rounded-xl shadow-2xl z-50 animate-fadeIn backdrop-blur-md border border-white/10">
      <Pie data={data} options={options} />
    </div>
  );
};

const MilestonePoint = ({ milestones }) => {
  const [showChart, setShowChart] = useState(false);

  return (
    <div
      className="relative flex flex-col sm:flex-row items-center sm:justify-around w-full gap-y-8 sm:gap-y-0 sm:gap-x-4 py-4"
      onMouseEnter={() => setShowChart(true)}
      onMouseLeave={() => setShowChart(false)}
    >
      <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-gray-400 dark:to-slate-700 opacity-30 transform -translate-y-1/2" />
      <div className="block sm:hidden absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 via-yellow-400 to-gray-400 dark:to-slate-700 opacity-30 transform -translate-x-1/2" />

      {milestones.map((milestone, index) => {
        const Icon = milestone.icon;
        const isCompleted = milestone.status === "completed";
        const isCurrent = milestone.status === "current";

        const color = isCompleted
          ? "text-green-500 border-green-400 dark:text-green-400"
          : isCurrent
          ? "text-yellow-500 border-yellow-400 dark:text-yellow-400"
          : "text-gray-400 border-gray-300 dark:text-slate-400 dark:border-slate-600";

        const bgClass = isCompleted
          ? "bg-green-100/60 dark:bg-green-400/10 dark:shadow-green-500/20 dark:ring-2 dark:ring-green-400"
          : isCurrent
          ? "bg-yellow-100/40 dark:bg-yellow-400/10"
          : "bg-gray-100/30 dark:bg-slate-800/40";

        return (
          <div key={index} className="flex flex-col items-center text-center z-10 relative hover:cursor-pointer">
            <div
              className={`p-4 border-2 rounded-full backdrop-blur-xl transition-transform duration-300 hover:scale-105 shadow-md ${color} ${bgClass} bg-white/10 hover:shadow-lg hover:ring-2 hover:ring-white/20`}
            >
              <Icon size={24} />
            </div>
            <span className="mt-2 text-xs sm:text-sm text-slate-800 dark:text-white font-medium">
              {milestone.title}
            </span>
          </div>
        );
      })}
      <TooltipPie visible={showChart} />
    </div>
  );
};

const MilestoneTracker = () => {
  return (
    <div className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#312e81] p-6 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-md transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Target className="mr-2 text-purple-400" size={20} />
          Project Milestone Tracker
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <span className="text-sm text-purple-300">Live Updates</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-blue-300">Current Project:</span>
          <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            Grand Line Navigation System
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              style={{ width: "40%" }}
            />
          </div>
          <span className="text-sm font-bold text-purple-400">40%</span>
        </div>
      </div>

      <div className="bg-white/10 dark:bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 relative backdrop-blur-sm shadow-md">
        <MilestonePoint milestones={milestones} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 shadow-md hover:scale-105 transition-all">
          <div className="text-xl font-bold text-emerald-400">2</div>
          <div className="text-sm text-emerald-300">Completed</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 shadow-md hover:scale-105 transition-all">
          <div className="text-xl font-bold text-yellow-400">1</div>
          <div className="text-sm text-yellow-300">In Progress</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 shadow-md hover:scale-105 transition-all">
          <div className="text-xl font-bold text-slate-400">2</div>
          <div className="text-sm text-slate-300">Pending</div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneTracker;
