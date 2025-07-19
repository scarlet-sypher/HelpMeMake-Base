import React ,{useState} from 'react';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

function MentorDashboard() {
  const[sidebarcollapsed, setsidebarcollapsed] = useState(false);
  const[currentPage , setcurrentPage]= useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <div className="flex h-screen overflow-hidden">
        <Sidebar  collapsed = {sidebarcollapsed} onToggle={()=> setsidebarcollapsed(!sidebarcollapsed)}
          currentPage={currentPage}
          onPageChange ={setcurrentPage}

          />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header sideBarcollapsed ={sidebarcollapsed} 
          onToggleSidebar={()=> setsidebarcollapsed(!sidebarcollapsed)}/>
        </div>  
      </div>
    </div>
  );
}
export default MentorDashboard;
