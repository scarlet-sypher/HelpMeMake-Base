import React, { useState } from 'react';

import StatCard from '../../components/user/StatCard';
import SessionCard from '../../components/user/SessionCard';
import MessageCard from '../../components/user/MessageCard';
// import TimelineItem from '../../components/user/TimelineItem';
// import AchievementBadge from '../../components/user/AchievementBadge';
// import MilestonePoint from '../../components/user/MilestonePoint';

import { 
  Calendar, 
  MessageCircle, 
  TrendingUp, 
  Award,
  Github,
  Linkedin,
  Twitter,
  PlayCircle,
  Send,
  BarChart3,
  Clock,
  DollarSign,
  Target,
  Users,
  Zap,
  Activity,
  Flame,
  Menu,
  X,
  Home,
  User,
  Settings,
  LogOut,
  BookOpen,
  Star
} from 'lucide-react';





const TimelineItem = ({ icon: Icon, title, subtitle, color }) => (
  <div className="flex items-center space-x-3">
    <div className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center ${color}`}>
      <Icon size={16} />
    </div>
    <div>
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="text-xs text-blue-300">{subtitle}</p>
    </div>
  </div>
);

const AchievementBadge = ({ title, description, achieved, icon }) => (
  <div className={`p-4 rounded-xl border ${achieved ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30' : 'bg-white/5 border-white/10'}`}>
    <div className="text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-semibold text-white text-sm">{title}</h3>
      <p className="text-xs text-blue-300 mt-1">{description}</p>
    </div>
  </div>
);

const MilestonePoint = ({ title, userVerified, mentorVerified, index }) => {
  const isCompleted = userVerified && mentorVerified;
  const isPartial = userVerified || mentorVerified;
  
  return (
    <div className="relative z-10 flex flex-col items-center">
      <div className={`w-4 h-4 rounded-full border-2 ${
        isCompleted ? 'bg-emerald-500 border-emerald-500' : 
        isPartial ? 'bg-yellow-500 border-yellow-500' : 
        'bg-white/20 border-white/40'
      }`}></div>
      <span className="text-xs text-white mt-2 text-center">{title}</span>
    </div>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: User, label: 'Profile' },
    { icon: BookOpen, label: 'Sessions' },
    { icon: MessageCircle, label: 'Messages' },
    { icon: Star, label: 'Achievements' },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Settings, label: 'Settings' },
  ];

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
            <h2 className="text-xl font-bold text-white">MentorShip</h2>
            <button 
              onClick={toggleSidebar}
              className="lg:hidden text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  item.active 
                    ? 'bg-blue-600/50 text-white border border-blue-400/30' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </a>
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

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const userStats = [
    { icon: Users, label: 'Active Projects', value: '8', change: '+2 this week', color: 'from-blue-500 to-cyan-500' },
    { icon: Calendar, label: 'Sessions Scheduled', value: '12', change: '+3 this month', color: 'from-purple-500 to-pink-500' },
    { icon: DollarSign, label: 'Total Earnings', value: '₹45,000', change: '+15% this month', color: 'from-emerald-500 to-teal-500' },
    { icon: Target, label: 'Completion Rate', value: '92%', change: '+5% this week', color: 'from-orange-500 to-red-500' }
  ];

  const upcomingSessions = [
    {
      id: 1,
      mentorName: 'Dracule Mihawk',
      mentorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      sessionTitle: 'Advanced Sword Techniques',
      date: 'Today',
      time: '3:00 PM',
      duration: '1 hour',
      status: 'confirmed',
      statusColor: 'bg-emerald-500'
    },
    {
      id: 2,
      mentorName: 'Nico Robin',
      mentorImage: 'https://images.unsplash.com/photo-1494790108755-2616b45e1b5e?w=150&h=150&fit=crop&crop=face',
      sessionTitle: 'Ancient History Research',
      date: 'Tomorrow',
      time: '10:00 AM',
      duration: '2 hours',
      status: 'pending',
      statusColor: 'bg-yellow-500'
    },
    {
      id: 3,
      mentorName: 'Silvers Rayleigh',
      mentorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      sessionTitle: 'Haki Training Fundamentals',
      date: 'Dec 22',
      time: '2:00 PM',
      duration: '3 hours',
      status: 'confirmed',
      statusColor: 'bg-emerald-500'
    }
  ];

  const recentMessages = [
    {
      id: 1,
      senderName: 'Boa Hancock',
      senderImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      message: 'Great progress on your project! The design looks amazing.',
      timestamp: '2 mins ago'
    },
    {
      id: 2,
      senderName: 'Marco the Phoenix',
      senderImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      message: 'Ready for tomorrow\'s healing techniques session?',
      timestamp: '1 hour ago'
    },
    {
      id: 3,
      senderName: 'Portgas D. Ace',
      senderImage: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face',
      message: 'Don\'t forget to bring your fire safety equipment!',
      timestamp: '3 hours ago'
    }
  ];

  const timelineItems = [
    { id: 1, icon: Award, title: 'Achievement Unlocked: Devil Fruit Master', subtitle: '2 hours ago', color: 'text-yellow-400' },
    { id: 2, icon: Calendar, title: 'New session scheduled with Admiral Kizaru', subtitle: '5 hours ago', color: 'text-blue-400' },
    { id: 3, icon: TrendingUp, title: 'Project "Grand Line Navigation" updated', subtitle: '1 day ago', color: 'text-emerald-400' },
    { id: 4, icon: Users, title: 'Session completed with Trafalgar Law', subtitle: '2 days ago', color: 'text-purple-400' }
  ];

  const achievements = [
    { id: 1, title: 'Pirate King', description: 'Complete 100 sessions successfully', achieved: true, icon: '👑' },
    { id: 2, title: 'Treasure Hunter', description: 'Discover 50 hidden knowledge gems', achieved: true, icon: '💎' },
    { id: 3, title: 'Fleet Admiral', description: 'Mentor 10 other crew members', achieved: false, icon: '⚓' },
    { id: 4, title: 'Devil Fruit Master', description: 'Master 5 different skill areas', achieved: true, icon: '🌟' }
  ];

  const milestones = [
    { id: 1, title: "Initial Meeting", userVerified: true, mentorVerified: true },
    { id: 2, title: "Requirements Finalized", userVerified: true, mentorVerified: false },
    { id: 3, title: "Mid Review", userVerified: false, mentorVerified: false },
    { id: 4, title: "Final Submission", userVerified: false, mentorVerified: false },
    { id: 5, title: "Project Delivery", userVerified: false, mentorVerified: false }
  ];

  const quickActions = [
    { icon: Calendar, label: 'Schedule Session', color: 'from-blue-500 to-cyan-500' },
    { icon: PlayCircle, label: 'Start Adventure', color: 'from-purple-500 to-pink-500' },
    { icon: Send, label: 'Send Message', color: 'from-emerald-500 to-teal-500' },
    { icon: BarChart3, label: 'View Analytics', color: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={toggleSidebar}
              className="text-white hover:text-gray-300"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 p-4 lg:p-6 space-y-6">
          
          {/* Hero Profile Section */}
          <div className="bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-sm rounded-3xl p-6 lg:p-8 text-white border border-white/20 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face" 
                  alt="Profile" 
                  className="w-24 h-24 lg:w-28 lg:h-28 rounded-full border-4 border-white/30 shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white/50 animate-pulse"></div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Monkey D. Luffy
                </h1>
                <p className="text-lg lg:text-xl text-blue-200 mt-1">Future Pirate King</p>
                <p className="text-sm text-blue-300 mt-2 max-w-lg">
                  Ready to conquer the Grand Line with knowledge and determination!
                </p>
                <div className="flex items-center justify-center lg:justify-start space-x-4 mt-4">
                  <a href="#" className="text-white hover:text-blue-200 transition-colors transform hover:scale-110">
                    <Linkedin size={20} />
                  </a>
                  <a href="#" className="text-white hover:text-gray-200 transition-colors transform hover:scale-110">
                    <Github size={20} />
                  </a>
                  <a href="#" className="text-white hover:text-blue-200 transition-colors transform hover:scale-110">
                    <Twitter size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
            {userStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Zap className="mr-2 text-yellow-400" size={24} />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`p-4 lg:p-6 rounded-2xl bg-gradient-to-r ${action.color} text-white hover:shadow-xl transform hover:scale-105 transition-all duration-300 group`}
                >
                  <action.icon size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium block">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Upcoming Sessions */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Clock className="mr-2 text-blue-400" size={20} />
                    Upcoming Sessions
                  </h2>
                  <Activity className="text-blue-400 animate-pulse" size={20} />
                </div>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <SessionCard key={session.id} {...session} />
                  ))}
                </div>
              </div>

              {/* Project Milestone Tracker */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Target className="mr-2 text-purple-400" size={20} />
                  Project Milestone Tracker
                </h2>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-blue-200">Current Project: Grand Line Navigation System</span>
                  <span className="text-sm font-medium text-purple-400">40% Complete</span>
                </div>
                <div className="flex items-center justify-between relative mb-4">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 -translate-y-1/2"></div>
                  {milestones.map((milestone, index) => (
                    <MilestonePoint key={milestone.id} {...milestone} index={index} />
                  ))}
                </div>
              </div>

              {/* Grand Line Journey */}
              <div className="bg-gradient-to-r from-orange-500/30 to-red-500/30 backdrop-blur-sm rounded-3xl p-6 text-white border border-white/20 shadow-2xl">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Flame className="mr-2 text-orange-400" size={20} />
                  Your Grand Line Journey
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white">Monthly Goals Progress</span>
                      <span className="font-bold text-orange-200">85%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div className="bg-gradient-to-r from-orange-400 to-red-400 h-3 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="text-center bg-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-orange-200">12</div>
                      <div className="text-sm text-orange-300">Goals Completed</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-orange-200">47</div>
                      <div className="text-sm text-orange-300">Treasures Found</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Recent Messages */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <MessageCircle className="mr-2 text-green-400" size={20} />
                    Recent Messages
                  </h2>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <MessageCard key={message.id} {...message} />
                  ))}
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <TrendingUp className="mr-2 text-yellow-400" size={20} />
                  Activity Timeline
                </h2>
                <div className="space-y-4">
                  {timelineItems.map((item) => (
                    <TimelineItem key={item.id} {...item} />
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Award className="mr-2 text-purple-400" size={20} />
                  Achievements
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <AchievementBadge key={achievement.id} {...achievement} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;