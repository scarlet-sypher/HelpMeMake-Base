import { Eye, EyeOff } from 'lucide-react'; 
import { useState } from "react";

const PasswordField = ({ label, name, value, onChange, required = false, placeholder, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="group">
      <label className="block mb-2 font-medium text-emerald-200 transition-colors group-focus-within:text-cyan-400 transform group-focus-within:scale-105 origin-left duration-300">
        {label} {required && <span className="text-pink-400 animate-pulse">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-12 rounded-lg bg-white/10 text-white placeholder-emerald-300/70 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white/20 transition-all duration-300 border border-white/20 backdrop-blur-sm hover:bg-white/15 hover:border-cyan-400/50 ${error ? 'border-red-400 focus:ring-red-400 animate-shake' : ''}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-300 hover:text-cyan-400 transition-colors duration-200 hover:scale-110"
        >
          {showPassword ? <Eye /> : <EyeOff />}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-1 animate-slideInLeft">{error}</p>}
    </div>
  );
};


export default PasswordField ;