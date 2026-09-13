import React from 'react';
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';

const Button = ({
  children,
  type = 'button',
  variant = 'gold', // gold | forest | outline | ghost | danger
  size = 'md', // sm | md | lg
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-sans uppercase tracking-wider sm:tracking-widest font-medium transition-all duration-300 relative focus:outline-none text-center select-none';

  const sizeStyles = {
    sm: 'px-3.5 py-2 text-[10px] rounded',
    md: 'px-5 sm:px-7 py-3 sm:py-3.5 text-xs rounded-sm',
    lg: 'px-5 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm rounded-sm',
  };

  const variantStyles = {
    gold: 'bg-gold-500 text-forest-900 hover:bg-gold-400 active:bg-gold-600 shadow-md hover:shadow-gold-glow',
    forest: 'bg-forest-800 text-ivory border border-gold-500/30 hover:border-gold-400 hover:bg-forest-700 active:bg-forest-900',
    outline: 'border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-forest-900 active:bg-gold-600',
    ghost: 'text-charcoal-700 hover:text-gold-600 bg-transparent',
    danger: 'bg-rose-900 text-ivory border border-rose-600/40 hover:bg-rose-800',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.01 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.gold}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? disabledStyles : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2 text-center">
          <FiLoader className="animate-spin text-sm shrink-0" />
          <span>Processing...</span>
        </span>
      ) : (
        <span className="inline-flex items-center justify-center gap-2 text-center max-w-full">
          {Icon && <Icon className="text-sm shrink-0" />}
          <span className="text-center leading-snug">{children}</span>
        </span>
      )}
    </motion.button>
  );
};

export default Button;
