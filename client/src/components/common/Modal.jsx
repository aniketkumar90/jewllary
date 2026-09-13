import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
  showClose = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#070b08]/85 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.1 }}
            className={`relative w-full ${maxWidth} bg-[#142318] text-ivory border border-gold-400/40 rounded-xl shadow-2xl z-10 overflow-hidden`}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between p-6 border-b border-gold-400/25 bg-[#18281d]">
                <div>
                  {subtitle && (
                    <p className="text-[10px] tracking-luxury uppercase text-gold-400 font-semibold mb-0.5 font-sans">
                      {subtitle}
                    </p>
                  )}
                  {title && (
                    <h3 className="text-xl font-serif text-ivory tracking-wide font-normal">
                      {title}
                    </h3>
                  )}
                </div>
                {showClose && (
                  <button
                    onClick={onClose}
                    className="text-ivory/50 hover:text-gold-300 p-2 transition-colors rounded-full"
                    aria-label="Close modal"
                  >
                    <FiX className="text-lg" />
                  </button>
                )}
              </div>
            )}

            {/* Content Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
