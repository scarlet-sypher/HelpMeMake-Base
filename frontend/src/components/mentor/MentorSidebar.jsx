import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
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
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    
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

function Sidebar({ collapsed, onToggle, currentPage, onPageChange }) {
  const { logout } = useAuth();
  const [openSubmenuId, setOpenSubmenuId] = useState(null);

  const toggleSubmenu = (id) => {
    setOpenSubmenuId((prev) => (prev === id ? null : id));
  };
  const navigate = useNavigate();

  const handleLogout = () => {
      logout(); 
    };

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-screen transition-all duration-300 bg-white/10 dark:bg-slate-900/50 backdrop-blur-sm border-r border-white/20 shadow-2xl flex flex-col justify-between bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900`}
    >
      <div>
        {/* Top Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-white">HelpMeMake</h1>
                <p className="text-sm text-slate-300">Mentor Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  onPageChange?.(item.id);
                  if (item.submenu) toggleSubmenu(item.id);
                }}
                className={`w-full flex ${
                  collapsed ? "justify-center" : "justify-start"
                } items-center space-x-3 p-3 rounded-xl transition-all duration-200
                  ${
                    currentPage === item.id || item.active
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-300 hover:bg-white/10"
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
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu.map((subitem) => (
                      <button
                        key={subitem.id}
                        onClick={() => onPageChange?.(subitem.id)}
                        className="block text-sm text-left text-slate-400 hover:text-purple-400 p-2"
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

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10 space-y-4">
        {!collapsed && (
          <div className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl">
            <img
              src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000"
              alt="user"
              className="w-10 h-10 rounded-full ring-2 ring-blue-500"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Om Singh
              </p>
              <p className="text-xs text-slate-400 truncate">
                Administrator
              </p>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button 
          className="w-full flex items-center justify-center space-x-2 p-3 text-sm font-semibold text-red-500 hover:text-white hover:bg-red-500 hover:scale-105 transition-all duration-300 rounded-xl shadow-md bg-white/5"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
