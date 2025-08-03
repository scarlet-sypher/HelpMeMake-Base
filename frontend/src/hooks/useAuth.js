import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
  try {
    // Debug: Log all cookies
    console.log('All cookies:', document.cookie);
    
    // Debug: Check referrer
    console.log('Document referrer:', document.referrer);
    console.log('Current URL:', window.location.href);
    
    // Check if this is an OAuth redirect and add delay
    const isFromOAuth = document.referrer.includes('accounts.google.com') || 
                       document.referrer.includes('github.com') ||
                       window.location.search.includes('newPassword');
    
    if (isFromOAuth) {
      console.log('Detected OAuth redirect, adding delay...');
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    console.log('Making auth request to:', `${import.meta.env.VITE_API_URL}/auth/user`);
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/user`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Auth response status:', response.status);
    console.log('Auth response headers:', [...response.headers.entries()]);

    if (response.ok) {
      const data = await response.json();
      console.log('Auth success:', data);
      setUser(data.user);
      setIsAuthenticated(true);
    } else {
      console.log('Auth check failed with status:', response.status);
      const errorText = await response.text();
      console.log('Error response:', errorText);
      setUser(null);
      setIsAuthenticated(false);
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    setUser(null);
    setIsAuthenticated(false);
  } finally {
    setLoading(false);
  }
};

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { user, loading, isAuthenticated, logout, refetch: checkAuth };
};