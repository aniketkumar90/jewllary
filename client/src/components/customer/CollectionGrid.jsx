import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CollectionCard from './CollectionCard';

const CollectionGrid = ({ collections = [], autoPlayInterval = 2500 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Auto-play effect on mobile (2.5s interval)
  useEffect(() => {
    if (!collections || collections.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % collections.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [collections, isPaused, autoPlayInterval]);

  if (!collections || collections.length === 0) return null;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % collections.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + collections.length) % collections.length);
  };

  const goToSlide = (idx) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  // Touch swipe gestures for mobile
  const handleTouchStart = (e) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      handleNext(); // Left swipe -> next
    } else if (distance < -45) {
      handlePrev(); // Right swipe -> prev
    }
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.97,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 32 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.97,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 32 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    }),
  };

  return (
    <div className="w-full">
      {/* 1. Desktop & Tablet Grid (All 4 cards side-by-side) */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-7xl mx-auto">
        {collections.map((collection) => (
          <CollectionCard
            key={collection._id}
            collection={collection}
          />
        ))}
      </div>

      {/* 2. Mobile Phone View: 1 Card at a time with 2-second auto-slide & manual controls */}
      <div
        className="block sm:hidden relative w-full max-w-[330px] mx-auto px-1 select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Single Animated Arched Card */}
        <div className="relative overflow-hidden rounded-t-[125px] rounded-b-md">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              <CollectionCard collection={collections[currentIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Manual Segmented Indicators & Counter */}
        {collections.length > 1 && (
          <div className="mt-5 flex flex-col items-center">
            <div className="flex items-center justify-center gap-2">
              {collections.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Show collection chapter ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === currentIndex
                      ? 'w-8 bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.7)]'
                      : 'w-2.5 bg-gold-500/25 hover:bg-gold-500/50'
                  }`}
                />
              ))}
            </div>

            <span className="text-[10px] uppercase tracking-luxury text-gold-400/80 font-mono mt-2 block">
              {String(currentIndex + 1).padStart(2, '0')} / {String(collections.length).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionGrid;

