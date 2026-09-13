import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PriceDisplay from '../common/PriceDisplay';
import { FiArrowRight } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const mainImageUrl = product.mainImage?.secure_url;
  const secondaryImageUrl = product.galleryImages?.[0]?.secure_url || mainImageUrl;

  return (
    <div
      className="group relative flex flex-col items-center w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Arched Window Card Frame (Royal Jharokha Silhouette - Optimized for 2-column mobile and multi-col desktop) */}
      <div className="relative w-full aspect-[1/1.62] sm:aspect-[1/1.62] overflow-hidden rounded-t-[75px] xs:rounded-t-[90px] sm:rounded-t-[140px] lg:rounded-t-[160px] rounded-b-md bg-[#131c15] border border-gold-400/40 transition-all duration-700 hover:border-gold-300 shadow-lg shadow-black/40">
        
        {/* Background Product Image with Smooth Zoom & Alternate Angle on Hover */}
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered && secondaryImageUrl ? secondaryImageUrl : mainImageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-all duration-1000 ease-out group-hover:scale-108 brightness-[0.84] group-hover:brightness-[0.95]"
            loading="lazy"
          />
        </Link>

        {/* Ambient Top Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#101812]/50 via-transparent to-transparent pointer-events-none" />

        {/* Deep Cinematic Vignette Overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1610] via-[#0e1610]/65 to-transparent pointer-events-none" />

        {/* Double Inset Gold Arch Border following the exact curvature */}
        <div className="absolute inset-1.5 sm:inset-2.5 border border-gold-400/35 rounded-t-[65px] xs:rounded-t-[80px] sm:rounded-t-[125px] lg:rounded-t-[145px] rounded-b-sm pointer-events-none transition-all duration-500 group-hover:border-gold-300/80 z-20" />

        {/* Content Overlay inside the Arch */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-4 md:p-5 text-center flex flex-col items-center z-20">
          <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-luxury text-gold-400 font-semibold mb-0.5 sm:mb-1 block drop-shadow truncate max-w-full px-1">
            ✦ {product.category?.name || 'ROYAL JEWELLERY'} ✦
          </span>

          <Link to={`/product/${product.slug}`} className="block w-full">
            <h3 className="text-[13px] sm:text-base lg:text-lg font-serif text-ivory tracking-wider leading-tight sm:leading-snug uppercase font-normal mb-0.5 sm:mb-1 group-hover:text-gold-300 transition-colors drop-shadow-md line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-[9px] sm:text-[10px] md:text-[11px] text-ivory/70 font-sans font-light line-clamp-1 mb-1.5 sm:mb-2 leading-relaxed drop-shadow truncate max-w-full px-1">
            {product.material} {product.weight ? `• ${product.weight}` : ''}
          </p>

          {/* Price Display in warm Gold */}
          <div className="mb-2 sm:mb-3 flex items-center justify-center gap-1.5 drop-shadow scale-90 sm:scale-100 origin-center">
            <PriceDisplay
              price={product.price}
              salePrice={product.salePrice}
              size="md"
              light={true}
            />
          </div>

          {/* Luxury Pill-Shaped Action Button */}
          <Link
            to={`/product/${product.slug}`}
            className="inline-flex items-center justify-center px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-gold-400/70 bg-[#131c15]/80 backdrop-blur-md text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-luxury text-gold-200 font-medium hover:bg-gold-500 hover:text-forest-950 hover:border-gold-400 transition-all duration-300 shadow-xl group/btn"
          >
            <span className="hidden sm:inline">VIEW HEIRLOOM</span>
            <span className="inline sm:hidden">EXPLORE</span>
            <FiArrowRight className="ml-1 text-[10px] sm:text-xs transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
