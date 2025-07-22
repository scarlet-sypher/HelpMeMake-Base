import { useState, useEffect, useRef } from "react";
import InputField from "../../components/auth/InputField";
import Dropdown from "../../components/auth/Dropdown";
import MultiSelectInput from "../../components/auth/MultiSelectInput";
import PasswordField from "../../components/auth/PasswordField";
import axios from "axios";

const NUM_PARTICLES = 30;

export default function Signup() {
  const [userData, setUserData] = useState({
    // Basic Information
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",

    // Education/Role Info
    role: "",
    college: "",
    degree: "",
    yearOrExperience: "",

    // Skills & Preferences
    primarySkills: "",
    lookingForHelp: "",
    canOfferHelp: "",

    // Online Presence
    linkedinUrl: "",
    githubUrl: "",
    personalWebsite: "",

    // Bio & Other
    aboutMe: "",
    location: "",
    preferredCommunication: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 200);
  }, []);

  const roleOptions = [
    { value: "student", label: "🎓 Student - Learning & Growing" },
    { value: "mentor", label: "🧙‍♂️ Mentor - Sharing Knowledge" },
    { value: "both", label: "🌟 Both - Learning & Teaching" },
  ];

  const yearExperienceOptions = [
    { value: "1", label: "🌱 Freshman / Entry Level" },
    { value: "2", label: "🌿 Sophomore / Junior Level" },
    { value: "3", label: "🌳 Junior / Mid Level" },
    { value: "4", label: "🎯 Senior / Advanced Level" },
    { value: "5+", label: "🚀 Graduate / Expert Level" },
  ];

  const communicationOptions = [
    { value: "email", label: "📧 Email" },
    { value: "discord", label: "🎮 Discord" },
    { value: "slack", label: "💬 Slack" },
    { value: "zoom", label: "📹 Video Call" },
    { value: "phone", label: "📞 Phone" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!userData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(userData.email))
      newErrors.email = "Invalid email format";

    if (!userData.password) newErrors.password = "Password is required";
    else if (userData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!userData.role) newErrors.role = "Please select a role";
    if (!userData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      axios
        .post("http://localhost:3000/signup", userData)
        .then((res) => console.log(res.data))
        .catch((err) => console.error(err));
      console.log("User Data:", userData);
      alert("🎉 Welcome aboard! Your HelpMeMake journey begins now!");
    } catch (error) {
      alert("Oops! Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-8">
        <div
          className={`bg-slate-800/20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-6xl border border-slate-700/50 transition-all duration-1000 transform ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-95"
          } hover:border-emerald-500/30 hover:shadow-emerald-500/10`}
        >
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-4">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-300 text-sm font-medium">
                Join the Revolution
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-emerald-200 to-cyan-300 bg-clip-text text-transparent mb-4">
              HelpMeMake
            </h1>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect with expert mentors to build your dream projects and
              accelerate your learning journey
            </p>
          </div>

          {/* Form */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Personal Details */}
            <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700/30 backdrop-blur-sm hover:border-emerald-500/20 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  error={errors.fullName}
                />

                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  error={errors.email}
                />

                <PasswordField
                  label="Password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a secure password"
                  error={errors.password}
                />

                <PasswordField
                  label="Confirm Password"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  error={errors.confirmPassword}
                />

                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={userData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Academic Journey */}
            <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700/30 backdrop-blur-sm hover:border-purple-500/20 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Academic & Professional Background
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Dropdown
                  label="Your Role"
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  options={roleOptions}
                  required
                  error={errors.role}
                />

                <InputField
                  label="Institution / Organization"
                  name="college"
                  value={userData.college}
                  onChange={handleChange}
                  placeholder="Stanford University / Google Inc."
                />

                <InputField
                  label="Field of Study / Profession"
                  name="degree"
                  value={userData.degree}
                  onChange={handleChange}
                  placeholder="Computer Science / Software Engineering"
                />

                <Dropdown
                  label="Academic Level / Experience"
                  name="yearOrExperience"
                  value={userData.yearOrExperience}
                  onChange={handleChange}
                  options={yearExperienceOptions}
                />
              </div>
            </div>

            {/* Skills & Expertise */}
            <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700/30 backdrop-blur-sm hover:border-cyan-500/20 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Skills & Expertise
                </h3>
              </div>

              <div className="space-y-6">
                <MultiSelectInput
                  label="Core Skills & Technologies"
                  name="primarySkills"
                  value={userData.primarySkills}
                  onChange={handleChange}
                  placeholder="React, Python, Machine Learning, Design..."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MultiSelectInput
                    label="Areas Where You Seek Guidance"
                    name="lookingForHelp"
                    value={userData.lookingForHelp}
                    onChange={handleChange}
                    placeholder="Career strategy, System design..."
                  />

                  <MultiSelectInput
                    label="Areas Where You Can Mentor"
                    name="canOfferHelp"
                    value={userData.canOfferHelp}
                    onChange={handleChange}
                    placeholder="Web development, Data analysis..."
                  />
                </div>
              </div>
            </div>

            {/* Digital Presence */}
            <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700/30 backdrop-blur-sm hover:border-indigo-500/20 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Digital Footprint
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="LinkedIn Profile"
                  name="linkedinUrl"
                  type="url"
                  value={userData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourname"
                />

                <InputField
                  label="GitHub Repository"
                  name="githubUrl"
                  type="url"
                  value={userData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/yourusername"
                />

                <InputField
                  label="Portfolio Website"
                  name="personalWebsite"
                  type="url"
                  value={userData.personalWebsite}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
                  className="md:col-span-2"
                />
              </div>
            </div>

            {/* Personal Story */}
            <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700/30 backdrop-blur-sm hover:border-green-500/20 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold">5</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Tell Your Story
                </h3>
              </div>

              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-200 mb-2 transition-colors duration-200 group-focus-within:text-emerald-400">
                    Professional Bio
                  </label>
                  <textarea
                    name="aboutMe"
                    value={userData.aboutMe}
                    onChange={handleChange}
                    placeholder="Share your passion, achievements, and what drives you in your field..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm hover:bg-slate-800/70 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Location / Time Zone"
                    name="location"
                    value={userData.location}
                    onChange={handleChange}
                    placeholder="San Francisco, CA (PST)"
                  />

                  <Dropdown
                    label="Preferred Communication"
                    name="preferredCommunication"
                    value={userData.preferredCommunication}
                    onChange={handleChange}
                    options={communicationOptions}
                  />
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="space-y-8">
              <div className="flex items-start gap-4 p-6 bg-slate-800/30 rounded-xl border border-slate-700/30 backdrop-blur-sm hover:bg-slate-800/40 transition-all duration-300">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={userData.agreeToTerms}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-2 border-slate-600 bg-slate-800/50 checked:bg-emerald-500 checked:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 transition-all duration-200"
                  />
                  <div className="absolute inset-0 rounded border-2 border-emerald-500 scale-0 checked:scale-100 transition-transform duration-200"></div>
                </div>
                <label
                  htmlFor="agreeToTerms"
                  className="text-slate-300 leading-relaxed"
                >
                  I agree to the{" "}
                  <a
                    href="/terms"
                    className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors duration-200"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              {errors.agreeToTerms && (
                <p className="text-red-400 text-sm animate-pulse">
                  {errors.agreeToTerms}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating your profile...
                    </>
                  ) : (
                    <>🚀 Start Your Journey</>
                  )}
                </span>
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-slate-700/30">
            <p className="text-slate-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-all duration-300 hover:underline"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
