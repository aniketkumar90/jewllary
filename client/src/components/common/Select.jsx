import React from 'react';

const Select = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  error = '',
  required = false,
  disabled = false,
  dark = false,
  placeholder = 'Select option...',
  className = '',
  ...props
}) => {
  const selectId = id || name;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className={`block text-[11px] uppercase tracking-luxury font-medium mb-1.5 ${
            dark ? 'text-gold-300/90' : 'text-charcoal-700'
          }`}
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full text-sm border font-sans py-3 px-4 rounded-sm
          transition-all duration-200 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50
          ${
            dark
              ? 'bg-[#18281d] text-ivory border-gold-500/35 focus:bg-[#1f3227]'
              : 'bg-white text-charcoal-800 border-[#E2D9CC]'
          }
          ${error ? '!border-rose-400 focus:!border-rose-500 focus:!ring-rose-400/50' : ''}
          ${disabled ? (dark ? 'bg-[#111c14] text-ivory/40 cursor-not-allowed' : 'bg-ivory-200 text-charcoal-400 cursor-not-allowed') : ''}
        `}
        {...props}
      >
        {placeholder && <option value="" className={dark ? "bg-[#18281d] text-ivory/60" : ""}>{placeholder}</option>}
        {options.map((opt) => (
          <option
            key={opt.value ?? opt}
            value={opt.value ?? opt}
            className={dark ? "bg-[#18281d] text-ivory" : ""}
          >
            {opt.label ?? opt}
          </option>
        ))}
      </select>

      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </div>
  );
};

export default Select;
