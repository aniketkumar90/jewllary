import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-none shadow-2xl border ${
                t.type === 'success'
                  ? 'bg-forest-900/95 text-ivory border-gold-500/40 shadow-gold-glow/20'
                  : t.type === 'error'
                  ? 'bg-rose-950/95 text-rose-100 border-rose-600/40'
                  : 'bg-charcoal-900/95 text-ivory border-gold-500/30'
              } backdrop-blur-md`}
            >
              <div className="flex items-center gap-3">
                {t.type === 'success' && <FiCheckCircle className="text-gold-400 text-lg flex-shrink-0" />}
                {t.type === 'error' && <FiAlertCircle className="text-rose-400 text-lg flex-shrink-0" />}
                {t.type === 'info' && <FiInfo className="text-gold-400 text-lg flex-shrink-0" />}
                <p className="text-xs tracking-wider uppercase font-medium">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-ivory/60 hover:text-gold-400 p-1 ml-4 transition-colors"
                aria-label="Close"
              >
                <FiX className="text-sm" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
