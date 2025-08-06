import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Folder,
  Settings,
  LogOut,
  BookOpen,
  Star,
  MessageCircle,
  BarChart3,
  X,
  Code,
  Target,
  Users,
  Calendar
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, activeItem, setActiveItem, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth(); // Move user here from useAuth

  const menuItems = userRole === 'mentor' ? [
    { icon: Home, label: 'Dashboard', id: 'dashboard', path: '/mentordashboard' },
    { icon: Users, label: 'My Apprentice', id: 'students', path: '/mentor/students' },
    { icon: Calendar, label: 'Sessions', id: 'sessions', path: '/mentor/sessions' },
    { icon: MessageCircle, label: 'Messages', id: 'messages', path: '/mentor/messages' },
    { icon: BarChart3, label: 'Analytics', id: 'analytics', path: '/mentor/analytics' },
    { icon: Settings, label: 'Settings', id: 'settings', path: '/mentor/settings' },
  ] : [
    { icon: Home, label: 'Dashboard', id: 'dashboard', path: '/userdashboard' },
    { icon: Folder, label: 'Projects', id: 'projects', path: '/user/projects' },
    { icon: Users, label: 'My Mentor', id: 'students', path: '/mentor/mentors' },
    { icon: BookOpen, label: 'Sessions', id: 'sessions', path: '/user/sessions' },
    { icon: Target, label: 'Milestones', id: 'milestones', path: '/milestone-page' },
    { icon: MessageCircle, label: 'Messages', id: 'messages', path: '/user/messages' },
    { icon: Star, label: 'Achievements', id: 'achievements', path: '/user/achievements' },
    { icon: BarChart3, label: 'Analytics', id: 'analytics', path: '/user/analytics' },
    { icon: Settings, label: 'Settings', id: 'settings', path: '/user/settings' },
  ];

  const themeColor = userRole === 'mentor' ? 'from-fuchsia-500 to-purple-500' : 'from-blue-500 to-purple-500';

  const handleItemClick = (itemId, path) => {
    setActiveItem(itemId);
    
    // Navigate to the specified path
    if (path) {
      navigate(path);
    }
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const handleLogout = () => {
    logout(); 
  };

  // Auto-detect active item based on current path
  React.useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.path === currentPath);
    if (currentItem && activeItem !== currentItem.id) {
      setActiveItem(currentItem.id);
    }
  }, [location.pathname, activeItem, setActiveItem]);

  const activeColorClass = userRole === 'mentor' 
    ? 'bg-fuchsia-600/50 text-white border border-fuchsia-400/30 shadow-lg'
    : 'bg-blue-600/50 text-white border border-blue-400/30 shadow-lg';

  const activeIconColor = userRole === 'mentor' ? 'text-fuchsia-300' : 'text-blue-300';
  const activeDotColor = userRole === 'mentor' ? 'bg-fuchsia-400' : 'bg-blue-400';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b ${
        userRole === 'mentor' 
          ? 'from-slate-900 via-fuchsia-900 to-purple-900' 
          : 'from-slate-900 via-blue-900 to-indigo-900'
      } border-r border-white/10 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 bg-gradient-to-r ${themeColor} rounded-lg flex items-center justify-center`}>
                <Code size={18} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">HelpMeMake</h2>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id, item.path)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left ${
                  activeItem === item.id
                    ? activeColorClass
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon
                  size={20}
                  className={`${activeItem === item.id ? activeIconColor : ''}`}
                />
                <span className="font-medium">{item.label}</span>
                {activeItem === item.id && (
                  <div className={`ml-auto w-2 h-2 ${activeDotColor} rounded-full animate-pulse`}></div>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 w-full"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;