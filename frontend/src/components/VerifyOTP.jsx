import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight, Code, Mail, RefreshCw, Shield } from "lucide-react";

const NUM_PARTICLES = 15;

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

  const colors = {
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    error: "bg-red-500/10 border-red-500/30 text-red-300",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300",
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`p-4 rounded-xl border backdrop-blur-sm shadow-lg max-w-sm transition-all duration-500 ${colors[type]}`}>
        <div className="flex items-center gap-3">
          <span className="font-medium text-sm">{message}</span>
          <button onClick={onClose} className="ml-auto text-current hover:opacity-70 transition-opacity">×</button>
        </div>
      </div>
    </div>
  );
};

export default function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email');
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "", isVisible: false });
  const [particles, setParticles] = useState([]);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }

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
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const showToast = (message, type) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      showToast("Please enter all 6 digits", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          otp: otpString,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("✅ Email verified successfully!", "success");
        
        setTimeout(() => {
          if (data.requiresRoleSelection) {
            navigate("/select-role");
          } else {
            navigate("/login");
          }
        }, 2000);
      } else {
        showToast(data.message || "Invalid verification code", "error");
        setOtp(['', '', '', '', '', '']);
      }

    } catch (error) {
      console.error("OTP verification error:", error);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);

    try {
      const response = await fetch("http://localhost:8000/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("📧 New verification code sent!", "success");
        setCountdown(60); // 60 second cooldown
        setOtp(['', '', '', '', '', '']);
      } else {
        showToast(data.message || "Failed to resend code", "error");
      }

    } catch (error) {
      console.error("Resend OTP error:", error);
      showToast("Failed to resend code. Please try again.", "error");
    } finally {
      setIsResending(false);
    }
  };

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
        <div className="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>

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
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 w-full max-w-lg border border-slate-700/50 hover:border-emerald-500/30 hover:shadow-emerald-500/10 transition-all duration-300">
          
          {/* Header */}
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-4">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-300 text-sm font-medium">Email Verification</span>
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-xs">✨</span>
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
                  HelpMeMake
                </h1>
                <p className="text-xs lg:text-sm text-slate-400">Code. Learn. Grow.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
            <p className="text-slate-300 leading-relaxed">
              We've sent a 6-digit verification code to<br />
              <span className="text-emerald-400 font-semibold">{email}</span>
            </p>

            {/* Feature Icons */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-xs text-slate-400">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-xs text-slate-400">Protected</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-xs text-slate-400">Verified</span>
              </div>
            </div>
          </div>

          {/* OTP Form */}
          <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* OTP Input Fields */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-200 text-center">
                  Enter Verification Code
                </label>
                
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/[^0-9]/g, ''))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm hover:bg-slate-800/70"
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || otp.join('').length !== 6}
                className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Email</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </span>
              </button>

            </form>
          </div>

          {/* Resend Section */}
          <div className="text-center mt-6 space-y-4">
            <div className="flex items-center">
              <div className="flex-1 border-t border-slate-700/50"></div>
              <span className="px-4 text-slate-400 text-sm font-medium">Didn't receive the code?</span>
              <div className="flex-1 border-t border-slate-700/50"></div>
            </div>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isResending || countdown > 0}
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-all duration-300 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
            >
              {isResending ? (
                <>
                  <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : countdown > 0 ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Resend in {countdown}s</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Resend Code</span>
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 mt-6 border-t border-slate-700/50">
            <p className="text-slate-400 text-sm">
              Wrong email address?{" "}
              <button
                onClick={() => navigate('/signup')}
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-all duration-300 hover:underline"
              >
                Go back to signup
              </button>
            </p>
          </div>

        </div>
      </div>

      <style>{`
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

        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}