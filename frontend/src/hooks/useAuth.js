import { useState, useEffect } from "react";

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
      console.log("All cookies:", document.cookie);

      // Debug: Check referrer and URL
      console.log("Document referrer:", document.referrer);
      console.log("Current URL:", window.location.href);

      const isFromOAuth =
        document.referrer.includes("accounts.google.com") ||
        document.referrer.includes("github.com") ||
        window.location.search.includes("newPassword");

      if (isFromOAuth) {
        console.log("Detected OAuth redirect, adding delay...");
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("authToken") || urlParams.get("token");

      console.log("URL search params:", window.location.search);
      console.log("URL token found:", urlToken ? "Yes" : "No");

      let token = urlToken || localStorage.getItem("access_token");

      if (urlToken) {
        console.log("Storing token from URL to localStorage");
        localStorage.setItem("access_token", urlToken);
        urlParams.delete("authToken");
        urlParams.delete("token");
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname +
            (urlParams.toString() ? "?" + urlParams.toString() : "")
        );
        token = urlToken;
      }

      if (!token) {
        console.log("No token found");
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      console.log(
        "Making auth request to:",
        `${import.meta.env.VITE_API_URL}/auth/user`
      );

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Auth response status:", response.status);
      console.log("Auth response headers:", [...response.headers.entries()]);

      if (response.ok) {
        const data = await response.json();
        console.log("Auth success:", data);
        console.log("Full auth response data:", data);
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        console.log("Auth check failed with status:", response.status);
        const errorText = await response.text();
        console.log("Error response:", errorText);
        localStorage.removeItem("access_token");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("access_token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const setAuthToken = (token) => {
    localStorage.setItem("access_token", token);
    checkAuth();
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
      localStorage.removeItem("access_token");
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("access_token");
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = "/login";
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    logout,
    refetch: checkAuth,
    setAuthToken,
  };
};
