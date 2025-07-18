import React from 'react';
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
  Code
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, activeItem, setActiveItem }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard' },
    { icon: Folder, label: 'Projects', id: 'projects' },
    { icon: BookOpen, label: 'Sessions', id: 'sessions' },
    { icon: MessageCircle, label: 'Messages', id: 'messages' },
    { icon: Star, label: 'Achievements', id: 'achievements' },
    { icon: BarChart3, label: 'Analytics', id: 'analytics' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

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
      <div className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 border-r border-white/10 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
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
                onClick={() => handleItemClick(item.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left ${
                  activeItem === item.id 
                    ? 'bg-blue-600/50 text-white border border-blue-400/30 shadow-lg' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon 
                  size={20} 
                  className={`${activeItem === item.id ? 'text-blue-300' : ''}`} 
                />
                <span className="font-medium">{item.label}</span>
                {activeItem === item.id && (
                  <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 w-full">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;