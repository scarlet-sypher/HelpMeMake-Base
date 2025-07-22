import React from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  MessageCircle,
  Timer,
  Presentation,
  MessageSquareWarning,
  CircleCheckBig,
  CalendarCheck,
  CheckCircle,
  Clock,
} from "lucide-react";

const stats = [
  {
    title: "AI Interactions",
    value: "42",
    change: "+12%",
    progress: "42%",
    trend: "up",
    color: "from-cyan-400 to-cyan-600",
    icon: <MessageCircle className="text-cyan-300 w-6 h-6" />,
  },
  {
    title: "Hours Mentoring",
    value: "18h",
    change: "+3%",
    progress: "72%",
    trend: "up",
    color: "from-orange-400 to-orange-600",
    icon: <Timer className="text-orange-300 w-6 h-6" />,
  },
  {
    title: "Upcoming Meetings",
    value: "5",
    change: "+10%",
    progress: "40%",
    trend: "up",
    color: "from-purple-400 to-purple-600",
    icon: <Presentation className="text-purple-300 w-6 h-6" />,
  },
  {
    title: "Student Feedback",
    value: "93%",
    change: "+7%",
    progress: "93%",
    trend: "up",
    color: "from-green-400 to-green-600",
    icon: <MessageSquareWarning className="text-green-300 w-6 h-6" />,
  },
  {
    title: "Completed Tasks By Student",
    value: "42",
    change: "+15%",
    progress: "80%",
    trend: "up",
    color: "from-blue-400 to-blue-600",
    icon: <CircleCheckBig className="text-blue-300 w-6 h-6" />,
  },
  {
    title: "Next Meetings",
    value: "4",
    change: "+1%",
    progress: "40%",
    trend: "up",
    color: "from-purple-400 to-purple-600",
    icon: <CalendarCheck className="text-purple-300 w-6 h-6" />,
  },
  {
    title: "Tasks Completed",
    value: "78",
    change: "+22%",
    progress: "78%",
    trend: "up",
    color: "from-green-400 to-green-600",
    icon: <CheckCircle className="text-green-300 w-6 h-6" />,
  },
  {
    title: "Pending Submissions",
    value: "6",
    change: "-8%",
    progress: "60%",
    trend: "down",
    color: "from-yellow-400 to-yellow-600",
    icon: <Clock className="text-yellow-300 w-6 h-6" />,
  },
];

function StatusGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 bg-gradient-to-br p-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`group rounded-3xl p-5 border border-white/10 backdrop-blur-sm shadow-2xl 
                      bg-gradient-to-br ${stat.color}/10 hover:${stat.color}/20 transition-all 
                      duration-300 hover:scale-105 hover:shadow-cyan-500/20`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-white/70 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-white mb-3">{stat.value}</p>
              <div className="flex items-center space-x-2 text-sm text-white/80">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
                <span>{stat.change}</span>
                <span className="text-white/50">vs Last</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md
                            group-hover:scale-110 transition-all duration-300 ease-in-out">
              {stat.icon}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${stat.color}`}
              style={{ width: stat.progress }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatusGrid;
