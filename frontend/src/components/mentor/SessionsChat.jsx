import React, { useState } from "react";
import { CalendarCheck } from "lucide-react";
import {
  BarChart3,
  Clock,
  CalendarCheck,
  PlusCircle,
  MessageCircle,
  UserCircle2,
  Video,
} from "lucide-react";
import { Sparkles } from "lucide-react";

const SessionsChat = () => {
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({ date: "", time: "" });

  const addSession = () => {
    if (formData.date && formData.time) {
      setSessions([...sessions, { ...formData }]);
      setFormData({ date: "", time: "" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/2 rounded-3xl bg-white/10 dark:bg-slate-900/50 border border-white/10 p-6 backdrop-blur-md shadow-md space-y-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center mb-4">
          <CalendarCheck className="w-5 h-5 text-green-400 mr-2" /> Upcoming
          Sessions
        </h2>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="date"
            className="bg-white/20 dark:bg-slate-800 text-slate-700 dark:text-white p-2 rounded-xl border border-slate-200/30 dark:border-slate-700/40 backdrop-blur focus:outline-none"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <input
            type="time"
            className="bg-white/20 dark:bg-slate-800 text-slate-700 dark:text-white p-2 rounded-xl border border-slate-200/30 dark:border-slate-700/40 backdrop-blur focus:outline-none"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
          <button
            onClick={addSession}
            className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:scale-105 transition transform"
          >
            <PlusCircle className="w-4 h-4" /> Add Session
          </button>
        </div>

        <div className="space-y-2">
          {sessions.map((session, index) => (
            <div
              key={index}
              className="p-3 rounded-xl bg-white/20 dark:bg-slate-800/30 border border-white/10 flex justify-between items-center"
            >
              <span className="text-sm text-slate-800 dark:text-slate-200">
                {new Date(session.date).toDateString()} at{" "}
                {new Date(`1970-01-01T${session.time}:00`).toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit" }
                )}
              </span>
              <button className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 transition">
                <Video className="w-4 h-4" /> Join
              </button>
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No sessions scheduled yet.
            </p>
          )}
        </div>
      </div>

      <div className="w-full lg:w-1/2 rounded-3xl bg-white/10 dark:bg-slate-900/50 border border-white/10 p-6 backdrop-blur-md shadow-md flex flex-col justify-between">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center mb-4">
          <MessageCircle className="w-5 h-5 text-blue-400 mr-2" /> Mentor Chat
        </h2>
        <div className="h-64 overflow-y-auto space-y-4">
          <div className="flex items-start gap-2">
            <img
              src="data:image/jpeg;base64,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"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <div className="bg-white/20 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-2 rounded-2xl max-w-xs">
              Hello Mentor, I have a doubt regarding my project timeline.
            </div>
          </div>
          <div className="flex items-start gap-2 justify-end">
            <div className="bg-indigo-500 text-white px-4 py-2 rounded-2xl max-w-xs">
              Sure! Let’s schedule a quick session tomorrow.
            </div>
            <img
              src="data:image/jpeg;base64,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"
              alt="Mentor"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 rounded-xl bg-white/30 dark:bg-slate-800 text-sm text-slate-700 dark:text-white border border-slate-200/30 dark:border-slate-700/40 focus:outline-none"
          />
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:scale-105 transition transform">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
export default SessionsChat;
