import React from 'react';

const Badge = ({ children, variant = 'gold', size = 'sm', className = '' }) => {
  const variantStyles = {
    gold: 'bg-gold-100 text-gold-800 border-gold-300',
    forest: 'bg-forest-800 text-ivory border-gold-500/30',
    olive: 'bg-olive-800 text-gold-200 border-olive-700',
    sale: 'bg-rose-100 text-rose-800 border-rose-300',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    neutral: 'bg-ivory-200 text-charcoal-700 border-[#E2D9CC]',
  };

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[9px]',
    sm: 'px-2.5 py-1 text-[10px]',
    md: 'px-3 py-1.5 text-xs',
  };

  return (
    <span
      className={`
        inline-flex items-center uppercase tracking-luxury font-medium border
        ${variantStyles[variant] || variantStyles.gold}
        ${sizeStyles[size] || sizeStyles.sm}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
