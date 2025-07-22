import React ,{useState} from 'react';
import MentorSidebar from "../../components/mentor/MentorSidebar";
import Header from "../../components/mentor/Header";
import Dashboard from "../../components/mentor/Dashboard";

function MentorDashboard() {
  const[sidebarcollapsed, setsidebarcollapsed] = useState(false);
  const[currentPage , setcurrentPage]= useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:via-slate-800 transition-all duration-500">
      <div className="flex h-screen overflow-hidden">
        <MentorSidebar
          collapsed={sidebarcollapsed}
          onToggle={() => setsidebarcollapsed(!sidebarcollapsed)}
          // currentPage={currentPage}
          // onPageChange={setcurrentPage}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            sideBarcollapsed={sidebarcollapsed}
            onToggleSidebar={() => setsidebarcollapsed(!sidebarcollapsed)}
          />

          <main className="flex-1 overflow-y-auto h-full">
            <div className='p-6 space-y-6 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'>
              {currentPage === "dashboard" && <Dashboard />}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
export default MentorDashboard;
