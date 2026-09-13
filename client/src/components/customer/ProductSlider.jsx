import React, { useRef, useEffect } from 'react';
import ProductCard from './ProductCard';

const ProductSlider = ({ products = [] }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider || products.length === 0) return;

    let animationFrameId;
    let isPaused = false;
    const speed = 0.75; // Smooth luxury auto-scroll speed
    let scrollPos = slider.scrollLeft;

    const step = () => {
      if (!isPaused && slider) {
        scrollPos += speed;
        // Seamless loop when scrolled past one set of duplicated content
        const loopThreshold = slider.scrollWidth / 3;
        if (scrollPos >= loopThreshold) {
          scrollPos = 0;
        }
        slider.scrollLeft = scrollPos;
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };
    const handleTouchStart = () => { isPaused = true; };
    const handleTouchEnd = () => { isPaused = false; };

    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('touchstart', handleTouchStart);
    slider.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationFrameId);
      slider.removeEventListener('mouseenter', handleMouseEnter);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchend', handleTouchEnd);
    };
  }, [products]);

  if (!products || products.length === 0) return null;

  // Duplicate products 3x for flawless infinite seamless auto-scrolling across any screen width
  const displayProducts = [...products, ...products, ...products];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Left Soft Luxury Frosted Blur Vignette (Royal Green Theme) */}
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

      {/* Right Soft Luxury Frosted Blur Vignette (Royal Green Theme) */}
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

      {/* Auto-Scroll Slider Track */}
      <div
        ref={scrollRef}
        className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none pb-4 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayProducts.map((product, idx) => (
          <div
            key={`${product._id}-${idx}`}
            className="w-[260px] sm:w-[290px] flex-shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;
