import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiHeart, FiShield, FiPhone, FiMail } from 'react-icons/fi';
import { NAV_LINKS, JEWELLERY_CATEGORIES, BRAND_NAME } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { logoUrl } = useSettings();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-forest-900/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-4/5 max-w-sm bg-forest-900 text-ivory h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto border-r border-gold-500/20"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gold-500/20">
                <div className="flex items-center gap-3">
                  <img
                    src={logoUrl || '/images/logo.png'}
                    alt="New Shiv Jewellers"
                    onError={(e) => {
                      if (e.currentTarget.src !== window.location.origin + '/images/logo.png') {
                        e.currentTarget.src = '/images/logo.png';
                      }
                    }}
                    className="w-10 h-10 object-contain rounded-md border border-gold-400/40 p-0.5"
                  />
                  <div className="flex flex-col text-left">
                    <span className="font-serif text-lg tracking-wider text-gold-400 font-bold uppercase leading-tight">
                      {BRAND_NAME}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-ivory/70 hover:text-gold-400 transition-colors"
                  aria-label="Close menu"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Main Links */}
              <div className="p-6 space-y-4">
                <p className="text-[10px] uppercase tracking-luxury text-gold-500/80 font-semibold mb-2">
                  Navigation
                </p>
                <div className="flex flex-col space-y-3">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={onClose}
                      className={`text-sm uppercase tracking-luxury font-medium py-1 transition-colors hover:text-gold-400 ${
                        location.pathname === link.path ? 'text-gold-400' : 'text-ivory/90'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="pt-4 border-t border-gold-500/20">
                  <p className="text-[10px] uppercase tracking-luxury text-gold-500/80 font-semibold mb-3">
                    Curated Categories
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {JEWELLERY_CATEGORIES.slice(1).map((cat) => (
                      <Link
                        key={cat.slug}
                        to={cat.path}
                        onClick={onClose}
                        className="text-xs text-ivory/75 hover:text-gold-400 tracking-wider py-1 transition-colors"
                      >
                        ✦ {cat.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {isAdmin && (
                  <div className="pt-4 border-t border-gold-500/20">
                    <Link
                      to="/admin"
                      onClick={onClose}
                      className="flex items-center gap-2 text-gold-400 text-xs uppercase tracking-luxury py-1.5"
                    >
                      <FiShield />
                      <span>Admin Management Portal</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom concierge contact */}
            <div className="p-6 border-t border-gold-500/20 bg-forest-950/60 space-y-3">
              <div className="flex items-center gap-3">
                <Link
                  to={isAuthenticated ? '/account' : '/login'}
                  onClick={onClose}
                  className="flex items-center gap-2 text-xs uppercase tracking-luxury text-gold-300 hover:text-gold-200"
                >
                  <FiUser />
                  <span>{isAuthenticated ? `Welcome, ${user?.name?.split(' ')[0]}` : 'Client Sign In'}</span>
                </Link>
              </div>
              <div className="text-[11px] text-ivory/60 space-y-1">
                <p className="flex items-center gap-2">
                  <FiPhone className="text-gold-400" />
                  <span>+91 (0) 22 8976 5432</span>
                </p>
                <p className="flex items-center gap-2">
                  <FiMail className="text-gold-400" />
                  <span>concierge@vanyajewels.com</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
