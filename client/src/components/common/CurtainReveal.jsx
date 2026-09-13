import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CurtainReveal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // Check if curtain has already been shown in this tab session
    const hasSeenCurtain = sessionStorage.getItem('vanya_curtain_seen');
    
    // Automatically trigger the opening after a royal pause (600ms)
    const openTimer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem('vanya_curtain_seen', 'true');
    }, 700);

    // Unmount completely from DOM after animation completes (2.6s)
    const removeTimer = setTimeout(() => {
      setIsRemoved(true);
    }, 2700);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const handleSkip = () => {
    setIsOpen(true);
    sessionStorage.setItem('vanya_curtain_seen', 'true');
    setTimeout(() => setIsRemoved(true), 1200);
  };

  if (isRemoved) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[99999] overflow-hidden pointer-events-auto select-none cursor-pointer"
        onClick={handleSkip}
        title="Click to unveil Maison Vanya"
      >
        {/* Center Golden Light Flare that shines as the curtain parts */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={
            isOpen
              ? { opacity: [0, 1, 0.8, 0], scaleY: [0.2, 1, 1, 1], scaleX: [1, 2.5, 4, 0] }
              : { opacity: 0, scaleY: 0 }
          }
          transition={{ duration: 1.4, delay: 0.1, ease: 'easeOut' }}
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 sm:w-16 bg-gradient-to-r from-transparent via-gold-300 to-transparent blur-md z-20 pointer-events-none"
        />

        {/* ================= LEFT CURTAIN ================= */}
        <motion.div
          initial={{ x: '0%', scaleX: 1 }}
          animate={isOpen ? { x: '-102%', scaleX: 0.85 } : { x: '0%', scaleX: 1 }}
          transition={{
            duration: 1.5,
            ease: [0.76, 0, 0.24, 1],
            delay: 0.1,
          }}
          style={{ transformOrigin: 'left center' }}
          className="absolute top-0 bottom-0 left-0 w-1/2 h-full z-10 overflow-hidden shadow-[20px_0_40px_rgba(0,0,0,0.8)]"
        >
          {/* 3D Realistic Velvet Fabric Texture */}
          <div
            className="w-full h-full relative"
            style={{
              background: `
                linear-gradient(to bottom, rgba(12, 1, 4, 0.9) 0%, rgba(25, 2, 8, 0.4) 15%, transparent 35%),
                linear-gradient(to top, rgba(10, 1, 4, 0.95) 0%, rgba(20, 2, 7, 0.6) 12%, transparent 30%),
                linear-gradient(to left, rgba(0, 0, 0, 0.65) 0%, transparent 40px),
                repeating-linear-gradient(
                  90deg,
                  #1d0208 0px,
                  #34040e 10px,
                  #5e0a1d 26px,
                  #981534 46px,
                  #c6274e 56px,
                  #e4597d 61px,
                  #c6274e 66px,
                  #981534 76px,
                  #5e0a1d 96px,
                  #34040e 112px,
                  #1d0208 122px
                )
              `,
            }}
          >
            {/* Ambient Velvet Sheen / Vertical Fold Creases */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/40 pointer-events-none" />

            {/* Right edge hem/seam shadow */}
            <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-l from-black/70 to-transparent" />
          </div>
        </motion.div>

        {/* ================= RIGHT CURTAIN ================= */}
        <motion.div
          initial={{ x: '0%', scaleX: 1 }}
          animate={isOpen ? { x: '102%', scaleX: 0.85 } : { x: '0%', scaleX: 1 }}
          transition={{
            duration: 1.5,
            ease: [0.76, 0, 0.24, 1],
            delay: 0.1,
          }}
          style={{ transformOrigin: 'right center' }}
          className="absolute top-0 bottom-0 right-0 w-1/2 h-full z-10 overflow-hidden shadow-[-20px_0_40px_rgba(0,0,0,0.8)]"
        >
          {/* 3D Realistic Velvet Fabric Texture */}
          <div
            className="w-full h-full relative"
            style={{
              background: `
                linear-gradient(to bottom, rgba(12, 1, 4, 0.9) 0%, rgba(25, 2, 8, 0.4) 15%, transparent 35%),
                linear-gradient(to top, rgba(10, 1, 4, 0.95) 0%, rgba(20, 2, 7, 0.6) 12%, transparent 30%),
                linear-gradient(to right, rgba(0, 0, 0, 0.65) 0%, transparent 40px),
                repeating-linear-gradient(
                  90deg,
                  #1d0208 0px,
                  #34040e 10px,
                  #5e0a1d 26px,
                  #981534 46px,
                  #c6274e 56px,
                  #e4597d 61px,
                  #c6274e 66px,
                  #981534 76px,
                  #5e0a1d 96px,
                  #34040e 112px,
                  #1d0208 122px
                )
              `,
            }}
          >
            {/* Ambient Velvet Sheen / Vertical Fold Creases */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/40 pointer-events-none" />

            {/* Left edge hem/seam shadow */}
            <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/70 to-transparent" />
          </div>
        </motion.div>

        {/* ================= ROYAL CENTER MEDALLION ================= */}
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={
            isOpen
              ? { opacity: 0, scale: 1.15, filter: 'blur(6px)' }
              : { opacity: 1, scale: 1, filter: 'blur(0px)' }
          }
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none text-center flex flex-col items-center justify-center"
        >
          {/* Royal Emblem Card */}
          <div className="relative rounded-2xl border border-gold-400/80 bg-[#121c15]/92 backdrop-blur-md flex flex-col items-center justify-center p-6 shadow-[0_0_60px_rgba(212,175,55,0.45)] max-w-xs">
            <div className="absolute inset-2 border border-gold-400/30 rounded-xl pointer-events-none" />
            
            {/* Logo Image */}
            <img
              src="/images/logo.png"
              alt="New Shiv Jewellers"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-md mb-3 shadow-lg"
            />
            
            <h1 className="font-serif text-xl sm:text-2xl text-gold-300 tracking-[0.16em] uppercase font-bold leading-tight drop-shadow">
              NEW SHIV JEWELLERS
            </h1>
            
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-ivory/90 font-medium mt-1">
              FINE JEWELS • EST. 2024
            </span>

            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-2.5" />
          </div>

          {/* Gentle skip hint */}
          <span className="text-[10px] uppercase tracking-luxury text-ivory/70 mt-3 font-light drop-shadow">
            ✦ Click anywhere to unveil ✦
          </span>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CurtainReveal;
