import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center text-[10px] sm:text-[11px] uppercase tracking-luxury text-ivory/50 py-4 overflow-x-auto whitespace-nowrap scrollbar-none">
      <Link to="/" className="hover:text-gold-300 transition-colors">
        Home
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <FiChevronRight className="mx-2 text-gold-500/40 text-xs shrink-0" />
          {item.path && index < items.length - 1 ? (
            <Link to={item.path} className="hover:text-gold-300 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gold-300 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
