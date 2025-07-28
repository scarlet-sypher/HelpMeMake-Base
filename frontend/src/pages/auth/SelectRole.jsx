import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, ArrowRight, CheckCircle, Sparkles, Code, Zap } from "lucide-react";

const SelectRole = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verify user is authenticated and get user info
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:8000/auth/user", {
          method: "GET",
          credentials: "include", // Include cookies
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          
          // If user already has a role, redirect them
          if (data.user.role) {
            const dashboardUrl = data.user.role === 'mentor' ? '/mentordashboard' : '/userdashboard';
            navigate(dashboardUrl, { replace: true });
            return;
          }
        } else {
          // User not authenticated, redirect to login
          navigate("/login", { replace: true });
          return;
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        navigate("/login", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleRoleSubmit = async () => {
    if (!selectedRole) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/auth/set-role", {
        method: "POST",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Redirect to appropriate dashboard
        const dashboardUrl = selectedRole === 'mentor' ? '/mentordashboard' : '/userdashboard';
        navigate(dashboardUrl, { replace: true });
      } else {
        console.error("Error setting role:", data.message);
        alert(data.message || "Failed to set role. Please try again.");
      }
    } catch (error) {
      console.error("Error setting role:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 w-full max-w-4xl border border-slate-700/50">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
                  HelpMeMake
                </h1>
                <p className="text-sm text-slate-400">Choose Your Path</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                Welcome, {user?.name || user?.email?.split('@')[0]}! 👋
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                To get started, please select your role. This will customize your experience and connect you with the right community.
              </p>
            </div>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            
            {/* User Role Card */}
            <div
              onClick={() => setSelectedRole("user")}
              className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedRole === "user"
                  ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                  : "border-slate-600 bg-slate-800/40 hover:border-emerald-400/50 hover:bg-slate-800/60"
              }`}
            >
              {/* Selection Indicator */}
              {selectedRole === "user" && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
              )}

              <div className="space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">I'm a Learner</h3>
                  <p className="text-slate-300 leading-relaxed mb-6">
                    I want to learn new skills, get mentorship, and build amazing projects with guidance from experienced developers.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>Connect with mentors</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>Join learning projects</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>Access learning resources</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>Build your portfolio</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mentor Role Card */}
            <div
              onClick={() => setSelectedRole("mentor")}
              className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedRole === "mentor"
                  ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                  : "border-slate-600 bg-slate-800/40 hover:border-purple-400/50 hover:bg-slate-800/60"
              }`}
            >
              {/* Selection Indicator */}
              {selectedRole === "mentor" && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="w-8 h-8 text-purple-400" />
                </div>
              )}

              <div className="space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">I'm a Mentor</h3>
                  <p className="text-slate-300 leading-relaxed mb-6">
                    I want to share my knowledge, guide aspiring developers, and help others grow in their coding journey.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Guide learners</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Create learning content</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Lead projects</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Build your reputation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={handleRoleSubmit}
              disabled={!selectedRole || isSubmitting}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                selectedRole && !isSubmitting
                  ? "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white hover:scale-105 shadow-lg hover:shadow-xl"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
              } disabled:opacity-50`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Setting up your account...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  Continue to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>

            {!selectedRole && (
              <p className="text-slate-400 text-sm mt-4">
                Please select a role to continue
              </p>
            )}
          </div>

          {/* Role Comparison */}
          <div className="mt-12 pt-8 border-t border-slate-700/50">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Not sure which role fits you?</h3>
              <p className="text-slate-400">Here's a quick comparison to help you decide</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="bg-slate-800/40 rounded-xl p-6">
                <h4 className="font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Choose Learner if you:
                </h4>
                <ul className="space-y-2 text-slate-300">
                  <li>• Are new to programming or want to learn new technologies</li>
                  <li>• Need guidance and mentorship</li>
                  <li>• Want to participate in guided projects</li>
                  <li>• Are looking to build your first portfolio</li>
                </ul>
              </div>

              <div className="bg-slate-800/40 rounded-xl p-6">
                <h4 className="font-semibold text-purple-400 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Choose Mentor if you:
                </h4>
                <ul className="space-y-2 text-slate-300">
                  <li>• Have 2+ years of development experience</li>
                  <li>• Enjoy teaching and helping others</li>
                  <li>• Want to lead projects and create content</li>
                  <li>• Are looking to give back to the community</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-slate-400 text-sm">
                💡 Don't worry! You can always change your role later in your profile settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;