import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

const QuantitySelector = ({
  quantity = 1,
  onIncrease,
  onDecrease,
  min = 1,
  max = 10,
  className = '',
  dark = true,
}) => {
  return (
    <div
      className={`inline-flex items-center rounded-sm border ${
        dark ? 'border-gold-500/35 bg-[#18281d]' : 'border-[#E2D9CC] bg-white'
      } ${className}`}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        className={`w-9 h-9 flex items-center justify-center transition-colors disabled:opacity-30 disabled:pointer-events-none ${
          dark ? 'text-gold-400 hover:text-gold-200' : 'text-charcoal-500 hover:text-gold-600'
        }`}
        aria-label="Decrease quantity"
      >
        <FiMinus className="text-xs" />
      </button>

      <span
        className={`w-10 text-center font-sans text-xs font-semibold ${
          dark ? 'text-ivory' : 'text-charcoal-800'
        }`}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className={`w-9 h-9 flex items-center justify-center transition-colors disabled:opacity-30 disabled:pointer-events-none ${
          dark ? 'text-gold-400 hover:text-gold-200' : 'text-charcoal-500 hover:text-gold-600'
        }`}
        aria-label="Increase quantity"
      >
        <FiPlus className="text-xs" />
      </button>
    </div>
  );
};

export default QuantitySelector;
