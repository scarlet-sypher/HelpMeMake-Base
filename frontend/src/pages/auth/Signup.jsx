import { useState, useEffect, useRef } from "react";
import InputField from "../../components/auth/InputField";
import Dropdown from "../../components/auth/Dropdown";
import ImageUploader from "../../components/auth/ImageUploader";
import MultiSelectInput from "../../components/auth/MultiSelectInput";

const NUM_PARTICLES = 25;

export default function Signup() {
  const [userData, setUserData] = useState({
    // Basic Information
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    profilePicture: null,
    
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
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [profilePreview, setProfilePreview] = useState(null);
  const [particles, setParticles] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initialize particles
    setParticles(
      Array.from({ length: NUM_PARTICLES }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 3 + Math.random() * 5,
        delay: Math.random() * 4,
        size: 1 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.2
      }))
    );

    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const roleOptions = [
    { value: "student", label: "Student" },
    { value: "mentor", label: "Mentor" },
    { value: "both", label: "Both" }
  ];

  const yearExperienceOptions = [
    { value: "1", label: "1st Year / 0-1 years" },
    { value: "2", label: "2nd Year / 1-2 years" },
    { value: "3", label: "3rd Year / 2-3 years" },
    { value: "4", label: "4th Year / 3-5 years" },
    { value: "5+", label: "Graduate / 5+ years" }
  ];

  const communicationOptions = [
    { value: "email", label: "Email" },
    { value: "discord", label: "Discord" },
    { value: "slack", label: "Slack" },
    { value: "zoom", label: "Video Call" },
    { value: "phone", label: "Phone" }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, profilePicture: 'Image size should be less than 5MB' }));
        return;
      }
      
      setUserData(prev => ({ ...prev, profilePicture: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (errors.profilePicture) {
        setErrors(prev => ({ ...prev, profilePicture: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validations
    if (!userData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!userData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(userData.email)) newErrors.email = 'Invalid email format';
    
    if (!userData.password) newErrors.password = 'Password is required';
    else if (userData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!userData.role) newErrors.role = 'Please select a role';
    if (!userData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful signup
      console.log('User Data:', userData);
      alert('🎉 Signup successful! Welcome to HelpMeMake!');
      
      // In a real app, you would redirect to dashboard
      // window.location.href = '/user-dashboard';
      
    } catch (error) {
      alert('Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animation: `float ${p.duration}s ease-in-out infinite, pulse ${p.duration * 2}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-8">
        <div className={`bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-4xl border border-white/20 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🚀 Join the Adventure
            </h1>
            <h2 className="text-2xl font-semibold mb-2 text-white">HelpMeMake</h2>
            <p className="text-purple-200 text-sm">Create your account and start your mentorship journey</p>
          </div>

          {/* Form */}
          <div className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-6 text-purple-300 flex items-center gap-2">
                👤 Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  error={errors.fullName}
                />
                
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  error={errors.email}
                />
                
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  value={userData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  error={errors.password}
                />
                
                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  error={errors.confirmPassword}
                />
                
                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={userData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
                
                <div className="flex justify-center md:justify-start">
                  <ImageUploader
                    onImageChange={handleImageChange}
                    preview={profilePreview}
                    error={errors.profilePicture}
                  />
                </div>
              </div>
            </div>

            {/* Education/Role Section */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-6 text-purple-300 flex items-center gap-2">
                🏫 Education & Role
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Dropdown
                  label="Role"
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  options={roleOptions}
                  required
                  error={errors.role}
                />
                
                <InputField
                  label="College / Company"
                  name="college"
                  value={userData.college}
                  onChange={handleChange}
                  placeholder="MIT / Google"
                />
                
                <InputField
                  label="Degree / Profession"
                  name="degree"
                  value={userData.degree}
                  onChange={handleChange}
                  placeholder="Computer Science / Software Engineer"
                />
                
                <Dropdown
                  label="Year / Experience"
                  name="yearOrExperience"
                  value={userData.yearOrExperience}
                  onChange={handleChange}
                  options={yearExperienceOptions}
                />
              </div>
            </div>

            {/* Skills & Preferences Section */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-6 text-purple-300 flex items-center gap-2">
                🛠️ Skills & Preferences
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                <MultiSelectInput
                  label="Primary Skills"
                  name="primarySkills"
                  value={userData.primarySkills}
                  onChange={handleChange}
                  placeholder="JavaScript, React, Node.js, Python, Machine Learning"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MultiSelectInput
                    label="Looking for Help In"
                    name="lookingForHelp"
                    value={userData.lookingForHelp}
                    onChange={handleChange}
                    placeholder="Career guidance, Technical skills, Interview prep"
                  />
                  
                  <MultiSelectInput
                    label="Can Offer Help In"
                    name="canOfferHelp"
                    value={userData.canOfferHelp}
                    onChange={handleChange}
                    placeholder="Web development, Data science, Resume review"
                  />
                </div>
              </div>
            </div>

            {/* Online Presence Section */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-6 text-purple-300 flex items-center gap-2">
                🌐 Online Presence
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="LinkedIn URL"
                  name="linkedinUrl"
                  type="url"
                  value={userData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/johndoe"
                />
                
                <InputField
                  label="GitHub URL"
                  name="githubUrl"
                  type="url"
                  value={userData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/johndoe"
                />
                
                <InputField
                  label="Personal Website"
                  name="personalWebsite"
                  type="url"
                  value={userData.personalWebsite}
                  onChange={handleChange}
                  placeholder="https://johndoe.com"
                  className="md:col-span-2"
                />
              </div>
            </div>

            {/* Bio & Other Section */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-6 text-purple-300 flex items-center gap-2">
                📝 About You
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="group">
                  <label className="block mb-2 font-medium text-purple-200 transition-colors group-focus-within:text-purple-400">
                    About Me
                  </label>
                  <textarea
                    name="aboutMe"
                    value={userData.aboutMe}
                    onChange={handleChange}
                    placeholder="Tell us about yourself, your interests, and what drives you..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/30 transition-all duration-300 border border-white/10 resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Location / Timezone"
                    name="location"
                    value={userData.location}
                    onChange={handleChange}
                    placeholder="New York, NY (EST)"
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
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={userData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-purple-600 bg-white/20 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-purple-200">
                  I agree to the{" "}
                  <a href="/terms" className="text-purple-400 hover:text-purple-300 underline">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                    Privacy Policy
                  </a>
                  <span className="text-pink-400 ml-1">*</span>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-400 text-sm">{errors.agreeToTerms}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </span>
                ) : (
                  "🚀 Join HelpMeMake"
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-white/20">
            <span className="text-purple-200 text-sm">Already have an account? </span>
            <a
              href="/login"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-10px) rotate(3deg); 
          }
          66% { 
            transform: translateY(-5px) rotate(-3deg); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.1; 
          }
          50% { 
            opacity: 0.3; 
          }
        }
      `}</style>
    </div>
  );
}