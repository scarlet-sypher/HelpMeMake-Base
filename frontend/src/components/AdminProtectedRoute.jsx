import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem("admin_token");

      if (!adminToken) {
        setIsAdminAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Verify admin token with backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/me`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsAdminAuthenticated(true);
      } else {
        // Token is invalid or expired
        localStorage.removeItem("admin_token");
        setIsAdminAuthenticated(false);
      }
    } catch (error) {
      console.error("Admin auth check failed:", error);
      localStorage.removeItem("admin_token");
      setIsAdminAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
