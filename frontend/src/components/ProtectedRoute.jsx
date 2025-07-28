import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, requiredRole = null, redirectTo = '/login' }) => {
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        window.location.href = redirectTo;
        return;
      }

      if (!user.role) {
        window.location.href = '/select-role';
        return;
      }

      if (requiredRole && user.role !== requiredRole) {
        const dashboardMap = {
          user: '/userdashboard',
          mentor: '/mentordashboard',
          admin: '/admindashboard'
        };
        window.location.href = dashboardMap[user.role] || '/login';
        return;
      }
    }
  }, [loading, isAuthenticated, user, requiredRole, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null; // Redirect will happen in useEffect
  }

  return children;
};

export default ProtectedRoute;