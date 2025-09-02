import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight, Code, Mail, RefreshCw, Shield } from "lucide-react";

const NUM_PARTICLES = 15;

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
    <div className="fixed top-2 right-2 z-50 animate-slide-in max-w-[calc(100vw-1rem)] sm:max-w-sm">
      <div
        className={`p-2 sm:p-3 rounded-lg border backdrop-blur-sm shadow-lg transition-all duration-500 ${colors[type]}`}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-xs sm:text-sm">{message}</span>
          <button
            onClick={onClose}
            className="ml-auto text-current hover:opacity-70 transition-opacity text-sm sm:text-lg"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    type: "",
    isVisible: false,
  });
  const [particles, setParticles] = useState([]);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate("/signup");
      return;
    }

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

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");

    if (pastedData.length >= 6) {
      const newOtp = pastedData.slice(0, 6).split("");
      setOtp(newOtp);

      const lastInput = document.getElementById(`otp-5`);
      if (lastInput) lastInput.focus();

      showToast("OTP pasted successfully!", "success");
    } else if (pastedData.length > 0) {
      const newOtp = [...otp];
      const remainingSlots = 6 - index;
      const digitsToFill = Math.min(pastedData.length, remainingSlots);

      for (let i = 0; i < digitsToFill; i++) {
        newOtp[index + i] = pastedData[i];
      }

      setOtp(newOtp);

      const nextFocusIndex = Math.min(index + digitsToFill, 5);
      const nextInput = document.getElementById(`otp-${nextFocusIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      showToast("Please enter all 6 digits", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            otp: otpString,
          }),
        }
      );

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
        setOtp(["", "", "", "", "", ""]);
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast("📧 New verification code sent!", "success");
        setCountdown(60);
        setOtp(["", "", "", "", "", ""]);
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
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative flex">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-2 left-2 w-8 h-8 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-emerald-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div
          className="absolute bottom-2 right-2 w-12 h-12 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-48 lg:h-48 bg-purple-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-8 h-8 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-cyan-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

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
      <div className="relative z-10 w-full flex items-center justify-center p-2 sm:p-4">
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-lg sm:rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-md border border-slate-700/50 hover:border-emerald-500/30 hover:shadow-emerald-500/10 transition-all duration-300 max-h-[96vh] flex flex-col">
          {/* Header */}
          <div className="text-center p-3 sm:p-6 space-y-2 sm:space-y-4 flex-shrink-0">
            <div className="inline-flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-2 sm:mb-3">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-300 text-xs font-medium">
                Email Verification
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-[8px] sm:text-[10px]">
                    ✨
                  </span>
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
                  HelpMeMake
                </h1>
                <p className="text-[9px] sm:text-xs text-slate-400">
                  Code. Learn. Grow.
                </p>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
              Verify Your Email
            </h2>
            <div className="text-slate-300 text-xs sm:text-sm">
              <p className="mb-1">We've sent a 6-digit code to</p>
              <span className="text-emerald-400 font-semibold break-all text-xs">
                {email}
              </span>
            </div>

            {/* Feature Icons */}
            <div className="flex justify-center gap-3 sm:gap-6 mt-3 sm:mt-4">
              {[
                { icon: Mail, color: "purple", label: "Secure" },
                { icon: Shield, color: "emerald", label: "Protected" },
                { icon: Code, color: "cyan", label: "Verified" },
              ].map(({ icon: Icon, color, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-0.5 sm:gap-1"
                >
                  <div
                    className={`w-5 h-5 sm:w-7 sm:h-7 bg-${color}-500/20 rounded-md flex items-center justify-center`}
                  >
                    <Icon
                      className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-${color}-400`}
                    />
                  </div>
                  <span className="text-[9px] sm:text-xs text-slate-400">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* OTP Form */}
          <div className="bg-slate-800/40 rounded-xl m-3 sm:m-6 p-3 sm:p-4 border border-slate-700/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 flex-1 flex flex-col justify-center min-h-0">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* OTP Input Fields */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-xs sm:text-sm font-semibold text-slate-200 text-center">
                  Enter Verification Code
                </label>

                {/* Paste instruction */}
                <div className="text-center">
                  <p className="text-[10px] sm:text-xs text-slate-400 mb-1 sm:mb-2">
                    Paste the code with Ctrl+V (Cmd+V on Mac)
                  </p>
                </div>

                <div className="flex justify-center gap-1.5 sm:gap-2 px-1">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(
                          index,
                          e.target.value.replace(/[^0-9]/g, "")
                        )
                      }
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={(e) => handlePaste(e, index)}
                      onFocus={(e) => {
                        e.target.addEventListener(
                          "wheel",
                          (e) => e.preventDefault(),
                          { passive: false }
                        );
                      }}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-center text-base sm:text-lg font-bold bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm hover:bg-slate-800/70 flex-shrink-0"
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || otp.join("").length !== 6}
                className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group text-sm sm:text-base"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Email</span>
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* Resend Section */}
          <div className="text-center p-3 sm:p-6 space-y-2 sm:space-y-3 flex-shrink-0">
            <div className="flex items-center">
              <div className="flex-1 border-t border-slate-700/50"></div>
              <span className="px-2 sm:px-3 text-slate-400 text-xs font-medium">
                Didn't receive the code?
              </span>
              <div className="flex-1 border-t border-slate-700/50"></div>
            </div>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isResending || countdown > 0}
              className="inline-flex items-center gap-1 sm:gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-all duration-300 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline text-xs sm:text-sm"
            >
              {isResending ? (
                <>
                  <div className="w-3 h-3 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : countdown > 0 ? (
                <>
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend in {countdown}s</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend Code</span>
                </>
              )}
            </button>

            {/* Footer */}
            <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-slate-700/50">
              <p className="text-slate-400 text-xs">
                Wrong email address?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-all duration-300 hover:underline"
                >
                  Go back to signup
                </button>
              </p>
            </div>
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

        /* Prevent scroll on number inputs */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        /* Prevent body scroll when inputs are focused */
        body {
          overscroll-behavior: none;
        }

        /* Ensure container fills screen */
        html, body, #root {
          height: 100%;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
