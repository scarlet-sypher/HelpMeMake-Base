import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  MessageCircle, 
  Calendar, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  LogOut,
  Menu,
  X,
  User,
  Bell,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { 
      id: 'dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard',
      badge: null
    },
    { 
      id: 'projects', 
      icon: FolderOpen, 
      label: 'My Projects', 
      path: '/projects',
      badge: '12'
    },
    { 
      id: 'messages', 
      icon: MessageCircle, 
      label: 'Messages', 
      path: '/messages',
      badge: '3'
    },
    { 
      id: 'sessions', 
      icon: Calendar, 
      label: 'My Sessions', 
      path: '/sessions',
      badge: null
    },
    { 
      id: 'payments', 
      icon: CreditCard, 
      label: 'Payments', 
      path: '/payments',
      badge: null
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Account Settings', 
      path: '/settings',
      badge: null
    },
    { 
      id: 'support', 
      icon: HelpCircle, 
      label: 'Support', 
      path: '/support',
      badge: null
    },
    { 
      id: 'logout', 
      icon: LogOut, 
      label: 'Logout', 
      path: '/logout',
      badge: null,
      isSpecial: true
    }
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-gray-900 text-white z-50 
        transform transition-all duration-300 ease-in-out
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-64'}
        lg:relative lg:translate-x-0
        shadow-2xl border-r border-gray-800
      `}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DS</span>
            </div>
            <div className={`${isCollapsed ? 'lg:hidden' : ''}`}>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                DashSpace
              </h1>
              <p className="text-xs text-gray-400">Dashboard Pro</p>
            </div>
          </div>
          
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-md hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile Section */}
        <div className={`p-4 border-b border-gray-800 ${isCollapsed ? 'lg:px-2' : ''}`}>
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <div className={`${isCollapsed ? 'lg:hidden' : ''}`}>
              <p className="text-sm font-semibold">John Doe</p>
              <p className="text-xs text-gray-400">john@example.com</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-1 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <a
                  key={item.id}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item.id);
                  }}
                  className={`
                    group flex items-center px-3 py-3 text-sm font-medium rounded-xl
                    transition-all duration-200 ease-in-out relative overflow-hidden
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : item.isSpecial 
                        ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' 
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    }
                    ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}
                  `}
                >
                  {/* Hover effect background */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    ${isActive ? 'opacity-100' : ''}
                  `} />
                  
                  {/* Icon */}
                  <Icon 
                    size={20} 
                    className={`
                      relative z-10 transition-transform duration-200
                      ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                      ${isCollapsed ? '' : 'mr-3'}
                    `} 
                  />
                  
                  {/* Label and Badge */}
                  <div className={`
                    relative z-10 flex items-center justify-between flex-1
                    ${isCollapsed ? 'lg:hidden' : ''}
                  `}>
                    <span className="truncate">{item.label}</span>
                    
                    {item.badge && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    
                    {!item.isSpecial && (
                      <ChevronRight 
                        size={16} 
                        className={`
                          ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200
                          ${isActive ? 'opacity-100 translate-x-1' : 'group-hover:translate-x-1'}
                        `} 
                      />
                    )}
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full" />
                  )}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t border-gray-800 ${isCollapsed ? 'lg:px-2' : ''}`}>
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <Bell size={20} className="text-gray-400 hover:text-white transition-colors cursor-pointer" />
            <div className={`${isCollapsed ? 'lg:hidden' : 'flex-1'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Notifications</span>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-gray-900 text-white rounded-md shadow-lg"
      >
        <Menu size={20} />
      </button>
    </>
  );
};

export default Sidebar;