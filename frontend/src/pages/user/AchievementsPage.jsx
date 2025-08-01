import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AchievementBadge from '../../components/user/AchievementBadge';
import Sidebar from '../../components/user/Sidebar';
import { 
  Award,
  Star,
  Filter,
  Trophy,
  Target,
  Zap,
  Crown,
  Search,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle,
  Lock,
  Menu,
  Sparkles,
  Medal,
  Gift,
  Activity
} from 'lucide-react';

// Add custom styles for scrollbar hiding
const customStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

const AchievementsPage = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('achievements');
  const [achievements, setAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [achievementStats, setAchievementStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All Achievements', icon: Trophy },
    { id: 'achieved', label: 'Unlocked', icon: CheckCircle },
    { id: 'locked', label: 'Locked', icon: Lock },
    { id: 'in-progress', label: 'In Progress', icon: Activity }
  ];

  const categoryOptions = [
    { id: 'all', label: 'All Categories', icon: Trophy },
    { id: 'projects', label: 'Projects', icon: Target },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'learning', label: 'Learning', icon: Award },
    { id: 'milestones', label: 'Milestones', icon: Star }
  ];

  const rarityOptions = [
    { id: 'common', label: 'Common', color: 'text-blue-400' },
    { id: 'rare', label: 'Rare', color: 'text-purple-400' },
    { id: 'epic', label: 'Epic', color: 'text-orange-400' },
    { id: 'legendary', label: 'Legendary', color: 'text-yellow-400' }
  ];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [loading, isAuthenticated]);

  // Fetch achievements and stats
  useEffect(() => {
    const fetchAchievements = async () => {
      if (isAuthenticated) {
        try {
          setAchievementsLoading(true);
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          
          // Fetch achievements
          const achievementsResponse = await fetch(`${apiUrl}/api/achievements`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (achievementsResponse.ok) {
            const achievementsData = await achievementsResponse.json();
            if (achievementsData.success) {
              setAchievements(achievementsData.data);
            }
          }

          // Fetch achievement stats
          const statsResponse = await fetch(`${apiUrl}/api/achievements/stats/summary`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            if (statsData.success) {
              setAchievementStats(statsData.data);
            }
          }

        } catch (error) {
          console.error('Error fetching achievements:', error);
        } finally {
          setAchievementsLoading(false);
        }
      }
    };

    fetchAchievements();
  }, [isAuthenticated]);

  // Filter achievements based on search and filters
  const filteredAchievements = achievements.filter(achievement => {
    // Search filter
    if (searchTerm && !achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) 
        && !achievement.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Status filter
    if (selectedFilter === 'achieved' && !achievement.achieved) return false;
    if (selectedFilter === 'locked' && achievement.achieved) return false;
    if (selectedFilter === 'in-progress' && (achievement.achieved || achievement.progressPercentage === 0)) return false;

    // Category filter
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) return false;

    return true;
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading || achievementsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center w-full overflow-hidden">
        <div className="text-white text-lg">Loading achievements...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex w-full overflow-x-hidden">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar} 
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
        
        {/* Main Content */}
        <div className="flex-1 w-full min-w-0 lg:ml-64">
          {/* Mobile Header */}
          <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={toggleSidebar}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-white">Achievements</h1>
              <div className="w-6"></div>
            </div>
          </div>

          {/* Animated background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div className="relative z-10 p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 w-full">
            
            {/* Hero Section */}
            <div className="relative group w-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-gradient-to-r from-yellow-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-yellow-400/30 w-full">
                <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl sm:rounded-2xl">
                      <Trophy className="text-white" size={24} />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                        🏆 Your Achievements
                      </h1>
                      <p className="text-yellow-200 text-sm sm:text-base lg:text-lg">
                        Track your progress and unlock new badges
                      </p>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  {achievementStats && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full max-w-4xl">
                      <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
                        <div className="text-lg sm:text-2xl font-bold text-yellow-200">{achievementStats.achieved}</div>
                        <div className="text-xs sm:text-sm text-yellow-300">Unlocked</div>
                      </div>
                      <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
                        <div className="text-lg sm:text-2xl font-bold text-orange-200">{achievementStats.total}</div>
                        <div className="text-xs sm:text-sm text-orange-300">Total</div>
                      </div>
                      <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
                        <div className="text-lg sm:text-2xl font-bold text-purple-200">{achievementStats.inProgress}</div>
                        <div className="text-xs sm:text-sm text-purple-300">In Progress</div>
                      </div>
                      <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
                        <div className="text-lg sm:text-2xl font-bold text-emerald-200">{achievementStats.totalXpEarned}</div>
                        <div className="text-xs sm:text-sm text-emerald-300">XP Earned</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rarity Distribution */}
            {achievementStats && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20 w-full">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                  <Crown className="mr-2 text-yellow-400" size={20} />
                  Rarity Collection
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                  {rarityOptions.map((rarity) => (
                    <div key={rarity.id} className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-white/10 hover:border-white/20 transition-all">
                      <div className={`text-xl sm:text-2xl font-bold ${rarity.color} mb-2`}>
                        {achievementStats.byRarity[rarity.id] || 0}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-300 capitalize">{rarity.label}</div>
                      <div className="flex justify-center mt-1 sm:mt-2 space-x-0.5">
                        {[...Array(rarity.id === 'common' ? 1 : rarity.id === 'rare' ? 2 : rarity.id === 'epic' ? 3 : 4)].map((_, i) => (
                          <Star key={i} size={6} className={`${rarity.color} fill-current`} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20 w-full">
              <div className="flex flex-col space-y-3 sm:space-y-4">
                {/* Search */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search achievements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-sm sm:text-base"
                  />
                </div>

                {/* Status Filter */}
                <div className="w-full">
                  <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {filterOptions.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setSelectedFilter(filter.id)}
                        className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all whitespace-nowrap text-xs sm:text-sm flex-shrink-0 ${
                          selectedFilter === filter.id
                            ? 'bg-blue-600/50 text-white border border-blue-400/30'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                        }`}
                      >
                        <filter.icon size={14} />
                        <span className="hidden sm:inline">{filter.label}</span>
                        <span className="sm:hidden">{filter.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="w-full">
                  <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categoryOptions.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all whitespace-nowrap text-xs sm:text-sm flex-shrink-0 ${
                          selectedCategory === category.id
                            ? 'bg-purple-600/50 text-white border border-purple-400/30'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                        }`}
                      >
                        <category.icon size={14} />
                        <span className="hidden sm:inline">{category.label}</span>
                        <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                  <Medal className="mr-2 text-purple-400" size={20} />
                  Achievement Collection
                </h2>
                <div className="flex items-center space-x-2">
                  <Sparkles className="text-yellow-400 animate-pulse" size={14} />
                  <span className="text-xs sm:text-sm text-yellow-300 font-medium">
                    {filteredAchievements.length} of {achievements.length} shown
                  </span>
                </div>
              </div>

              {filteredAchievements.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {filteredAchievements.map((achievement) => (
                    <div key={achievement.id} className="group w-full">
                      <AchievementBadge
                        title={achievement.title}
                        description={achievement.description}
                        achieved={achievement.achieved}
                        icon={achievement.icon}
                        rarity={achievement.rarity}
                        progressPercentage={achievement.progressPercentage}
                      />
                      
                      {/* How to unlock tooltip/info - Hidden on mobile for space */}
                      {!achievement.achieved && (
                        <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg sm:rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
                          <div className="flex items-center mb-1 sm:mb-2">
                            <Target className="text-blue-400 mr-1 sm:mr-2" size={12} />
                            <span className="text-xs font-medium text-blue-200">How to unlock:</span>
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed">
                            {getUnlockInstructions(achievement)}
                          </p>
                          {achievement.progressPercentage > 0 && (
                            <div className="mt-2 flex items-center">
                              <div className="flex-1 bg-white/10 rounded-full h-1.5 mr-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-400 to-purple-400 h-1.5 rounded-full transition-all duration-500"
                                  style={{ width: `${achievement.progressPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-purple-300 font-medium">
                                {achievement.progressPercentage}%
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Mobile-friendly progress indicator */}
                      {!achievement.achieved && achievement.progressPercentage > 0 && (
                        <div className="mt-2 sm:hidden">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-blue-200">Progress</span>
                            <span className="text-xs text-purple-300 font-medium">
                              {achievement.progressPercentage}%
                            </span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-purple-400 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${achievement.progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400" size={24} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No achievements found</h3>
                  <p className="text-gray-400 text-sm sm:text-base mb-4">Try adjusting your search or filter criteria</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedFilter('all');
                      setSelectedCategory('all');
                    }}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold transition-all transform hover:scale-105 text-sm sm:text-base"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Progress Motivation */}
            <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-400/30 w-full">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
                  <TrendingUp className="mr-2 text-emerald-400" size={20} />
                  Keep Going!
                </h3>
                <Gift className="text-emerald-400 animate-bounce" size={20} />
              </div>
              <p className="text-emerald-200 mb-3 sm:mb-4 text-sm sm:text-base">
                You're making great progress! Complete more projects and engage with mentors to unlock new achievements.
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
                <div className="flex items-center bg-white/10 rounded-lg px-2 sm:px-3 py-2">
                  <Calendar className="text-blue-400 mr-2 flex-shrink-0" size={14} />
                  <span className="text-xs sm:text-sm text-blue-200">Schedule more sessions</span>
                </div>
                <div className="flex items-center bg-white/10 rounded-lg px-2 sm:px-3 py-2">
                  <Target className="text-green-400 mr-2 flex-shrink-0" size={14} />
                  <span className="text-xs sm:text-sm text-green-200">Complete project milestones</span>
                </div>
                <div className="flex items-center bg-white/10 rounded-lg px-2 sm:px-3 py-2">
                  <Users className="text-purple-400 mr-2 flex-shrink-0" size={14} />
                  <span className="text-xs sm:text-sm text-purple-200">Connect with new mentors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to generate unlock instructions based on achievement type
const getUnlockInstructions = (achievement) => {
  // This would ideally come from the backend, but we can generate basic instructions
  const instructions = {
    'First Project': 'Create and submit your first project to get started on your learning journey.',
    'Project Master': 'Successfully complete 5 projects with mentor approval to demonstrate your dedication.',
    'Social Butterfly': 'Connect and work with 3 different mentors to expand your network.',
    'Quick Learner': 'Complete your first project within 2 weeks to show your efficiency.',
    'Milestone Achiever': 'Complete all milestones in a single project to show attention to detail.',
    'Streak Master': 'Maintain a 7-day learning streak by engaging with the platform daily.',
    'Session Regular': 'Schedule and complete 10 mentoring sessions to build consistent learning habits.',
    'High Achiever': 'Maintain a 4.5+ average rating across all your completed projects.',
    'Explorer': 'Try projects in 3 different categories to showcase your versatility.',
    'Collaborator': 'Successfully work on 3 group projects with other learners.'
  };

  return instructions[achievement.title] || 
    `Complete the required activities for "${achievement.title}" to unlock this achievement. Check your progress regularly and stay engaged with your learning journey.`;
};

export default AchievementsPage;