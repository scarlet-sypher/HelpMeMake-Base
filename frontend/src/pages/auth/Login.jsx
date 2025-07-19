import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NUM_PARTICLES = 30;

// Image array - replace with your actual image imports
const heroImages = [
  "/assets/heroImage1.png",
  "/assets/heroImage2.png", 
  "/assets/heroImage3.png",
  "/assets/heroImage4.png",
  "/assets/heroImage5.png"
];

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [particles, setParticles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize particles with more variety
    setParticles(
      Array.from({ length: NUM_PARTICLES }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 2 + Math.random() * 6,
        delay: Math.random() * 3,
        size: 1 + Math.random() * 3,
        opacity: 0.1 + Math.random() * 0.3
      }))
    );

    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);

    // Image carousel
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(imageInterval);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.username === "user" && form.password === "123") {
      navigate("/userdashboard");
    } else if (form.username === "mentor" && form.password === "123") {
      navigate("/mentordashboard");
    } else {
      setError("Invalid username or password");
    }
  }

  function handleOAuth(provider) {
    alert(`Sign in with ${provider}`);
  }

  return (
    <div className="min-h-screen flex items-stretch bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Enhanced Particle Background */}
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

      {/* Left Image Section with Carousel */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative z-10 p-8">
        <div className="relative w-full h-full max-w-lg">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 transform ${
                index === currentImageIndex 
                  ? 'opacity-100 scale-100 rotate-0' 
                  : 'opacity-0 scale-95 rotate-3'
              }`}
            >
              <img 
                src={img} 
                alt={`Mentorship ${index + 1}`} 
                className="w-full h-full object-cover rounded-3xl shadow-2xl border border-white/10"
              />
            </div>
          ))}
          
          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white shadow-lg' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center relative z-10 p-4 sm:p-8">
        <div className={`bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md border border-white/20 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-purple-200 text-sm">Sign in to your account</p>
          </div>

          {/* Form */}
          <div onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block mb-2 font-medium text-purple-200 transition-colors group-focus-within:text-purple-400">
                Username
              </label>
              <input 
                name="username" 
                value={form.username} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/30 transition-all duration-300 border border-white/10"
                placeholder="Enter your username"
              />
            </div>

            <div className="group">
              <label className="block mb-2 font-medium text-purple-200 transition-colors group-focus-within:text-purple-400">
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/30 transition-all duration-300 border border-white/10 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg border border-red-500/30 animate-pulse">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Sign In
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-purple-200 text-sm">or continue with</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* OAuth Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => handleOAuth("Google")} 
              className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg transition-all duration-300 font-semibold border border-white/10 hover:border-white/30 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>🔍</span> Google
            </button>
            <button 
              onClick={() => handleOAuth("GitHub")} 
              className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg transition-all duration-300 font-semibold border border-white/10 hover:border-white/30 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>🐙</span> GitHub
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 pt-6 border-t border-white/20">
            <span className="text-purple-200 text-sm">Don't have an account? </span>
            <a 
              href="/signup" 
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-15px) rotate(5deg); 
          }
          66% { 
            transform: translateY(-5px) rotate(-5deg); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.1; 
          }
          50% { 
            opacity: 0.4; 
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        /* Mobile-specific styles */
        @media (max-width: 1024px) {
          .min-h-screen {
            min-height: 100vh;
            min-height: 100dvh;
          }
        }
      `}</style>
    </div>
  );
}