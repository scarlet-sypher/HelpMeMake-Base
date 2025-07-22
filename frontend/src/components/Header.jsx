import React from "react";
import {
  Menu,
  Search,
  Filter,
  Plus,
  Sun,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";

function Header({ sideBarcollapsed, onToggleSidebar }) {
  return (
    <div className="px-6 py-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-xl shadow-2xl rounded-none border-none">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex space-x-4 items-center">
          <button
            className="p-2 text-white rounded-lg transition-colors hover:bg-white/10"
            onClick={onToggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block">
            <h1 className="text-2xl font-black text-white">Dashboard</h1>
            <p className="text-sm text-slate-300">Welcome back, Om Singh!</p>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-10 py-2.5 bg-white/10 text-white placeholder-slate-400 border border-white/10 rounded-xl backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-2.5 text-slate-400 hover:text-white">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right section */}
        <div className="flex space-x-3 items-center">
          {/* Quick Action Button */}
          <button className="hidden lg:flex items-center space-x-2 py-2 px-4 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:shadow-md transition-all">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New</span>
          </button>

          {/* Theme Toggle */}
          <button className="p-2.5 text-white rounded-xl hover:bg-white/10 transition-colors">
            <Sun className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="p-2.5 text-white rounded-xl relative hover:bg-white/10 transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-3.5 h-3.5 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">3</span>
          </button>

          {/* Settings */}
          <button className="p-2.5 text-white rounded-xl hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* Logout */}
          <button className="p-2.5 text-white rounded-xl hover:bg-white/10 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="flex space-x-3 pl-3 border-l border-white/10 items-center">
            <img
              src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000"
              alt="USER"
              className="w-8 h-8 rounded-full ring-2 ring-blue-500"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">Om Singh</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
