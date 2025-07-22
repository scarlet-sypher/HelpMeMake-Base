import React from "react";
import { BarChart3, Clock, Sparkles } from "lucide-react";

const Timer = () => {
  const [seconds, setSeconds] = React.useState(0);
  const dailyData = [4, 6, 3, 5, 8, 2, 7];
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6  p-4 lg:p-6 rounded-3xl shadow-2xl">
      
      {/* Bar chart */}
      <div className="rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 shadow-md transition-all">
        <h2 className="text-lg font-semibold text-white flex items-center mb-4">
          <BarChart3 className="w-5 h-5 text-purple-400 mr-2" />
          Working Hours (Last 7 Days)
        </h2>
        <div className="flex items-end justify-between h-44">
          {dailyData.map((val, idx) => {
            const isMax = val === maxVal;
            const isToday = idx === currentDay;

            return (
              <div key={idx} className="flex flex-col items-center group relative">
                <div
                  className={`w-6 rounded-md transition-all duration-300 cursor-pointer
                    ${isMax
                      ? "bg-gradient-to-t from-yellow-400 to-red-500 shadow-lg shadow-yellow-500/30"
                      : "bg-gradient-to-t from-purple-500 to-indigo-500"}
                    ${isToday ? "ring-2 ring-purple-400 ring-offset-2" : ""}
                    group-hover:scale-110`}
                  style={{ height: `${val * 10 + 10}px` }}
                ></div>
                {isMax && (
                  <Sparkles className="absolute -top-6 text-yellow-400 w-4 h-4 animate-bounce" />
                )}
                <span className="mt-1 text-xs text-white/80 group-hover:text-purple-300">{val}h</span>
                <span className="text-[10px] leading-tight text-center text-white/50 mt-0.5 whitespace-pre-line">
                  {dateLabels[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live timer */}
      <div className="rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 shadow-md flex flex-col items-center justify-center text-center transition-all">
        <h2 className="text-lg font-semibold text-white flex items-center mb-4">
          <Clock className="w-5 h-5 text-yellow-400 mr-2 animate-pulse" />
          Current Session Time
        </h2>
        <div className="text-5xl font-extrabold text-purple-400 tracking-wider animate-pulse">
          {formatTime(seconds)}
        </div>
        <span className="mt-2 text-sm text-white/60">{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default Timer;
