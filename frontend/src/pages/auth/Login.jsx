import { useState, useEffect } from "react";
import {
  ChevronRight,
  Code,
  Users,
  Zap,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";
import axios from "axios";
import baka from "../../assets/LoginImages/baka.jpg";
import kakashi from "../../assets/LoginImages/kakashi.jpg";
import ken from "../../assets/LoginImages/ken.jpg";
import luffy from "../../assets/LoginImages/Luuuffy.jpg";
import saitama from "../../assets/LoginImages/saitama.jpg";

const NUM_PARTICLES = 25;

// Mock images for demonstration
const heroImages = [
  {
    id: 1,
    title: "Mentorship",
    subtitle:
      "Connect with industry experts and accelerate your learning journey",
    image: baka,
  },
  {
    id: 2,
    title: "Growth",
    subtitle: "Build amazing projects with guidance from experienced mentors",
    image: kakashi,
  },
  {
    id: 3,
    title: "Innovation",
    subtitle: "Turn your innovative ideas into reality with expert support",
    image: ken,
  },
  {
    id: 4,
    title: "Speed",
    subtitle: "Fast-track your career with personalized mentorship",
    image: luffy,
  },
  {
    id: 5,
    title: "Excellence",
    subtitle: "Achieve excellence through collaborative learning",
    image: saitama,
  },
];

// InputField component
const InputField = ({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
  error,
  type = "text",
}) => (
  <div className="group">
    <label className="block text-sm font-semibold text-slate-200 mb-2 transition-colors duration-200 group-focus-within:text-emerald-400">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm hover:bg-slate-800/70"
    />
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </div>
);

// PasswordField component
const PasswordField = ({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="group">
      <label className="block text-sm font-semibold text-slate-200 mb-2 transition-colors duration-200 group-focus-within:text-emerald-400">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm hover:bg-slate-800/70"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors duration-200"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [particles, setParticles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize particles
    setParticles(
      Array.from({ length: NUM_PARTICLES }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 5,
        size: 1 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.2,
      }))
    );

    setIsVisible(true);
    setImageLoaded(true);

    // Image carousel
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4500);

    return () => clearInterval(imageInterval);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (feedbackMessage) {
      setFeedbackMessage("");
      setMessageType("");
    }
  }

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage("");
    setMessageType("");

    try {
      // Check if this is an admin login attempt
      const adminId = import.meta.env.VITE_ADMIN_ID;

      const isAdminLogin = form.username === adminId;

      const endpoint = isAdminLogin
        ? `${import.meta.env.VITE_API_URL}/admin/login`
        : `${import.meta.env.VITE_API_URL}/auth/login`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(
          isAdminLogin
            ? { username: form.username, password: form.password }
            : { email: form.username, password: form.password }
        ),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedbackMessage("🎉 Login successful! Redirecting...");
        setMessageType("success");

        if (isAdminLogin) {
          // Admin login
          localStorage.setItem("admin_token", data.token);
          setTimeout(() => {
            navigate("/admindashboard");
          }, 2000);
        } else {
          // Regular user login
          if (data.token) {
            localStorage.setItem("access_token", data.token);
          }

          setTimeout(() => {
            if (data.requiresRoleSelection) {
              navigate("/select-role");
            } else {
              const dashboardMap = {
                admin: "/admindashboard",
                mentor: "/mentordashboard",
                user: "/userdashboard",
              };
              const targetRoute =
                dashboardMap[data.user.role] || "/userdashboard";
              navigate(targetRoute);
            }
          }, 2000);
        }
      } else {
        if (data.requiresVerification) {
          setFeedbackMessage(
            "📧 Please verify your email first. Check your inbox."
          );
          setMessageType("error");
          setTimeout(() => {
            navigate(`/verify-otp?email=${encodeURIComponent(form.username)}`);
          }, 3000);
        } else {
          setFeedbackMessage(
            data.message || "❌ Login failed. Please try again."
          );
          setMessageType("error");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setFeedbackMessage("⚠️ Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (location.state?.toastMessage) {
      setToast({
        message: location.state.toastMessage,
        type: location.state.toastType || "success",
        isVisible: true,
      });

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.state]);

  function handleOAuth(provider) {
    if (provider === "Google") {
      // Redirect to backend Google OAuth route
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    } else if (provider === "GitHub") {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-emerald-400/20 animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Desktop Layout */}
        <div className="hidden lg:flex min-h-screen items-center">
          {/* Left Hero Section - Desktop Only */}
          <div className="flex w-1/2 items-center justify-center px-4 xl:px-8">
            <div
              className={`relative w-full h-[32rem] max-w-lg transition-all duration-700 ${
                imageLoaded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              {heroImages.map((img, index) => (
                <div
                  key={img.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === currentImageIndex
                      ? "opacity-100 scale-100 z-10"
                      : "opacity-0 scale-95 z-0"
                  }`}
                  style={{
                    pointerEvents:
                      index === currentImageIndex ? "auto" : "none",
                  }}
                >
                  <div className="w-full h-full rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative group">
                    <img
                      src={img.image}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{
                        minHeight: "100%",
                        minWidth: "100%",
                        display: "block",
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20"></div>

                    {/* Decorative elements */}
                    <div className="absolute top-8 left-8 w-16 h-16 border-2 border-white/30 rounded-full"></div>
                    <div className="absolute top-1/3 right-8 w-8 h-8 bg-white/20 rounded-lg rotate-45"></div>
                    <div className="absolute bottom-1/3 left-12 w-12 h-12 bg-white/10 rounded-full"></div>

                    {/* Overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h3 className="text-3xl font-bold mb-3">{img.title}</h3>
                      <p className="text-lg opacity-90 leading-relaxed">
                        {img.subtitle}
                      </p>
                    </div>

                    {/* Floating Animation Elements */}
                    {/* <div className="absolute top-6 right-6 w-3 h-3 bg-emerald-400/60 rounded-full animate-pulse"></div> */}
                    {/* <div className="absolute top-20 right-12 w-2 h-2 bg-purple-400/60 rounded-full animate-ping"></div> */}
                    <div
                      className="absolute bottom-20 right-8 w-4 h-4 bg-cyan-400/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>
                </div>
              ))}

              {/* Image Indicators */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-emerald-400 shadow-lg scale-125"
                        : "bg-white/40 hover:bg-white/60 hover:scale-110"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Form Section - Desktop */}
          <div className="flex w-1/2 items-center justify-center px-4 xl:px-8">
            <LoginForm
              form={form}
              errors={errors}
              feedbackMessage={feedbackMessage}
              messageType={messageType}
              isVisible={isVisible}
              isSubmitting={isSubmitting}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleOAuth={handleOAuth}
            />
          </div>
        </div>

        {/* Mobile/Tablet Layout - Form Only */}
        <div className="flex lg:hidden min-h-screen items-center justify-center px-4 py-8">
          <LoginForm
            form={form}
            errors={errors}
            feedbackMessage={feedbackMessage}
            messageType={messageType}
            isVisible={isVisible}
            isSubmitting={isSubmitting}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleOAuth={handleOAuth}
          />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(1deg);
          }
          50% {
            transform: translateY(-5px) rotate(-0.5deg);
          }
          75% {
            transform: translateY(-7px) rotate(0.5deg);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

// Extracted LoginForm component for reusability
function LoginForm({
  form,
  errors,
  feedbackMessage,
  messageType,
  isVisible,
  isSubmitting,
  handleChange,
  handleSubmit,
  handleOAuth,
}) {
  return (
    <div
      className={`bg-slate-800/30 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 w-full max-w-lg xl:max-w-2xl border border-slate-700/50 transition-all duration-700 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
      } hover:border-emerald-500/30 hover:shadow-emerald-500/10`}
    >
      {/* Header */}
      <div className="text-center mb-6 lg:mb-8 space-y-3 lg:space-y-4">
        <div className="inline-flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-3 lg:mb-4">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-emerald-300 text-xs lg:text-sm font-medium">
            Welcome Back
          </span>
        </div>

        {/* Logo with Code Icon */}
        <div className="flex items-center justify-center gap-3 mb-3 lg:mb-4">
          <div className="relative">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <Code className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-white text-xs">✨</span>
            </div>
          </div>
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
              HelpMeMake
            </h1>
            <p className="text-xs lg:text-sm text-slate-400">
              Code. Learn. Grow.
            </p>
          </div>
        </div>

        <p className="text-base lg:text-lg text-slate-300 leading-relaxed">
          Sign in to continue your coding journey
        </p>

        {/* Feature Icons */}
        <div className="flex justify-center gap-4 lg:gap-6 mt-4 lg:mt-6">
          <div className="flex flex-col items-center gap-1 transform hover:scale-110 transition-transform duration-200">
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-3 h-3 lg:w-4 lg:h-4 text-purple-400" />
            </div>
            <span className="text-xs text-slate-400">Mentors</span>
          </div>
          <div className="flex flex-col items-center gap-1 transform hover:scale-110 transition-transform duration-200">
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-3 h-3 lg:w-4 lg:h-4 text-emerald-400" />
            </div>
            <span className="text-xs text-slate-400">Projects</span>
          </div>
          <div className="flex flex-col items-center gap-1 transform hover:scale-110 transition-transform duration-200">
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-cyan-400" />
            </div>
            <span className="text-xs text-slate-400">Secure</span>
          </div>
        </div>
      </div>

      {/* Feedback Message */}
      {feedbackMessage && (
        <div
          className={`mb-4 lg:mb-6 p-3 lg:p-4 rounded-xl border backdrop-blur-sm transition-all duration-500 ${
            messageType === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2 lg:gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                messageType === "success" ? "bg-emerald-400" : "bg-red-400"
              } animate-pulse`}
            ></div>
            <span className="font-medium text-sm lg:text-base">
              {feedbackMessage}
            </span>
          </div>
        </div>
      )}

      {/* Login Form */}
      <div className="bg-slate-800/40 rounded-2xl p-4 lg:p-6 border border-slate-700/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
        <div className="space-y-4 lg:space-y-6">
          <InputField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
            error={errors.username}
          />

          <PasswordField
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            error={errors.password}
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-2 border-slate-600 bg-slate-800/50 checked:bg-emerald-500 checked:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 transition-all duration-200"
              />
              <span className="text-slate-300 group-hover:text-slate-200 transition-colors duration-200">
                Remember me
              </span>
            </label>
            <button
              onClick={() => (window.location.href = "/forgot-password")}
              className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200 hover:underline text-left sm:text-right"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold py-3 lg:py-4 px-6 lg:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-2 lg:gap-3">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-sm lg:text-base">Signing In...</span>
                </>
              ) : (
                <>
                  <span className="text-sm lg:text-base">Sign In</span>
                  <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center my-4 lg:my-6">
        <div className="flex-1 border-t border-slate-700/50"></div>
        <span className="px-3 lg:px-4 text-slate-400 text-xs lg:text-sm font-medium">
          or continue with
        </span>
        <div className="flex-1 border-t border-slate-700/50"></div>
      </div>

      {/* OAuth Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 lg:mb-6">
        <button
          onClick={() => handleOAuth("Google")}
          className="flex-1 bg-slate-800/40 hover:bg-slate-800/60 text-white px-4 py-3 rounded-xl transition-all duration-300 font-semibold border border-slate-700/50 hover:border-slate-600/70 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 backdrop-blur-sm group"
        >
          <div className="w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <span className="text-sm lg:text-base">Google</span>
        </button>
        <button
          onClick={() => handleOAuth("GitHub")}
          className="flex-1 bg-slate-800/40 hover:bg-slate-800/60 text-white px-4 py-3 rounded-xl transition-all duration-300 font-semibold border border-slate-700/50 hover:border-slate-600/70 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 backdrop-blur-sm group"
        >
          <div className="w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <span className="text-white text-xs">🐙</span>
          </div>
          <span className="text-sm lg:text-base">GitHub</span>
        </button>
      </div>

      {/* Footer */}
      <div className="text-center pt-3 lg:pt-4 border-t border-slate-700/50">
        <p className="text-slate-400 text-sm lg:text-base">
          New to HelpMeMake?{" "}
          <a
            href="/signup"
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-all duration-300 hover:underline inline-flex items-center gap-1"
          >
            Join the community
            <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
          </a>
        </p>
      </div>
    </div>
  );
}
