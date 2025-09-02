import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  PlayCircle,
  Send,
  BarChart3,
  Zap,
  Settings,
  Award,
  Users,
  Target,
  Edit3,
  Check,
  X,
  Save,
  RotateCcw,
  BookOpen,
} from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  const [quickActions, setQuickActions] = useState([]);
  const [availableActions, setAvailableActions] = useState([]);
  const [isCustomized, setIsCustomized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedActions, setSelectedActions] = useState([]);
  const [saving, setSaving] = useState(false);

  const iconMap = {
    Calendar,
    PlayCircle,
    Send,
    BarChart3,
    Settings,
    Award,
    Users,
    Target,
    BookOpen,
  };

  // Debug function to log with prefix
  const debugLog = (message, data = null) => {
    console.log(`[DEBUG MentorQuickActions] ${message}`, data); // debug
  };

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return null;

      const payload = JSON.parse(atob(token.split(".")[1]));
      debugLog("Extracted userId from token:", payload.userId); // debug
      debugLog("User role from token:", payload.role); // debug
      return payload.userId;
    } catch (error) {
      debugLog("Error extracting userId from token:", error); // debug
      return null;
    }
  };

  useEffect(() => {
    fetchMentorQuickActions();
  }, []);

  const fetchMentorQuickActions = async () => {
    try {
      setLoading(true);
      const userId = getUserIdFromToken();
      debugLog("Fetching quick actions for mentor userId:", userId); // debug

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${apiUrl}/api/quick-actions/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      debugLog("API Response:", data); // debug

      if (data.success) {
        setQuickActions(data.quickActions);
        setAvailableActions(data.availableActions);
        setIsCustomized(data.isCustomized);
        debugLog("Current selected quick actions:", data.quickActions); // debug
        debugLog("Available actions:", data.availableActions); // debug
        debugLog("Is customized:", data.isCustomized); // debug
        debugLog("User role:", data.userRole); // debug
      } else {
        console.error("Failed to fetch quick actions:", data.message);
      }
    } catch (error) {
      console.error("Error fetching quick actions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action) => {
    if (isEditMode) return;

    debugLog("Action clicked:", action); // debug

    if (action.path) {
      navigate(action.path);
    } else if (action.onClick) {
      action.onClick();
    }
  };

  const handleEditClick = () => {
    debugLog("Entering edit mode"); // debug
    setIsEditMode(true);

    setSelectedActions([...quickActions]);
  };

  const handleCancelEdit = () => {
    debugLog("Cancelling edit mode"); // debug
    setIsEditMode(false);
    setSelectedActions([]);
  };

  const toggleActionSelection = (action) => {
    const isSelected = selectedActions.some(
      (selected) => selected.path === action.path
    );

    if (isSelected) {
      const updated = selectedActions.filter(
        (selected) => selected.path !== action.path
      );
      setSelectedActions(updated);
      debugLog("Removed action from selection:", action.label); // debug
      debugLog("Updated selection:", updated); // debug
    } else {
      if (selectedActions.length < 4) {
        const updated = [...selectedActions, action];
        setSelectedActions(updated);
        debugLog("Added action to selection:", action.label); // debug
        debugLog("Updated selection:", updated); // debug
      }
    }
  };

  const saveCustomization = async () => {
    try {
      setSaving(true);
      const userId = getUserIdFromToken();
      debugLog("Saving customization for mentor userId:", userId); // debug
      debugLog("Saving selected actions:", selectedActions); // debug

      if (selectedActions.length === 0 || selectedActions.length > 4) {
        alert("Please select between 1 and 4 quick actions");
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${apiUrl}/api/quick-actions/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedActions: selectedActions,
        }),
      });

      const data = await response.json();
      debugLog("Save response:", data); // debug

      if (data.success) {
        setQuickActions(data.quickActions);
        setIsCustomized(true);
        setIsEditMode(false);
        setSelectedActions([]);
        debugLog("Successfully saved customization"); // debug
      } else {
        console.error("Failed to save quick actions:", data.message);
        alert(data.message || "Failed to save quick actions");
      }
    } catch (error) {
      console.error("Error saving quick actions:", error);
      alert("Failed to save quick actions. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = async () => {
    try {
      setSaving(true);
      const userId = getUserIdFromToken();
      debugLog("Resetting to default for mentor userId:", userId); // debug

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${apiUrl}/api/quick-actions/reset`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      debugLog("Reset response:", data); // debug

      if (data.success) {
        setQuickActions(data.quickActions);
        setIsCustomized(false);
        setIsEditMode(false);
        setSelectedActions([]);
        debugLog("Successfully reset to default"); // debug
      } else {
        console.error("Failed to reset quick actions:", data.message);
        alert(data.message || "Failed to reset quick actions");
      }
    } catch (error) {
      console.error("Error resetting quick actions:", error);
      alert("Failed to reset quick actions. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
        <div className="text-white text-center py-8">
          Loading quick actions...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-400/10 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
            <Zap className="mr-2 text-cyan-400" size={20} />
            Quick Actions
          </h2>

          <div className="flex items-center space-x-2">
            {!isEditMode && (
              <>
                <button
                  onClick={handleEditClick}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors ml-2"
                >
                  <Edit3 size={14} />
                  <span className="hidden sm:inline">Select</span>
                </button>
              </>
            )}

            {isEditMode && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-yellow-300 font-medium">
                  {selectedActions.length}/4 selected
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Edit Mode Controls */}
        {isEditMode && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-sm text-white">
              Select up to 4 quick actions
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={resetToDefault}
                disabled={saving}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg text-white text-sm transition-colors disabled:opacity-50"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="flex items-center space-x-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-white text-sm transition-colors disabled:opacity-50"
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
              <button
                onClick={saveCustomization}
                disabled={
                  saving ||
                  selectedActions.length === 0 ||
                  selectedActions.length > 4
                }
                className="flex items-center space-x-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-white text-sm transition-colors disabled:opacity-50"
              >
                <Save size={14} />
                <span>{saving ? "Saving..." : "Save"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Grid */}
        <div
          className={`grid gap-3 sm:gap-4 ${
            isEditMode
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {(isEditMode ? availableActions : quickActions).map(
            (action, index) => {
              const IconComponent = iconMap[action.icon] || Calendar;
              const isSelected =
                isEditMode &&
                selectedActions.some(
                  (selected) => selected.path === action.path
                );
              const canSelect =
                isEditMode && (selectedActions.length < 4 || isSelected);

              return (
                <button
                  key={`${action.path}-${index}`}
                  onClick={() =>
                    isEditMode
                      ? toggleActionSelection(action)
                      : handleActionClick(action)
                  }
                  disabled={isEditMode && !canSelect && !isSelected}
                  aria-label={action.ariaLabel}
                  className={`group relative p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl text-white transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/30 ${
                    isEditMode
                      ? isSelected
                        ? `${action.color} shadow-2xl scale-105 ring-2 ring-white/50`
                        : canSelect
                        ? `bg-white/10 hover:bg-white/20 hover:scale-105`
                        : `bg-white/5 opacity-50 cursor-not-allowed`
                      : `bg-gradient-to-r ${action.color} hover:shadow-2xl transform hover:scale-105 focus:scale-105 border border-white/10 hover:border-white/20`
                  }`}
                >
                  {/* Selected indicator */}
                  {isEditMode && isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}

                  {/* Shine effect */}
                  {!isEditMode && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  )}

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 transition-colors backdrop-blur-sm border border-white/10 ${
                        isEditMode && isSelected
                          ? "bg-white/30"
                          : "bg-white/20 group-hover:bg-white/30"
                      }`}
                    >
                      <IconComponent
                        size={16}
                        className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-center leading-tight">
                      {action.label}
                    </span>

                    {/* Action indicator */}
                    {!isEditMode && (
                      <div className="mt-1 sm:mt-2 w-6 sm:w-8 h-0.5 bg-white/40 rounded-full group-hover:bg-white/60 transition-colors"></div>
                    )}
                  </div>

                  {/* Hover glow effect */}
                  {!isEditMode && (
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </button>
              );
            }
          )}
        </div>

        {/* Status indicator */}
        {!isEditMode && (
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isCustomized ? "bg-green-400" : "bg-yellow-400"
                }`}
              ></div>
              <span className="text-xs sm:text-sm text-white/70 font-medium">
                {isCustomized ? "Customized Actions" : "Default Actions"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickActions;
