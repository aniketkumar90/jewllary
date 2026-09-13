import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  if (!category) return null;

  return (
    <div className="group relative flex flex-col items-center w-full">
      <Link
        to={`/jewellery/${category.slug}`}
        className="relative w-full aspect-[1/1.55] sm:aspect-[1/1.62] overflow-hidden rounded-t-[120px] sm:rounded-t-[150px] lg:rounded-t-[160px] rounded-b-md bg-[#131c15] border border-gold-400/40 transition-all duration-700 hover:border-gold-300 block"
      >
        {/* Background Photo */}
        <img
          src={category.image?.secure_url}
          alt={category.name}
          className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-108 brightness-[0.80] group-hover:brightness-[0.92]"
          loading="lazy"
        />

        {/* Ambient Top Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#101812]/50 via-transparent to-transparent pointer-events-none" />

        {/* Cinematic Deep Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1610] via-[#0e1610]/55 to-transparent pointer-events-none" />

        {/* Double Inset Gold Arch Border */}
        <div className="absolute inset-2 sm:inset-2.5 border border-gold-400/35 rounded-t-[105px] sm:rounded-t-[135px] lg:rounded-t-[145px] rounded-b-sm pointer-events-none transition-all duration-500 group-hover:border-gold-300/80 z-20" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-center flex flex-col items-center z-10">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-luxury text-gold-400 font-semibold mb-1 block drop-shadow">
            ✦ {category.productCount ? `${category.productCount} CREATIONS` : 'HAUTE COLLECTION'} ✦
          </span>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-serif text-ivory tracking-wider leading-snug uppercase font-normal mb-3 group-hover:text-gold-300 transition-colors drop-shadow-md">
            {category.name}
          </h3>
          <span className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-gold-400/70 bg-[#131c15]/75 backdrop-blur-md text-[9px] sm:text-[10px] uppercase tracking-luxury text-gold-200 font-medium group-hover:bg-gold-500 group-hover:text-forest-950 group-hover:border-gold-400 transition-all duration-300 shadow-xl">
            EXPLORE JEWELLERY
          </span>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
