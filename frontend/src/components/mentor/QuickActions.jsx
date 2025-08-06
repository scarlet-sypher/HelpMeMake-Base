import React from 'react';
import {
  Calendar,
  Users,
  Send,
  BarChart3,
  Zap,
  Settings,
  BookOpen,
  DollarSign
} from 'lucide-react';

const QuickActions = () => {
  const quickActions = [
    { 
  icon: Calendar, 
  label: 'Schedule Session', 
  color: 'from-rose-500 to-pink-600',
  description: 'Book new mentoring sessions'
},
{ 
  icon: Users, 
  label: 'View Students', 
  color: 'from-indigo-500 to-violet-600',
  description: 'Manage your mentees'
},
{ 
  icon: Send, 
  label: 'Send Message', 
  color: 'from-amber-500 to-orange-600',
  description: 'Connect with students'
},
{ 
  icon: BarChart3, 
  label: 'View Analytics', 
  color: 'from-green-500 to-lime-600',
  description: 'Track your progress'
}

  ];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-400/10 rounded-full blur-xl animate-pulse delay-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Zap className="mr-2 text-cyan-400" size={24} />
            Quick Actions
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <span className="text-sm text-cyan-300 font-medium">Ready to Mentor</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`group relative p-4 lg:p-6 rounded-2xl bg-gradient-to-r ${action.color} text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden border border-white/10 hover:border-white/20`}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/10">
                  <action.icon size={24} className="group-hover:scale-110 transition-transform duration-200" />
                </div>
                <span className="text-sm font-medium text-center leading-tight">{action.label}</span>
                
                {/* Action indicator */}
                <div className="mt-2 w-8 h-0.5 bg-white/40 rounded-full group-hover:bg-white/60 transition-colors"></div>
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
             
            </button>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default QuickActions;