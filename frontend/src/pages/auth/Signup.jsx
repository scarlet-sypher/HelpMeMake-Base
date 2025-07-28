import { useState, useEffect } from "react";
import {ChevronRight,Code,Users,Zap,Shield,Eye,EyeOff,CheckCircle,XCircle,AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NUM_PARTICLES = 25;

// Toast notification component
const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
  };

  const colors = {
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    error: "bg-red-500/10 border-red-500/30 text-red-300",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300",
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`p-4 rounded-xl border backdrop-blur-sm shadow-lg max-w-sm transition-all duration-500 ${colors[type]}`}
      >
        <div className="flex items-center gap-3">
          {icons[type]}
          <span className="font-medium text-sm">{message}</span>
          <button
            onClick={onClose}
            className="ml-auto text-current hover:opacity-70 transition-opacity"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

// Mock hero images (you can replace with your actual images)
const heroImages = [
  {
    id: 1,
    title: "Join Us",
    subtitle: "Start your journey with expert mentors and build amazing projects",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=600&fit=crop&crop=faces",
  },
  {
    id: 2,
    title: "Learn",
    subtitle: "Connect with industry professionals and accelerate your growth",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=600&fit=crop&crop=faces",
  },
  {
    id: 3,
    title: "Build",
    subtitle: "Transform your innovative ideas into reality with guidance",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=600&fit=crop&crop=center",
  },
  {
    id: 4,
    title: "Grow",
    subtitle: "Fast-track your career with personalized mentorship",
    image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=500&h=600&fit=crop&crop=center",
  },
  {
    id: 5,
    title: "Succeed",
    subtitle: "Achieve excellence through collaborative learning",
    image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=500&h=600&fit=crop&crop=faces",
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



export default function Signup() {
  const [form, setForm] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "",
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: "", type: "", isVisible: false });
  const [particles, setParticles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
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

  const showToast = (message, type) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
      switch (error) {
        case 'authentication_failed':
          showToast("Authentication failed. Please try again.", "error");
          break;
        case 'google_auth_failed':
          showToast("Google authentication failed. Please try again.", "error");
          break;
        case 'server_error':
          showToast("Server error occurred. Please try again later.", "error");
          break;
        default:
          showToast("An error occurred during authentication.", "error");
      }
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === "checkbox" ? checked : value 
    });

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm password validation
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms and conditions validation
    if (!form.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fix the errors below", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name || form.email.split('@')[0] // Extract name from email if not provided
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requiresVerification) {
          showToast("📧 Verification code sent! Check your email.", "success");
          
          // Navigate to OTP verification page
          setTimeout(() => {
            navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
          }, 2000);
        } else {
          showToast("🎉 Account created successfully!", "success");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } else {
        showToast(data.message || "Failed to create account", "error");
      }

    } catch (error) {
      console.error("Signup error:", error);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleOAuth(provider) {
    if (provider === "Google") {
      // Redirect to backend Google OAuth route
      window.location.href = "http://localhost:8000/auth/google";
    } else if (provider === "GitHub") {
    
      window.location.href = "http://localhost:8000/auth/github";
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Toast Notification */}
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
                    <div className="absolute top-6 right-6 w-3 h-3 bg-emerald-400/60 rounded-full animate-pulse"></div>
                    <div className="absolute top-20 right-12 w-2 h-2 bg-purple-400/60 rounded-full animate-ping"></div>
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
            <SignupForm
              form={form}
              errors={errors}
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
          <SignupForm
            form={form}
            errors={errors}
            isVisible={isVisible}
            isSubmitting={isSubmitting}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleOAuth={handleOAuth}
          />
        </div>
      </div>

      <style jsx>{`
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

// Extracted SignupForm component
function SignupForm({
  form,
  errors,
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
            Join the Community
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
          Create your account and start building
        </p>

        {/* Feature Icons */}
        <div className="flex justify-center gap-4 lg:gap-6 mt-4 lg:mt-6">
          <div className="flex flex-col items-center gap-1 transform hover:scale-110 transition-transform duration-200">
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-3 h-3 lg:w-4 lg:h-4 text-purple-400" />
            </div>
            <span className="text-xs text-slate-400">Connect</span>
          </div>
          <div className="flex flex-col items-center gap-1 transform hover:scale-110 transition-transform duration-200">
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-3 h-3 lg:w-4 lg:h-4 text-emerald-400" />
            </div>
            <span className="text-xs text-slate-400">Build</span>
          </div>
          <div className="flex flex-col items-center gap-1 transform hover:scale-110 transition-transform duration-200">
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-cyan-400" />
            </div>
            <span className="text-xs text-slate-400">Secure</span>
          </div>
        </div>
      </div>

      {/* Signup Form */}
      <div className="bg-slate-800/40 rounded-2xl p-4 lg:p-6 border border-slate-700/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Enter your email address"
            error={errors.email}
          />

          <PasswordField
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Create a strong password"
            error={errors.password}
          />

          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
            error={errors.confirmPassword}
          />

          {/* Terms and Conditions Checkbox */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="relative mt-1">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={form.agreeToTerms}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-2 border-slate-600 bg-slate-800/50 checked:bg-emerald-500 checked:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 transition-all duration-200"
                />
              </div>
              <label htmlFor="agreeToTerms" className="text-slate-300 text-sm leading-relaxed cursor-pointer">
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-400 text-sm animate-pulse ml-8">
                {errors.agreeToTerms}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold py-3 lg:py-4 px-6 lg:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-2 lg:gap-3">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-sm lg:text-base">Creating Account...</span>
                </>
              ) : (
                <>
                  <span className="text-sm lg:text-base">Create Account</span>
                  <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </span>
          </button>
        </form>
      </div>

      {/* Divider */}
      <div className="flex items-center my-4 lg:my-6">
        <div className="flex-1 border-t border-slate-700/50"></div>
        <span className="px-3 lg:px-4 text-slate-400 text-xs lg:text-sm font-medium">
          or sign up with
        </span>
        <div className="flex-1 border-t border-slate-700/50"></div>
      </div>

      {/* OAuth Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 lg:mb-6">
        <button
          type="button"
          onClick={() => handleOAuth("Google")}
          className="flex-1 bg-slate-800/40 hover:bg-slate-800/60 text-white px-4 py-3 rounded-xl transition-all duration-300 font-semibold border border-slate-700/50 hover:border-slate-600/70 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 backdrop-blur-sm group"
        >
          <div className="w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <span className="text-sm lg:text-base">Google</span>
        </button>
        <button
          type="button"
          onClick={() => handleOAuth("GitHub")}
          className="flex-1 bg-slate-800/40 hover:bg-slate-800/60 text-white px-4 py-3 rounded-xl 
          transition-all duration-300 font-semibold border border-slate-700/50 hover:border-slate-600/70 
          transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 backdrop-blur-sm group">
          <div className="w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <span className="text-white text-xs">🐙</span>
          </div>
          <span className="text-sm lg:text-base">GitHub</span>
        </button>
      </div>

      {/* Footer */}
      <div className="text-center pt-3 lg:pt-4 border-t border-slate-700/50">
        <p className="text-slate-400 text-sm lg:text-base">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-all duration-300 hover:underline inline-flex items-center gap-1"
          >
            Sign in here
            <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
          </a>
        </p>
      </div>
    </div>
  );
}