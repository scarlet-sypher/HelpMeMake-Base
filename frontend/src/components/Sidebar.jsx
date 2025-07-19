import React, { useState } from "react";
import {
  Mail,
  Bell,
  CalendarCheck,
  NotebookPen,
  CreditCard,
  LayoutDashboard,
  Settings,
  Zap,
  BriefcaseBusiness,
  Rss,
  ChevronDown,
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
    submenu: [
      { id: "lecture", label: "VideoLec" },
      { id: "material", label: "Study-Material" },
    ],
  },
  {
    id: "creditCard",
    icon: CreditCard,
    label: "Payments",
    badge: "+$",
    submenu: [
      { id: "history", label: "History" },
      { id: "issue", label: "Issue" },
    ],
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
     submenu: [
      { id: "accountMenu", label: "Account" },
      { id: "editOption", label: "Edit Profile" },
    ],
  },
  {
    id: "mWork",
    icon: BriefcaseBusiness,
    label: "Upload Your Projects",
    submenu: [
      { id: "project", label: "Projects" },
      { id: "blogs", label: "Write Blogs" },
    ],
  },
  
];

function Sidebar( {collapsed, onToggle, currentPage, onPageChange }) {
  const [openSubmenuId, setOpenSubmenuId] = useState(null);

  const toggleSubmenu = (id) => {
    setOpenSubmenuId((prev) => (prev === id ? null : id));
  };
  return (
    <div className={`${
        collapsed ? "w-20" : "w-72"
      } h-screen transition duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col justify-between z-10`}>
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                  HelpMeMake
                </h1>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Mentor Dashboard
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  onPageChange?.(item.id);
                  if (item.submenu) toggleSubmenu(item.id);
                }}
                className={`w-full flex items-center justify-start space-x-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 ${
                  currentPage === item.id || item.active
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {!collapsed && (
                  <>
                    <span className="font-medium flex-1 text-left">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.submenu && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          openSubmenuId === item.id ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </>
                )}
              </button>

              {/* Submenu */}
              {!collapsed &&
                item.submenu &&
                openSubmenuId === item.id && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.submenu.map((subitem) => (
                      <button
                        key={subitem.id}
                        onClick={() => onPageChange?.(subitem.id)}
                        className="block text-sm text-left text-slate-600 dark:text-slate-300 hover:text-blue-600 p-2"
                      >
                        {subitem.label}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Section - User Profile */}
      {!collapsed && (
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
      )}
    </div>
  );
}

export default Sidebar;
