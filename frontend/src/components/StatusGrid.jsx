import React from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  Users,
  CalendarCheck,
  CheckCircle,
  Clock,
  Timer,
  MessageCircle,
  Presentation,
  MessageSquareWarning,
  CircleCheckBig
} from "lucide-react";

const stats = [
  {
    title: "AI Interactions",
    value: "42",
    change: "+12%",
    progress: "42%",
    trend: "up",
    color: "from-cyan-400 to-cyan-600",
    icon: <MessageCircle className="text-cyan-500 w-6 h-6" />,
  },
  {
    title: "Hours Mentoring",
    value: "18h",
    change: "+3%",
    progress: "72%",
    trend: "up",
    color: "from-orange-400 to-orange-600",
    icon: <Timer className="text-orange-500 w-6 h-6" />,
  },
  {
    title: "Upcoming Meetings",
    value: "5",
    change: "+10%",
    progress: "40%",
    trend: "up",
    color: "from-purple-400 to-purple-600",
    icon: <Presentation className="text-purple-500 w-6 h-6" />,
  },
  {
    title: "Student Feedback",
    value: "93%",
    change: "+7%",
    progress: "93%",
    trend: "up",
    color: "from-green-400 to-green-600",
    icon: <MessageSquareWarning className="text-green-500 w-6 h-6" />,
  },
  {
    title: "Completed Tasks By Student",
    value: "42",
    change: "+15%",
    progress: "80%",
    trend: "up",
    color: "from-blue-400 to-blue-600",
    icon: <  CircleCheckBig
 className="text-blue-500 w-6 h-6" />,
  },
  {
    title: "Next Meetings",
    value: "4",
    change: "+1%",
    progress: "40%",
    trend: "up",
    color: "from-purple-400 to-purple-600",
    icon: <CalendarCheck className="text-purple-500 w-6 h-6" />,
  },
  {
    title: "Tasks Completed",
    value: "78",
    change: "+22%",
    progress: "78%",
    trend: "up",
    color: "from-green-400 to-green-600",
    icon: <CheckCircle className="text-green-500 w-6 h-6" />,
  },
  {
    title: "Pending Submissions",
    value: "6",
    change: "-8%",
    progress: "60%",
    trend: "down",
    color: "from-yellow-400 to-yellow-600",
    icon: <Clock className="text-yellow-500 w-6 h-6" />,
  },
];

function StatusGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 
                     shadow-sm hover:shadow-xl dark:hover:shadow-slate-900/40 hover:border-indigo-400/60 
                     transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.015] 
                     hover:bg-white/90 dark:hover:bg-slate-800/90"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                {stat.value}
              </p>
              <div className="flex items-center space-x-2 text-sm">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span>{stat.change}</span>
                <span className="text-slate-500 dark:text-slate-400">vs Last</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 
                            group-hover:scale-110 group-hover:rotate-1 transition-all duration-300 ease-in-out">
              {stat.icon}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-300`}
              style={{ width: stat.progress }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatusGrid;
