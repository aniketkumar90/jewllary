import React from 'react';

const SectionHeading = ({
  subtitle,
  title,
  description,
  alignment = 'center', // center | left
  light = false,
  className = '',
}) => {
  const isCenter = alignment === 'center';

  return (
    <div className={`mb-12 ${isCenter ? 'text-center mx-auto' : 'text-left'} max-w-2xl ${className}`}>
      {subtitle && (
        <span
          className={`block text-[11px] uppercase tracking-luxury font-medium mb-2 ${
            light ? 'text-gold-400' : 'text-gold-600'
          }`}
        >
          ✦ {subtitle} ✦
        </span>
      )}

      <h2
        className={`text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight leading-tight ${
          light ? 'text-ivory' : 'text-forest-900'
        }`}
      >
        {title}
      </h2>

      {/* Gold decorative accent line */}
      <div className={`flex items-center gap-2 my-3.5 ${isCenter ? 'justify-center' : 'justify-start'}`}>
        <span className={`h-[1px] w-8 ${light ? 'bg-gold-500/40' : 'bg-gold-500/60'}`} />
        <span className="text-gold-500 text-xs">❖</span>
        <span className={`h-[1px] w-8 ${light ? 'bg-gold-500/40' : 'bg-gold-500/60'}`} />
      </div>

      {description && (
        <p
          className={`text-xs sm:text-sm font-sans leading-relaxed ${
            light ? 'text-ivory/70' : 'text-charcoal-600'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
