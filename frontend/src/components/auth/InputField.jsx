import { useState, useEffect, useRef } from "react";


const InputField = ({ label, name, type = "text", value, onChange, required = false, placeholder, className = "", error }) => (
  <div className="group">
    <label className="block mb-2 font-medium text-purple-200 transition-colors group-focus-within:text-purple-400">
      {label} {required && <span className="text-pink-400">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/30 transition-all duration-300 border border-white/10 ${className} ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
    />
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </div>
);


export default InputField ;
