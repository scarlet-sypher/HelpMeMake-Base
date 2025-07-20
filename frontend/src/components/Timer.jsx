import React from "react";
import StatusGrid from "./StatusGrid";
import Quick from "./Quick";
import Tracker from "./Tracker";
import { BarChart3, Clock ,Sparkles } from "lucide-react";

// Time chart and live timer component merged
const Timer = () => {
  const [seconds, setSeconds] = React.useState(0);
  const dailyData = [4, 6, 3, 5, 8, 2, 7]; // Dummy data for 7 days
  const maxVal = Math.max(...dailyData);
  const currentDay = new Date().getDay();

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dateLabels = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return `${dayLabels[date.getDay()]}\n${date.getDate()}`;
  });

  React.useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Bar chart */}
      <div className="rounded-3xl bg-white/10 dark:bg-slate-900/50 border border-white/10 p-6 backdrop-blur-md shadow-md">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center mb-4">
          <BarChart3 className="w-5 h-5 text-purple-400 mr-2" /> Working Hours (Last 7 Days)
        </h2>
        <div className="flex items-end justify-between h-44">
          {dailyData.map((val, idx) => {
            const isMax = val === maxVal;
            const isToday = idx === currentDay;
            return (
              <div key={idx} className="flex flex-col items-center group relative">
                <div
                  className={`w-6 rounded-md transition-all duration-300 cursor-pointer 
                    ${isMax ? 'bg-gradient-to-t from-yellow-500 to-red-500 shadow-lg shadow-yellow-500/30' : 'bg-gradient-to-t from-purple-500 to-indigo-400'}
                    ${isToday ? 'ring-2 ring-offset-2 ring-purple-400' : ''}`}
                  style={{ height: `${val * 10 + 10}px` }}
                ></div>
                {isMax && (
                  <Sparkles className="absolute -top-6 text-yellow-400 w-4 h-4 animate-bounce" />
                )}
                <span className="mt-1 text-xs text-slate-600 dark:text-slate-300 group-hover:text-purple-500">
                  {val}h
                </span>
                <span className="text-[10px] leading-tight text-center text-slate-500 dark:text-slate-400 mt-0.5">
                  {dateLabels[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live timer */}
      <div className="rounded-3xl bg-white/10 dark:bg-slate-900/50 border border-white/10 p-6 backdrop-blur-md shadow-md flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center mb-4">
          <Clock className="w-5 h-5 text-yellow-400 mr-2 animate-pulse" /> Current Session Time
        </h2>
        <div className="text-5xl font-extrabold text-purple-500 dark:text-purple-400 tracking-wider">
          {formatTime(seconds)}
        </div>
        <span className="mt-2 text-sm text-slate-600 dark:text-slate-400">{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
  
};

export default Timer;
