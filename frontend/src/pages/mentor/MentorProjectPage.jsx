import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/user/Sidebar';
import { 
  Search, 
  Filter, 
  Menu, 
  Folders,
  AlertCircle,
  Loader2,
  SortAsc,
  SortDesc,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Award,
  Eye,
  MessageSquare
} from 'lucide-react';

const MentorProjectPage = () => {
  const { user, loading, isAuthenticated } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('projects');
  
  // Projects state
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mentor stats
  const [mentorStats, setMentorStats] = useState({
    totalApplications: 0,
    acceptedApplications: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalEarnings: 0,
    successRate: 0
  });
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt'); 
  const [sortOrder, setSortOrder] = useState('desc'); 
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  
  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role !== 'mentor') {
      window.location.href = '/login';
    }
  }, [loading, isAuthenticated, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownOpen) {
        const dropdown = event.target.closest('.filter-dropdown-container');
        if (!dropdown) {
          setFilterDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterDropdownOpen]);

  useEffect(() => {
    const fetchProjectsAndStats = async () => {
      if (isAuthenticated && user?.role === 'mentor') {
        try {
          setProjectsLoading(true);
          setError(null);
          
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const token = localStorage.getItem('access_token');
          
          // Fetch projects for mentors
          const projectsResponse = await fetch(`${apiUrl}/projects/mentor/available`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          const projectsData = await projectsResponse.json();
          
          if (projectsData.success) {
            setProjects(projectsData.projects);
            setFilteredProjects(projectsData.projects);
          } else {
            setError(projectsData.message || 'Failed to fetch projects');
          }

          // Fetch mentor stats
          const statsResponse = await fetch(`${apiUrl}/mentor/application-stats`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          const statsData = await statsResponse.json();
          if (statsData.success) {
            setMentorStats(statsData.stats);
          }
          
        } catch (error) {
          console.error('Error fetching data:', error);
          setError(error.message || 'Failed to fetch data');
        } finally {
          setProjectsLoading(false);
        }
      }
    };

    fetchProjectsAndStats();
  }, [isAuthenticated, user]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => {
        const name = project.name || '';
        const shortDescription = project.shortDescription || '';
        const techStack = Array.isArray(project.techStack) ? project.techStack : [];
        
        return name.toLowerCase().includes(query) ||
               shortDescription.toLowerCase().includes(query) ||
               techStack.some(tech => tech.toLowerCase().includes(query));
      });
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Apply difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter(project => project.difficultyLevel === selectedDifficulty);
    }

    // Apply price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(project => {
        const price = project.openingPrice || 0;
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case 'price':
          comparison = (a.openingPrice || 0) - (b.openingPrice || 0);
          break;
        case 'applications':
          comparison = (a.applicationsCount || 0) - (b.applicationsCount || 0);
          break;
        default:
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredProjects(filtered);
  }, [projects, searchQuery, sortBy, sortOrder, selectedCategory, selectedDifficulty, priceRange]);

  // Show loading spinner
  if (loading || projectsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-lg">Loading projects...</span>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or not a mentor
  if (!isAuthenticated || user?.role !== 'mentor') {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const categories = [
    'Web Development', 'Mobile Development', 'AI/Machine Learning', 
    'Data Science', 'DevOps', 'Blockchain', 'IoT', 'Game Development',
    'Desktop Applications', 'API Development', 'Database Design', 
    'UI/UX Design', 'Cybersecurity', 'Cloud Computing', 'Other'
  ];

  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedDifficulty('');
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        userRole="mentor"
      />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-gray-900/80 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={toggleSidebar}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-white">Available Projects</h1>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 p-4 lg:p-6 space-y-6">
          
          {/* Header Section with Mentor Stats */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center mb-2">
                    <Target className="mr-3 text-cyan-400" size={28} />
                    Available Projects
                  </h1>
                  <p className="text-cyan-200">Find and apply to learning projects that match your expertise</p>
                </div>
              </div>
              
              {/* Mentor Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="text-center bg-white/10 rounded-xl p-3 border border-white/20">
                  <div className="text-lg font-bold text-cyan-400">{projects.length}</div>
                  <div className="text-xs text-cyan-300">Available</div>
                </div>
                <div className="text-center bg-white/10 rounded-xl p-3 border border-white/20">
                  <div className="text-lg font-bold text-yellow-400">{mentorStats.totalApplications}</div>
                  <div className="text-xs text-yellow-300">Applied</div>
                </div>
                <div className="text-center bg-white/10 rounded-xl p-3 border border-white/20">
                  <div className="text-lg font-bold text-emerald-400">{mentorStats.acceptedApplications}</div>
                  <div className="text-xs text-emerald-300">Accepted</div>
                </div>
                <div className="text-center bg-white/10 rounded-xl p-3 border border-white/20">
                  <div className="text-lg font-bold text-blue-400">{mentorStats.activeProjects}</div>
                  <div className="text-xs text-blue-300">Active</div>
                </div>
                <div className="text-center bg-white/10 rounded-xl p-3 border border-white/20">
                  <div className="text-lg font-bold text-green-400">{mentorStats.completedProjects}</div>
                  <div className="text-xs text-green-300">Completed</div>
                </div>
                <div className="text-center bg-white/10 rounded-xl p-3 border border-white/20">
                  <div className="text-lg font-bold text-purple-400">{mentorStats.successRate}%</div>
                  <div className="text-xs text-purple-300">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative z-[9999]">
            <div className="flex flex-col space-y-4">
              
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-300" size={20} />
                <input
                  type="text"
                  placeholder="Search projects by name, description, or tech stack..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-cyan-300 focus:outline-none focus:border-cyan-400 focus:bg-white/15 transition-all duration-200"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-4">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="text-gray-800">
                      {category}
                    </option>
                  ))}
                </select>

                {/* Difficulty Filter */}
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">All Levels</option>
                  {difficultyLevels.map(level => (
                    <option key={level} value={level} className="text-gray-800">
                      {level}
                    </option>
                  ))}
                </select>

                {/* Price Range */}
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-24 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-cyan-300 focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-white">-</span>
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-24 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-cyan-300 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="relative filter-dropdown-container">
                  <button
                    onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
                  >
                    <Filter size={16} />
                    <span>Sort</span>
                    {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                  </button>

                  {filterDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-800 rounded-2xl shadow-2xl border border-cyan-400/30 overflow-hidden z-[9999]">
                      <div className="py-2">
                        <div className="px-4 py-2 text-sm font-medium text-cyan-200 border-b border-white/20">
                          Sort by:
                        </div>
                        {[
                          { value: 'createdAt', label: 'Date Created', icon: Calendar },
                          { value: 'name', label: 'Project Name', icon: Folders },
                          { value: 'price', label: 'Price', icon: DollarSign },
                          { value: 'applications', label: 'Applications', icon: Users }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setFilterDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gradient-to-r hover:from-cyan-600/30 hover:to-teal-600/30 transition-colors flex items-center space-x-2 ${
                              sortBy === option.value ? 'text-cyan-300 bg-gradient-to-r from-cyan-600/20 to-teal-600/20' : 'text-white'
                            }`}
                          >
                            <option.icon size={14} />
                            <span>{option.label}</span>
                          </button>
                        ))}
                        <div className="border-t border-cyan-400/30 mt-2 pt-2">
                          <button
                            onClick={() => {
                              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                              setFilterDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gradient-to-r hover:from-cyan-600/30 hover:to-teal-600/30 transition-colors flex items-center space-x-2"
                          >
                            {sortOrder === 'asc' ? <SortDesc size={14} /> : <SortAsc size={14} />}
                            <span>{sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/20"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="relative z-10">
            {error ? (
              <div className="bg-red-500/20 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-red-500/30 text-center">
                <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
                <h3 className="text-xl font-bold text-red-300 mb-2">Error Loading Projects</h3>
                <p className="text-red-200">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20 text-center">
                <Target className="mx-auto mb-6 text-cyan-400" size={64} />
                <h3 className="text-2xl font-bold text-white mb-4">
                  {searchQuery || selectedCategory || selectedDifficulty || priceRange.min || priceRange.max
                    ? 'No projects match your filters'
                    : 'No projects available'
                  }
                </h3>
                <p className="text-cyan-200 mb-6">
                  {projects.length === 0 
                    ? "There are currently no open projects in the database."
                    : "Try adjusting your search criteria or filters."
                  }
                </p>
                {(searchQuery || selectedCategory || selectedDifficulty || priceRange.min || priceRange.max) && (
                  <button
                    onClick={clearFilters}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-2xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div key={project._id} className="group">
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-cyan-500/25 hover:border-cyan-400/50 hover:scale-105">
                      
                      {/* Project Thumbnail */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={project.thumbnail || '/uploads/public/default-project.jpg'} 
                          alt={project.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = '/uploads/public/default-project.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        
                        {/* Price Badge */}
                        <div className="absolute top-4 right-4">
                          <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            ₹{project.openingPrice?.toLocaleString() || 0}
                          </div>
                        </div>
                        
                        {/* Difficulty Badge */}
                        <div className="absolute top-4 left-4">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.difficultyLevel === 'Beginner' ? 'bg-green-500/80 text-green-100' :
                            project.difficultyLevel === 'Intermediate' ? 'bg-yellow-500/80 text-yellow-100' :
                            'bg-red-500/80 text-red-100'
                          }`}>
                            {project.difficultyLevel}
                          </div>
                        </div>
                      </div>

                      {/* Project Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                            {project.name}
                          </h3>
                          <div className="flex items-center text-gray-400 text-sm ml-2">
                            <Eye size={14} className="mr-1" />
                            {project.viewCount || 0}
                          </div>
                        </div>

                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                          {project.shortDescription}
                        </p>

                        {/* Category & Duration */}
                        <div className="flex items-center justify-between mb-4 text-sm">
                          <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-lg">
                            {project.category}
                          </span>
                          <span className="text-gray-400 flex items-center">
                            <Clock size={14} className="mr-1" />
                            {project.duration}
                          </span>
                        </div>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(project.techStack || []).slice(0, 3).map((tech, index) => (
                            <span key={index} className="bg-white/10 text-white px-2 py-1 rounded text-xs">
                              {tech}
                            </span>
                          ))}
                          {project.techStack?.length > 3 && (
                            <span className="text-gray-400 text-xs px-2 py-1">
                              +{project.techStack.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Project Meta */}
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                          <div className="flex items-center">
                            <Users size={14} className="mr-1" />
                            {project.applicationsCount || 0} applications
                          </div>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.location.href = `/mentor/project/${project._id}`}
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white py-2 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              // Handle quick apply
                              showToast('Apply functionality coming soon!', 'info');
                            }}
                            className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-xl font-medium transition-all duration-200 border border-white/20 hover:border-cyan-400/50"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl backdrop-blur-sm border transition-all duration-300 transform ${
          toast.type === 'success' 
            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' 
            : toast.type === 'info'
            ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
            : 'bg-red-500/20 border-red-500/30 text-red-300'
        }`}>
          <div className="flex items-center space-x-2">
            {toast.type === 'success' ? (
              <CheckCircle2 size={20} />
            ) : toast.type === 'info' ? (
              <MessageSquare size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorProjectPage;