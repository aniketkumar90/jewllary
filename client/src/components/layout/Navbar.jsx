import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NAV_LINKS, BRAND_NAME, BRAND_SUBTITLE } from '../../utils/constants';
import { cmsService } from '../../services/cmsService';
import {
  FiSearch,
  FiUser,
  FiMenu,
} from 'react-icons/fi';

const Navbar = ({ onOpenSearch, onOpenMobileMenu }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [logoUrl, setLogoUrl] = useState(() => {
    try {
      return localStorage.getItem('nsj_logo') || '/images/logo.png';
    } catch {
      return '/images/logo.png';
    }
  });

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch dynamic brand logo from settings
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await cmsService.getSettings();
        if (res.settings?.logo?.secure_url) {
          setLogoUrl(res.settings.logo.secure_url);
          localStorage.setItem('nsj_logo', res.settings.logo.secure_url);
        }
      } catch {
        // Fallback gracefully
      }
    };
    fetchLogo();
  }, []);

  // On home page, initially transparent overlay, on scroll turns deep forest green
  // On other pages, always deep forest green solid background
  const isSolid = scrolled || !isHomePage;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isSolid
          ? 'bg-[#0e0e0e]/95 text-ivory border-b border-gold-500/20 backdrop-blur-md shadow-lg py-3.5'
          : 'bg-transparent text-white py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden gap-3">
            <button
              onClick={onOpenMobileMenu}
              className="p-1.5 text-ivory hover:text-gold-400 transition-colors focus:outline-none"
              aria-label="Open navigation menu"
            >
              <FiMenu className="text-2xl" />
            </button>
            <button
              onClick={onOpenSearch}
              className="p-1.5 text-ivory hover:text-gold-400 transition-colors"
              aria-label="Search"
            >
              <FiSearch className="text-xl" />
            </button>
          </div>

          {/* LEFT: Brand Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2.5 sm:gap-3 group">
              <img
                src={logoUrl || '/images/logo.png'}
                alt={BRAND_NAME}
                className="h-10 sm:h-12 w-auto object-contain rounded-md border border-gold-400/40 p-0.5 shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col items-center lg:items-start text-left">
                <span className="font-serif text-lg sm:text-2xl tracking-wider text-gold-400 font-bold uppercase group-hover:text-gold-300 transition-colors leading-tight">
                  {BRAND_NAME}
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-gold-200/90 -mt-0.5">
                  Fine Jewels • Est. 2024
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER: Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-9">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs uppercase tracking-luxury font-medium transition-all relative py-1 hover:text-gold-400 ${
                    active ? 'text-gold-400' : isSolid ? 'text-ivory/90' : 'text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="hidden lg:flex items-center text-ivory/80 hover:text-gold-400 transition-colors p-1"
              aria-label="Search jewellery"
            >
              <FiSearch className="text-lg" />
            </button>

            {/* Account */}
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="text-ivory/80 hover:text-gold-400 transition-colors p-1"
              aria-label="Account"
            >
              <FiUser className="text-lg" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
