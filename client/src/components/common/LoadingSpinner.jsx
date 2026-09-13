import React from 'react';

const LoadingSpinner = ({ size = 'md', label = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-14 h-14 border-3',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`
          ${sizeClasses[size] || sizeClasses.md}
          border-gold-500/20 border-t-gold-500 rounded-full animate-spin
        `}
      />
      {label && (
        <p className="text-[11px] font-sans uppercase tracking-luxury text-charcoal-500">
          {label}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
