import React from 'react';

const Input = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  dark = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const inputId = id || name;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-[11px] uppercase tracking-luxury font-medium mb-1.5 ${
            dark ? 'text-gold-300/90' : 'text-charcoal-700'
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div
            className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
              dark ? 'text-gold-400/60' : 'text-charcoal-400'
            }`}
          >
            <Icon className="text-sm" />
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full text-sm border font-sans py-3 px-4 rounded-sm
            transition-all duration-200
            focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50
            ${Icon ? 'pl-10' : ''}
            ${
              dark
                ? 'bg-[#18281d] text-ivory border-gold-500/35 placeholder:text-ivory/40 focus:bg-[#1f3227]'
                : 'bg-white text-charcoal-800 border-[#E2D9CC] placeholder:text-charcoal-400/60'
            }
            ${error ? '!border-rose-400 focus:!border-rose-500 focus:!ring-rose-400/50' : ''}
            ${disabled ? (dark ? 'bg-[#111c14] text-ivory/40 cursor-not-allowed' : 'bg-ivory-200 text-charcoal-400 cursor-not-allowed') : ''}
          `}
          {...props}
        />
      </div>

      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
      {helperText && !error && (
        <p className={`mt-1.5 text-xs ${dark ? 'text-ivory/60' : 'text-charcoal-500'}`}>{helperText}</p>
      )}
    </div>
  );
};

export default Input;
