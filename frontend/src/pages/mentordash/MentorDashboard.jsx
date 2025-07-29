import React ,{useState , useEffect} from 'react';
import { useAuth } from '../../hooks/useAuth';
import MentorSidebar from "../../components/mentor/MentorSidebar";
import Header from "../../components/mentor/Header";
import Dashboard from "../../components/mentor/Dashboard";

function MentorDashboard() {

  const { user, loading, isAuthenticated } = useAuth();
  const[sidebarcollapsed, setsidebarcollapsed] = useState(false);
  const[currentPage , setcurrentPage]= useState("dashboard");

    useEffect(() => {
    if (!loading && !isAutheniticated) {
      window.location.href = '/login';
    }
  }, [loading, isAuthenticated]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

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
