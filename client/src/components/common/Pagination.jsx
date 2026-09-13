import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 my-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 border border-gold-500/30 text-ivory/70 hover:border-gold-400 hover:text-gold-300 bg-[#142318] disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Previous page"
      >
        <FiChevronLeft className="text-sm" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 text-xs font-medium tracking-wider transition-all duration-200 border ${
            currentPage === p
              ? 'bg-gold-500 text-forest-900 border-gold-400 font-bold shadow-md shadow-gold-500/20'
              : 'border-gold-500/25 text-ivory/80 hover:border-gold-400 hover:text-gold-300 bg-[#18281d]'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 border border-gold-500/30 text-ivory/70 hover:border-gold-400 hover:text-gold-300 bg-[#142318] disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Next page"
      >
        <FiChevronRight className="text-sm" />
      </button>
    </div>
  );
};

export default Pagination;
