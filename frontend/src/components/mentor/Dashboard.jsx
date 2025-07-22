import React from "react";
import StatusGrid from "./StatusGrid";
import Quick from "./Quick";
import Tracker from "./Tracker";
import Timer from "./Timer";
import SessionsChat from "./SessionsChat";
function Dashboard() {
  return (
    <div className="space-y-6 bg-gradient-to-br ">
      {/* Status grid */}
      <StatusGrid />

      {/* Quick Actions */}
      <Quick />

      {/* project tracker */}
      <Tracker />

      {/* Working hours section */}
      <Timer />
      {/* Upcoming sessions */}
      <SessionsChat />
    </div>
  );
}

export default Dashboard;
