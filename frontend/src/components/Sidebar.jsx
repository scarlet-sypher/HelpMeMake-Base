import React from "react";
import { Zap } from "lucide-react";

function Sidebar() {
  return (
    <div className="transition duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col relative z-10">
      {/* logo */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          {/* conditional rendoring */}

          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              HelpMeMake
            </h1>
            <p className="text-xl font-bold text-slate-500 dark:text-slate-400">
              Mentor Dashboard
            </p>
          </div>
        </div>
      </div>
      {/* navigation dynamic menus */}

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto"></nav>

      {/* user profile */}

      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center  space-x-3 p-3 rounded-xl  bg-slate-50 dark:bg-slate-800/50 ">
          <img
            src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
            alt="user"
            className="w-10 h-xl rounded-4xl ring-2 ring-blue-500"
          />
          <div className="flex-1 min-width-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                Om Singh
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
