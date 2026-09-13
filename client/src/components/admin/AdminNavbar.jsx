import React from 'react';
import { FiMenu, FiExternalLink } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AdminNavbar = ({ onOpenSidebar, title = 'Executive Management' }) => {
  const { user } = useAuth();

  return (
    <header className="bg-[#121c15] border-b border-gold-400/25 py-4 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-lg shadow-black/40">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-1.5 text-ivory/80 hover:text-gold-400 transition-colors"
          aria-label="Open navigation drawer"
        >
          <FiMenu className="text-xl" />
        </button>
        <h2 className="font-serif text-xl sm:text-2xl text-ivory font-normal">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs uppercase tracking-luxury text-gold-400 hover:text-gold-300 font-medium transition-colors"
        >
          <span>Live Customer Store</span>
          <FiExternalLink />
        </a>

        <div className="flex items-center gap-2.5 pl-4 border-l border-gold-500/25">
          <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 flex items-center justify-center font-serif text-sm shadow-inner">
            {user?.name ? user.name[0] : 'A'}
          </div>
          <span className="hidden md:inline text-xs font-medium text-ivory/90">
            {user?.name || 'Administrator'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
