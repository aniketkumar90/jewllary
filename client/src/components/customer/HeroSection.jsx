import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { FiArrowRight } from 'react-icons/fi';

const HeroSection = ({ heroData }) => {
  const {
    smallText = 'EST. 2024 • FINE JEWELS',
    heading = 'New Shiv Jewellers\nRoyal Indian Heirlooms',
    description = 'Step into a sanctuary of divine craftsmanship. Handcrafted in 22K hallmarked gold, uncut Polki diamonds, and sacred temple jewellery.',
    buttonText = 'Explore Collection',
    buttonLink = '/jewellery',
    image = {
      secure_url: '/images/hero-banner.png?v=2',
    },
  } = heroData || {};

  return (
    <section className="relative w-full h-screen h-[100svh] h-[100dvh] min-h-screen min-h-[100svh] min-h-[100dvh] sm:min-h-[650px] overflow-hidden bg-[#273e32] flex items-center">
      {/* Background Image with Slow Zoom & Lighter Warm Luxury Styling */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 12, ease: 'easeOut' }}
          className="w-full h-full"
        >
          <img
            src={image?.secure_url || '/images/hero-banner.png?v=2'}
            alt="New Shiv Jewellers Royal Collection"
            className="w-full h-full object-cover object-[66%_center] sm:object-center brightness-[0.92] contrast-[1.02]"
          />
        </motion.div>
        {/* Soft ambient gradient for text legibility while keeping the centered royal bride luminous */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 sm:to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#22372c]/90 via-[#273e32]/40 to-transparent pointer-events-none" />
      </div>

      {/* Hero Content Box */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 sm:pt-0">
        <div className="max-w-2xl text-left">
          {/* Accent Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-forest-900/70 border border-gold-500/40 text-gold-300 text-[10px] sm:text-xs uppercase tracking-luxury font-medium mb-3 sm:mb-5 backdrop-blur-sm"
          >
            <span>✦</span>
            <span>{smallText}</span>
            <span>✦</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-ivory font-normal leading-[1.1] tracking-tight mb-3 sm:mb-6 whitespace-pre-line drop-shadow-md"
          >
            {heading}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xs sm:text-base text-ivory/80 font-sans font-light leading-relaxed max-w-lg mb-5 sm:mb-8"
          >
            {description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 max-w-sm sm:max-w-none"
          >
            <Link to={buttonLink} className="inline-block w-full sm:w-auto">
              <Button variant="gold" size="md" className="group whitespace-nowrap w-full sm:w-auto text-xs sm:text-sm py-3 sm:py-3.5">
                <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap w-full">
                  <span>{buttonText}</span>
                  <FiArrowRight className="text-base shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
            <Link to="/collections/royal-bridal-heritage" className="inline-block w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto text-xs sm:text-sm py-3 sm:py-3.5">
                View Bridal Suite
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Subtle bottom scroll indicator */}
      <div className="absolute bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 pointer-events-none opacity-70">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-luxury text-gold-300">Scroll</span>
        <div className="w-[1px] h-5 sm:h-8 bg-gradient-to-b from-gold-400 to-transparent animate-pulse" />
      </div>
    </section>
  );
};

export default HeroSection;
