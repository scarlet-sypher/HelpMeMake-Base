import { useState } from "react";
import { ChevronRight, Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: ["", "", "", "", "", ""],
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset code sent to your email!");
        setMessageType("success");
        setStep(2);
      } else {
        setMessage(data.message || "Failed to send reset code");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });

    if (value && index < 5) {
      const nextInput = document.getElementById(`reset-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpVerify = () => {
    if (formData.otp.join("").length === 6) {
      setStep(3);
      setMessage("");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords don't match");
      setMessageType("error");
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp.join(""),
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successfully! You can now login.");
        setMessageType("success");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setMessage(data.message || "Failed to reset password");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-slate-700/50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-slate-300">
            {step === 1 && "Enter your email to receive a reset code"}
            {step === 2 && "Enter the 6-digit code sent to your email"}
            {step === 3 && "Enter your new password"}
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              messageType === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter your email"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !isSubmitting &&
                  formData.email &&
                  handleEmailSubmit(e)
                }
              />
            </div>

            <button
              onClick={handleEmailSubmit}
              disabled={isSubmitting || !formData.email}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Code
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-4 text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center gap-3">
                {formData.otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`reset-otp-${index}`}
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
                    className="w-12 h-12 text-center text-xl font-bold bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleOtpVerify}
              disabled={formData.otp.join("").length !== 6}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Verify Code
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full text-slate-400 hover:text-white py-2 transition-colors"
            >
              ← Change Email
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter new password (min 8 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Confirm new password"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !isSubmitting &&
                  formData.newPassword &&
                  formData.confirmPassword &&
                  handlePasswordReset(e)
                }
              />
            </div>

            <button
              onClick={handlePasswordReset}
              disabled={
                isSubmitting ||
                !formData.newPassword ||
                !formData.confirmPassword
              }
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full text-slate-400 hover:text-white py-2 transition-colors"
            >
              ← Back to Code
            </button>
          </div>
        )}

        <div className="text-center mt-6 pt-4 border-t border-slate-700/50">
          <button
            onClick={handleBackToLogin}
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
