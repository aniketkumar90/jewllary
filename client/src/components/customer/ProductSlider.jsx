import React, { useRef, useEffect } from 'react';
import ProductCard from './ProductCard';

const ProductSlider = ({ products = [] }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider || products.length === 0) return;

    let animationFrameId;
    let isTouching = false;
    let isUserScrolling = false;
    let isHovered = false;
    let scrollTimeout = null;
    let hasInitialized = false;
    const speed = 0.75; // Smooth luxury auto-scroll speed
    let scrollPos = slider.scrollLeft;

    const normalizePosition = () => {
      if (!slider) return;
      const singleSetWidth = slider.scrollWidth / 3;
      if (singleSetWidth <= 0) return;

      // Seamless infinite wrap in both directions
      if (slider.scrollLeft >= singleSetWidth * 2) {
        slider.scrollLeft -= singleSetWidth;
        scrollPos = slider.scrollLeft;
      } else if (slider.scrollLeft <= singleSetWidth * 0.15) {
        slider.scrollLeft += singleSetWidth;
        scrollPos = slider.scrollLeft;
      }
    };

    // Auto-scroll loop using requestAnimationFrame
    const step = () => {
      if (slider) {
        const singleSetWidth = slider.scrollWidth / 3;

        if (singleSetWidth > 0) {
          // Initialize to middle set on first layout so user can scroll left or right infinitely
          if (!hasInitialized) {
            if (slider.scrollLeft === 0) {
              slider.scrollLeft = singleSetWidth;
              scrollPos = singleSetWidth;
            } else {
              scrollPos = slider.scrollLeft;
            }
            hasInitialized = true;
          }

          // Only advance if user is not touching, not momentum-scrolling, and not hovering
          if (!isTouching && !isUserScrolling && !isHovered) {
            // Check bounds before advancing
            if (scrollPos >= singleSetWidth * 2) {
              scrollPos -= singleSetWidth;
              slider.scrollLeft = scrollPos;
            } else if (scrollPos <= singleSetWidth * 0.15) {
              scrollPos += singleSetWidth;
              slider.scrollLeft = scrollPos;
            }

            scrollPos += speed;
            slider.scrollLeft = scrollPos;
          }
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    // Manual scroll listeners
    const handleTouchStart = () => {
      isTouching = true;
      isUserScrolling = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollPos = slider.scrollLeft;
    };

    const handleTouchMove = () => {
      isTouching = true;
      isUserScrolling = true;
      scrollPos = slider.scrollLeft;
    };

    const handleTouchEnd = () => {
      isTouching = false;
      scrollPos = slider.scrollLeft;

      // Allow momentum/inertia scrolling to settle before resuming auto-scroll
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        normalizePosition();
        isUserScrolling = false;
        if (slider) {
          scrollPos = slider.scrollLeft;
        }
      }, 160);
    };

    const handleWheel = () => {
      isUserScrolling = true;
      scrollPos = slider.scrollLeft;

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        normalizePosition();
        isUserScrolling = false;
        if (slider) {
          scrollPos = slider.scrollLeft;
        }
      }, 160);
    };

    const handleScroll = () => {
      // If user is actively touching or in momentum scrolling:
      if (isTouching || isUserScrolling) {
        scrollPos = slider.scrollLeft;

        // Reset momentum timeout on each scroll tick during inertia deceleration
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          normalizePosition();
          isUserScrolling = false;
          if (slider) {
            scrollPos = slider.scrollLeft;
          }
        }, 160);
      }
    };

    // Desktop hover handling (only when device supports actual hover, avoiding sticky hover on mobile)
    const handleMouseEnter = () => {
      if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
        isHovered = true;
      }
    };

    const handleMouseLeave = () => {
      isHovered = false;
    };

    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.addEventListener('touchmove', handleTouchMove, { passive: true });
    slider.addEventListener('touchend', handleTouchEnd, { passive: true });
    slider.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    slider.addEventListener('wheel', handleWheel, { passive: true });
    slider.addEventListener('scroll', handleScroll, { passive: true });
    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchmove', handleTouchMove);
      slider.removeEventListener('touchend', handleTouchEnd);
      slider.removeEventListener('touchcancel', handleTouchEnd);
      slider.removeEventListener('wheel', handleWheel);
      slider.removeEventListener('scroll', handleScroll);
      slider.removeEventListener('mouseenter', handleMouseEnter);
      slider.removeEventListener('mouseleave', handleMouseLeave);
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
        className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none pb-4 px-2 select-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain',
        }}
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
