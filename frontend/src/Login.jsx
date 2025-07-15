import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "./assets/heroImage.png";

const NUM_PARTICLES = 20;

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setParticles(
      Array.from({ length: NUM_PARTICLES }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 2
      }))
    );
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
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: p.left,
              top: p.top,
              animation: `float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>
      {/* Left Image (hidden on mobile) */}
      <div className="hidden md:flex w-1/2 items-center justify-center relative z-10">
        <img src={heroImage} alt="Mentorship" className="w-4/5 h-auto rounded-3xl shadow-2xl" />
      </div>
      {/* Right Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center relative z-10">
        <div className="bg-white/10 rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Username</label>
              <input name="username" value={form.username} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            <button type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded transition-colors">Login</button>
          </form>
          <div className="text-center my-4">
            <span className="text-purple-200">or login with</span>
            <div className="mt-2 flex justify-center gap-4">
              <button onClick={() => handleOAuth("Google")} className="bg-white/20 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors font-semibold">Gmail</button>
              <button onClick={() => handleOAuth("GitHub")} className="bg-white/20 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors font-semibold">GitHub</button>
            </div>
          </div>
          <div className="text-center mt-4">
            <span className="text-purple-200">Don't have an account? </span>
            <a href="/signup" className="text-purple-400 hover:underline font-semibold">Sign up</a>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
