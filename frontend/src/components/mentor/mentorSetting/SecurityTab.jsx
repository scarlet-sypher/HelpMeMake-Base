import React from "react";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader,
  User,
  Mail,
  Github,
} from "lucide-react";

const SecurityTab = ({
  userData,
  passwordData,
  setPasswordData,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  handlePasswordChange,
  loadingStates,
  notifications,
}) => {
  const NotificationComponent = ({ notification }) => {
    if (!notification) return null;

    return (
      <div
        className={`relative overflow-hidden p-4 rounded-2xl mb-6 flex items-center space-x-3 backdrop-blur-sm border transition-all duration-500 animate-slide-in ${
          notification.status === "success"
            ? "bg-cyan-700/30 border-cyan-500/50 text-cyan-200 shadow-cyan-600/20"
            : "bg-slate-800/40 border-slate-600/50 text-slate-300 shadow-slate-700/25"
        } shadow-xl`}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r opacity-5 animate-pulse"
          style={{
            background:
              notification.status === "success"
                ? "linear-gradient(45deg, #0891b2, #0e7490)"
                : "linear-gradient(45deg, #374151, #1f2937)",
          }}
        />
        <div className="relative z-10 flex items-center space-x-3">
          {notification.status === "success" ? (
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      </div>
    );
  };

  const isOAuthUser = () => {
    return (
      userData && userData.authProvider && userData.authProvider !== "local"
    );
  };

  const canChangePassword = () => {
    return (
      userData &&
      (userData.authProvider === "local" ||
        userData.tempPassword ||
        (userData.isPasswordUpdated === false &&
          userData.authProvider === "local"))
    );
  };

  const getProviderName = () => {
    if (!userData || !userData.authProvider) return "";
    switch (userData.authProvider) {
      case "google":
        return "Google";
      case "github":
        return "GitHub";
      default:
        return userData.authProvider;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <NotificationComponent notification={notifications.password} />

      {/* OAuth User Notice - Password Change Not Allowed */}
      {isOAuthUser() && (
        <div className="relative group/oauth-notice">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-15 group-hover/oauth-notice:opacity-20 transition duration-500"></div>
          <div className="relative bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-400/40 rounded-2xl p-6 flex items-start space-x-4 backdrop-blur-sm">
            <div className="p-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex-shrink-0">
              <Shield className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-amber-200 font-bold text-lg mb-2 flex items-center">
                <Lock className="mr-2" size={18} />
                Password Change Restricted
              </h4>
              <p className="text-amber-100 mb-3">
                You signed in using <strong>{getProviderName()}</strong>. Your
                password is managed by {getProviderName()} and cannot be changed
                here.
              </p>
              <p className="text-amber-200 text-sm">
                To change your password, please visit your {getProviderName()}{" "}
                account settings.
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-amber-600/20 rounded-xl">
              {userData.authProvider === "google" && (
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-700">G</span>
                </div>
              )}
              {userData.authProvider === "github" && (
                <Github className="text-white" size={24} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Security Notice for Local Users */}
      {!isOAuthUser() && (
        <div className="relative group/notice">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-teal-700 rounded-2xl blur opacity-15 group-hover/notice:opacity-20 transition duration-500"></div>
          <div className="relative bg-gradient-to-br from-cyan-700/30 to-teal-800/30 border border-cyan-500/40 rounded-2xl p-6 flex items-start space-x-4 backdrop-blur-sm">
            <div className="p-2 bg-gradient-to-r from-cyan-600 to-teal-700 rounded-xl flex-shrink-0">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <h4 className="text-cyan-200 font-bold text-lg mb-2">
                Security Notice
              </h4>
              <p className="text-cyan-100">
                Your current password is required to make any security changes.
                This helps protect your mentor account from unauthorized
                modifications.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Form - Only show for local users */}
      {canChangePassword() && !isOAuthUser() && (
        <div className="relative group/security">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-700 to-teal-600 rounded-2xl blur opacity-15 group-hover/security:opacity-20 transition duration-500"></div>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 lg:p-8 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-cyan-700 to-teal-600 rounded-xl">
                <Lock className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Change Password</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-600/50 to-transparent"></div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              {/* Current Password Field - Only show if not temp password */}
              {!userData.tempPassword && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                    <Lock className="mr-2 text-cyan-400" size={16} />
                    Current Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full p-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                      placeholder="Enter your current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  New Password
                </label>
                <div className="relative group">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full p-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                    placeholder="Enter new password"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Confirm New Password
                </label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full p-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                    placeholder="Confirm new password"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {passwordData.newPassword &&
                passwordData.confirmPassword &&
                passwordData.newPassword !== passwordData.confirmPassword && (
                  <div className="flex items-center space-x-2 p-4 bg-red-500/20 border border-red-400/30 rounded-xl text-red-300 animate-shake">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span className="text-sm font-medium">
                      Passwords do not match
                    </span>
                  </div>
                )}

              <button
                type="submit"
                disabled={
                  loadingStates.password ||
                  passwordData.newPassword !== passwordData.confirmPassword
                }
                className="relative group overflow-hidden flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 hover:from-cyan-700 hover:via-teal-700 hover:to-cyan-800 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {loadingStates.password ? (
                  <Loader className="animate-spin relative z-10" size={20} />
                ) : (
                  <Shield className="relative z-10" size={20} />
                )}
                <span className="relative z-10">
                  {loadingStates.password
                    ? "Changing Password..."
                    : "Change Password"}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Account Information Section */}
      <div className="relative group/account-info">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-teal-700 rounded-2xl blur opacity-15 group-hover/account-info:opacity-20 transition duration-500"></div>
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 lg:p-8 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-cyan-600 to-teal-700 rounded-xl">
              <User className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">
              Account Information
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-600/50 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                Login Method
              </label>
              <div className="flex items-center space-x-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                {userData.authProvider === "google" && (
                  <>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">G</span>
                    </div>
                    <span className="text-white font-medium">
                      Google Account
                    </span>
                  </>
                )}
                {userData.authProvider === "github" && (
                  <>
                    <Github className="text-white" size={20} />
                    <span className="text-white font-medium">
                      GitHub Account
                    </span>
                  </>
                )}
                {userData.authProvider === "local" && (
                  <>
                    <Mail className="text-white" size={20} />
                    <span className="text-white font-medium">
                      Email & Password
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                Account Status
              </label>
              <div className="flex items-center space-x-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                <CheckCircle className="text-green-400" size={20} />
                <span className="text-white font-medium">
                  Active & Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
