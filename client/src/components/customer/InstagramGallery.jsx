import React, { useState } from 'react';
import { FiInstagram } from 'react-icons/fi';
import SectionHeading from './SectionHeading';

const InstagramGallery = ({ images = [] }) => {
  const [isPaused, setIsPaused] = useState(false);

  if (!images || images.length === 0) return null;

  // Ensure plenty of elements for seamless continuous infinite marquee across any screen width
  const baseImages = images.length < 8 ? [...images, ...images] : images;
  const displayImages = [...baseImages, ...baseImages];

  return (
    <section className="py-24 bg-[#18281d] text-ivory border-y border-gold-400/30 relative overflow-hidden">
      {/* Ambient Warm Golden Sunlight Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,_rgba(212,175,55,0.18),_transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_70%,_rgba(212,175,55,0.10),_transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 relative z-10">
        <SectionHeading
          subtitle="Follow The Maison"
          title="#NewShivJewellers"
          description="Immerse yourself in behind-the-scenes karigar craftsmanship, private royal showcases, and bridal salon moments."
          light={true}
        />
      </div>

      {/* Auto-Scroll Track Container */}
      <div className="relative w-full overflow-hidden">
        {/* Soft luxury side frosted blur on left & right matching dark royal green */}
        <div 
          className="absolute left-0 inset-y-0 w-12 sm:w-24 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #18281d 10%, rgba(24, 40, 29, 0.7) 50%, transparent 100%)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            maskImage: 'linear-gradient(to right, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 100%)',
          }}
        />
        <div 
          className="absolute right-0 inset-y-0 w-12 sm:w-24 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #18281d 10%, rgba(24, 40, 29, 0.7) 50%, transparent 100%)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            maskImage: 'linear-gradient(to left, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to left, black 30%, transparent 100%)',
          }}
        />

        <div
          className="animate-marquee-infinite gap-4 sm:gap-6 py-2 px-4 select-none"
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {displayImages.map((item, index) => (
            <a
              key={index}
              href={item.link || 'https://instagram.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-[170px] sm:w-[200px] md:w-[220px] aspect-[1/1.4] flex-shrink-0 overflow-hidden rounded-t-[65px] sm:rounded-t-[85px] rounded-b-md bg-[#131c15] border border-gold-400/40 block transition-all duration-500 hover:border-gold-300"
            >
              <img
                src={item.image}
                alt="New Shiv Jewellers Maison Moment"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 brightness-[0.88] group-hover:brightness-[0.95]"
                loading="lazy"
              />

              {/* Double Inset Gold Arch Border */}
              <div className="absolute inset-1.5 sm:inset-2 border border-gold-400/35 rounded-t-[55px] sm:rounded-t-[75px] rounded-b-sm pointer-events-none transition-all duration-500 group-hover:border-gold-300/80 z-10" />

              {/* Dark Vignette Overlay on hover */}
              <div className="absolute inset-0 bg-[#0e1610]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-ivory p-2 text-center z-20">
                <FiInstagram className="text-2xl text-gold-400 mb-1.5 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-[9px] uppercase tracking-luxury text-gold-200 font-medium">
                  {item.handle || '@newshivjewellers'}
                </span>
                <span className="text-[8px] text-ivory/70 tracking-widest mt-1">
                  VIEW POST
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramGallery;

