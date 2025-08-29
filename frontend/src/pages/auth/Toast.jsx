import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

const Toast = ({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          background:
            "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
          icon: <CheckCircle className="w-5 h-5" />,
        };
      case "error":
        return {
          background: "bg-red-500/10 border-red-500/30 text-red-300",
          icon: <XCircle className="w-5 h-5" />,
        };
      case "warning":
        return {
          background: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300",
          icon: <AlertCircle className="w-5 h-5" />,
        };
      default:
        return {
          background: "bg-slate-500/10 border-slate-500/30 text-slate-300",
          icon: <CheckCircle className="w-5 h-5" />,
        };
    }
  };

  const { background, icon } = getToastStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ease-in-out ${
        isVisible
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"
      }`}
    >
      <div
        className={`p-4 rounded-xl border backdrop-blur-sm shadow-lg max-w-sm ${background}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">{icon}</div>
          <span className="font-medium text-sm flex-1">{message}</span>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-current hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
