import React from 'react';

const StatCard = ({ title, value, icon: Icon, change, changeType = 'positive', subtitle }) => {
  return (
    <div className="bg-[#142318] border border-gold-400/30 rounded-xl p-6 shadow-xl shadow-black/40 flex items-start justify-between text-left">
      <div>
        <p className="text-[10px] sm:text-[11px] uppercase tracking-luxury text-gold-400 font-semibold mb-1 font-sans">
          {title}
        </p>
        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-gold-300 tracking-tight">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs text-ivory/60 mt-1 font-light">{subtitle}</p>
        )}
        {change && (
          <p
            className={`text-xs mt-2 font-medium flex items-center gap-1 ${
              changeType === 'positive' ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            <span>{changeType === 'positive' ? '↑' : '↓'}</span>
            <span>{change}</span>
          </p>
        )}
      </div>

      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-gold-500/15 border border-gold-400/40 flex items-center justify-center text-gold-300 flex-shrink-0 shadow-inner">
          <Icon className="text-xl" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
