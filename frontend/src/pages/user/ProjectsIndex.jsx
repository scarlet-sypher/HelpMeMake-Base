import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ShortProjectCard from '../../components/user/ShortProjectCard';
import Sidebar from '../../components/user/Sidebar';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  Plus, 
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
  Pause
} from 'lucide-react';

const ProjectsIndex = () => {
  const { user, loading, isAuthenticated } = useAuth();
  
  // Debug: Log user object to see available properties
  useEffect(() => {
    if (user) {
      console.log('User object structure:', user);
      console.log('Available user properties:', Object.keys(user));
    }
  }, [user]);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('projects');
  
  // Projects state
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, date, status
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [loading, isAuthenticated]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownOpen) {
        // Check if click is outside the dropdown
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
  const fetchProjects = async () => {
    if (isAuthenticated && user) {
      try {
        setProjectsLoading(true);
        setError(null);
        
        console.log('Fetching projects for authenticated user');
        
        // Use the correct API URL
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Fixed port
        console.log('API URL:', apiUrl);
        
        const token = localStorage.getItem('access_token'); // Get token from localStorage
        
        // Use fetch instead of axios for consistency
        const response = await fetch(`${apiUrl}/projects/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Use Bearer token instead of cookies
          }
        });
        
        const data = await response.json();
              
        if (data.success) {
          setProjects(data.projects);
          setFilteredProjects(data.projects);
        } else {
          setError(data.message || 'Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error.message || 'Failed to fetch projects');
      } finally {
        setProjectsLoading(false);
      }
    }
  };

  fetchProjects();
}, [isAuthenticated, user]);

  // Filter and search logic
 useEffect(() => {
  let filtered = [...projects];

  // Apply search filter safely
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();

    filtered = filtered.filter(project => {
      // Safely check each property with fallbacks
      const title = project?.title || project?.name || '';
      const description = project?.description || project?.shortDescription || '';
      const skills = Array.isArray(project?.skills) ? project.skills : 
                    Array.isArray(project?.techStack) ? project.techStack : [];

      return title.toLowerCase().includes(query) ||
             description.toLowerCase().includes(query) ||
             skills.some(skill => (skill || '').toLowerCase().includes(query));
    });
  }

  // Apply sorting safely
  filtered.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        const titleA = a.title || a.name || '';
        const titleB = b.title || b.name || '';
        comparison = titleA.localeCompare(titleB);
        break;
      case 'date':
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        comparison = dateA - dateB;
        break;
      case 'status':
        const statusA = a.status || '';
        const statusB = b.status || '';
        comparison = statusA.localeCompare(statusB);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  setFilteredProjects(filtered);
}, [projects, searchQuery, sortBy, sortOrder]);






  // Show loading spinner
  if (loading || projectsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-lg">Loading projects...</span>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCreateProject = () => {
    window.location.href = '/user/projects/create';
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle2 size={16} className="text-emerald-400" />;
      case 'in-progress':
        return <Play size={16} className="text-blue-400" />;
      case 'on-hold':
        return <Pause size={16} className="text-yellow-400" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusCount = (status) => {
    return projects.filter(project => project.status === status).length; 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={toggleSidebar}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-white">My Projects</h1>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 p-4 lg:p-6 space-y-6">
          
          {/* Header Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center mb-2">
                    <Folders className="mr-3 text-blue-400" size={28} />
                    My Projects
                  </h1>
                  <p className="text-blue-200">Manage and track all your learning projects</p>
                </div>
                
                {/* Stats Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  <div className="text-center bg-white/10 rounded-xl p-3 border border-white/20">
                    <div className="text-lg font-bold text-blue-400">{projects.length}</div>
                    <div className="text-xs text-blue-300">Total</div>
                  </div>
                  <div className="text-center bg-white/10 rounded-xl p-3 border border-white/20">
                    <div className="text-lg font-bold text-emerald-400">{getStatusCount('Completed')}</div>
                    <div className="text-xs text-emerald-300">Completed</div>
                  </div>
                  <div className="text-center bg-white/10 rounded-xl p-3 border border-white/20">
                    <div className="text-lg font-bold text-yellow-400">{getStatusCount('In Progress')}</div>
                    <div className="text-xs text-yellow-300">In Progress</div>
                  </div>
                  <div className="text-center bg-white/10 rounded-xl p-3 border border-white/20">
                    <div className="text-lg font-bold text-red-400">{getStatusCount('On Hold')}</div>
                    <div className="text-xs text-red-300">On Hold</div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Search and Filter Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative z-[9999]">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
              
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300" size={20} />
                <input
                  type="text"
                  placeholder="Search projects by title, description, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative z-[9999] filter-dropdown-container">
                <button
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Filter size={16} />
                  <span>Sort & Filter</span>
                  {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                </button>

                {/* Dropdown Menu */}
                {filterDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-slate-800 via-blue-800 to-indigo-800 rounded-2xl shadow-2xl border border-blue-400/30 overflow-hidden z-[9999]">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm font-medium text-blue-200 border-b border-white/20">
                        Sort by:
                      </div>
                      {[
                        { value: 'name', label: 'Project Name', icon: Folders },
                        { value: 'date', label: 'Created Date', icon: Calendar },
                        { value: 'status', label: 'Status', icon: CheckCircle2 }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setFilterDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-purple-600/30 transition-colors flex items-center space-x-2 pointer-events-auto ${
                            sortBy === option.value ? 'text-blue-300 bg-gradient-to-r from-blue-600/20 to-purple-600/20' : 'text-white'
                          }`}
                        >
                          <option.icon size={14} />
                          <span>{option.label}</span>
                        </button>
                      ))}
                      <div className="border-t border-blue-400/30 mt-2 pt-2">
                        <button
                          onClick={() => {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                            setFilterDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-purple-600/30 transition-colors flex items-center space-x-2"
                        >
                          {sortOrder === 'asc' ? <SortDesc size={14} /> : <SortAsc size={14} />}
                          <span>{sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
              <Folders className="mx-auto mb-6 text-blue-400" size={64} />
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchQuery || projects.length === 0 ? 'No projects found' : 'No matching projects'}
              </h3>
              <p className="text-blue-200 mb-6">
                {projects.length === 0 
                  ? "Start your learning journey by creating your first project!"
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {projects.length === 0 && (
                <button
                  onClick={handleCreateProject}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  Create Your First Project
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ShortProjectCard 
                  key={project._id} 
                  project={project}
                  onUpdate={() => {
                    // Refresh projects after update
                    window.location.reload();
                  }}
                  onDelete={() => {
                    showToast('Project deleted successfully', 'success');
                    // Remove from state
                    setProjects(projects.filter(p => p._id !== project._id));
                  }}
                />
              ))}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={handleCreateProject}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 z-50 flex items-center justify-center group"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl backdrop-blur-sm border transition-all duration-300 transform ${
          toast.type === 'success' 
            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' 
            : 'bg-red-500/20 border-red-500/30 text-red-300'
        }`}>
          <div className="flex items-center space-x-2">
            {toast.type === 'success' ? (
              <CheckCircle2 size={20} />
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

export default ProjectsIndex;