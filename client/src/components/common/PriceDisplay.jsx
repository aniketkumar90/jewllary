import React from 'react';
import { formatPrice } from '../../utils/formatters';

const PriceDisplay = ({ price, salePrice, size = 'md', className = '', light = false }) => {
  const hasSale = Boolean(salePrice && salePrice < price);

  const sizeClasses = {
    sm: { main: 'text-xs', struck: 'text-[10px]' },
    md: { main: 'text-sm font-medium', struck: 'text-xs' },
    lg: { main: 'text-xl font-medium', struck: 'text-sm' },
    xl: { main: 'text-2xl lg:text-3xl font-serif', struck: 'text-base' },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-baseline gap-2 font-sans ${className}`}>
      <span className={`${light ? 'text-gold-300 font-semibold' : 'text-forest-900'} tracking-wide ${currentSize.main}`}>
        {formatPrice(hasSale ? salePrice : price)}
      </span>
      {hasSale && (
        <span className={`line-through ${light ? 'text-ivory/50' : 'text-charcoal-400'} font-normal ${currentSize.struck}`}>
          {formatPrice(price)}
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
