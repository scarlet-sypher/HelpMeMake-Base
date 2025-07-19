const Dropdown = ({ label, name, value, onChange, options, required = false, error }) => (
  <div className="group">
    <label className="block mb-2 font-medium text-purple-200 transition-colors group-focus-within:text-purple-400">
      {label} {required && <span className="text-pink-400">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-4 py-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/30 transition-all duration-300 border border-white/10 ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
    >
      <option value="" className="bg-slate-800">Select an option</option>
      {options.map(option => (
        <option key={option.value} value={option.value} className="bg-slate-800">
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </div>
);

export default Dropdown ;