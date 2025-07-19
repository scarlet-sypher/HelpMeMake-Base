import React from "react";
import {
  Mail,
  Bell,
  CalendarCheck,
  NotebookPen,
  CreditCard,
  LayoutDashboard,
  Settings,
  Zap,
  Rss
} from "lucide-react";

const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    active: true,
    badge: "New",
  },
  {
    id: "mail",
    icon: Mail,
    label: "Mail",
    badge: "2",
  },
  {
    id: "bell",
    icon: Bell,
    label: "Notifications",
    badge: "3",
  },
  {
    id: "calendarCheck",
    icon: CalendarCheck,
    label: "Calendar",
    
  },
  {
    id: "notebookPen",
    icon: NotebookPen,
    label: "Notes",
  },
  {
    id: "creditCard",
    icon: CreditCard,
    label: "Payments",
    badge: "+$",
  },
  {
    id: "update",
    icon: Rss,
    label: "Updates",
    badge: "New",
  },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
    // badge: "New",
  },
];

function Sidebar() {
  return (
    <div className="w-72 h-screen transition duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col justify-between z-10">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                HelpMeMake
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Mentor Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center justify-start space-x-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              <item.icon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              <span className="font-medium text-slate-800 dark:text-slate-100">
                {item.label}
              </span>
              {item.badge && (
                <span className="ml-auto px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Section - User Profile */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <img
            src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
            alt="user"
            className="w-10 h-10 rounded-full ring-2 ring-blue-500"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
              Om Singh
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
