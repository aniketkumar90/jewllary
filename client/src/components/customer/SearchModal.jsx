import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiX,
  FiArrowRight,
  FiCompass,
  FiTrendingUp,
  FiAward,
} from 'react-icons/fi';
import PriceDisplay from '../common/PriceDisplay';
import { productService } from '../../services/productService';

const POPULAR_SEARCHES = [
  { label: 'Royal Polki Chokers', query: 'Polki' },
  { label: 'Solitaire Engagement Rings', query: 'Solitaire' },
  { label: '22K Temple Gold Harams', query: 'Temple' },
  { label: 'Basra Pearl Jhumkas', query: 'Pearl' },
  { label: 'Antique Bridal Suites', query: 'Bridal' },
  { label: 'Diamond Kada Bangles', query: 'Kada' },
];

const CURATED_CATEGORIES = [
  { name: 'Bridal Heirlooms', slug: 'bridal', icon: '👑', hint: 'Grand Matrimonial Suites' },
  { name: 'Heritage Polki', slug: 'polki-jadau', icon: '✨', hint: 'Syndicate Uncut Diamonds' },
  { name: 'Solitaire Solace', slug: 'solitaires', icon: '💎', hint: 'GIA / IGI Certified' },
  { name: 'Temple 22K Gold', slug: 'temple-jewellery', icon: '🪷', hint: 'Handcrafted Repoussé' },
];

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchTimeout = useRef(null);
  const inputRef = useRef(null);

  // Clear query and auto-focus on open
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    } else {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Live auto-suggest search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await productService.getProducts({ search: query.trim(), limit: 6 });
        setResults(res.products || []);
      } catch (err) {
        console.error('[Search Error]:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(searchTimeout.current);
  }, [query]);

  const handleSelectProduct = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/jewellery?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleCategoryClick = (slug) => {
    onClose();
    navigate(`/jewellery?category=${slug}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 px-3 sm:px-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          />

          {/* Floating Luxury Search Pod */}
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full max-w-3xl bg-[#0e1711] border border-gold-400/40 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.15)] z-10 overflow-hidden text-ivory"
          >
            {/* Top Gold Halo Glow Bar */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-28 bg-gold-500/15 blur-[60px] pointer-events-none rounded-full" />

            {/* Modern Search Input Bar */}
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center px-4 sm:px-6 py-4 sm:py-5 gap-3 border-b border-gold-500/25 bg-[#132217]/95"
            >
              {/* Gold Icon Emblem */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gold-500/15 border border-gold-400/40 flex items-center justify-center text-gold-300 shadow-inner shrink-0">
                <FiSearch className="text-lg sm:text-xl" />
              </div>

              {/* Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, SKU (e.g. NS-01), solitaire, polki, gold..."
                className="w-full bg-transparent text-ivory text-base sm:text-xl font-serif tracking-wide focus:outline-none placeholder:font-sans placeholder:text-xs sm:placeholder:text-sm placeholder:text-ivory/35"
              />

              {/* Clear Query Icon */}
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-ivory/80 flex items-center justify-center transition-colors shrink-0"
                >
                  <FiX className="text-sm" />
                </button>
              )}

              {/* Modern Close Pill Button */}
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full border border-gold-500/35 hover:border-gold-400 bg-[#18291d] hover:bg-gold-500/20 text-gold-300 text-[11px] sm:text-xs uppercase tracking-luxury font-medium transition-all shrink-0 shadow-sm"
              >
                <span>Close</span>
                <kbd className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded bg-black/50 border border-gold-500/25 font-mono text-gold-400/90 font-normal">
                  ESC
                </kbd>
              </button>
            </form>

            {/* Content Area */}
            <div className="max-h-[65vh] overflow-y-auto p-5 sm:p-7">
              {/* 1. Loading State */}
              {loading && (
                <div className="py-12 text-center space-y-3">
                  <div className="inline-block w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
                  <p className="text-xs text-gold-300/80 uppercase tracking-luxury">
                    Searching Our Royal Vault...
                  </p>
                </div>
              )}

              {/* 2. No Results State */}
              {!loading && query && results.length === 0 && (
                <div className="py-12 text-center max-w-md mx-auto space-y-3">
                  <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mx-auto mb-2 shadow-inner">
                    <FiCompass className="text-2xl" />
                  </div>
                  <h4 className="font-serif text-xl text-ivory font-normal">
                    No creations found for "{query}"
                  </h4>
                  <p className="text-xs text-ivory/60 leading-relaxed font-light">
                    Our master karigars create bespoke suites upon request. Try searching for "Polki", "Solitaire", "Choker", "Jhumka", or "Kada".
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setQuery('')}
                      className="text-xs uppercase tracking-luxury text-gold-400 hover:text-gold-300 border-b border-gold-400/50 pb-0.5"
                    >
                      Clear Search & Explore Curations
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Live Results List */}
              {!loading && results.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gold-500/20">
                    <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold flex items-center gap-1.5">
                      <FiAward className="text-xs" />
                      <span>Vault Matches ({results.length})</span>
                    </span>
                    <button
                      onClick={handleSubmit}
                      className="text-xs text-gold-400 hover:text-gold-300 uppercase tracking-luxury flex items-center gap-1 font-medium transition-colors group"
                    >
                      <span>View All in Catalogue</span>
                      <FiArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>

                  <div className="divide-y divide-gold-500/15">
                    {results.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleSelectProduct(product.slug)}
                        className="group flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-[#16271c] transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-4 min-w-0 pr-4">
                          {/* Thumbnail */}
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-gold-400/30 bg-[#121c15] shrink-0 shadow-sm group-hover:border-gold-400 transition-colors">
                            <img
                              src={product.mainImage?.secure_url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.95]"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="text-left min-w-0">
                            <span className="text-[10px] uppercase tracking-wider text-gold-400/90 font-mono block truncate">
                              {product.category?.name || 'Haute Joaillerie'} • SKU: {product.sku}
                            </span>
                            <h4 className="font-serif text-sm sm:text-base text-ivory font-normal group-hover:text-gold-300 transition-colors truncate">
                              {product.name}
                            </h4>
                            <span className="text-[11px] text-ivory/50 block font-light">
                              {product.material} {product.weight ? `• ${product.weight}` : ''}
                            </span>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="text-right shrink-0 flex items-center gap-3">
                          <PriceDisplay
                            price={product.price}
                            salePrice={product.salePrice}
                            size="md"
                            light={true}
                          />
                          <div className="hidden sm:flex w-8 h-8 rounded-full border border-gold-400/30 items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-forest-950 transition-all">
                            <FiArrowRight className="text-xs" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Default Discovery Mode (Empty Query) */}
              {!query && (
                <div className="space-y-6">
                  {/* Popular Searches as Modern Luxury Pill Chips */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-left">
                      <FiTrendingUp className="text-gold-400 text-xs" />
                      <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold">
                        Trending Curations & Silhouettes
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-left">
                      {POPULAR_SEARCHES.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setQuery(item.query)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#15251b] border border-gold-500/30 text-xs text-ivory/85 font-sans font-medium hover:border-gold-400 hover:text-gold-200 hover:bg-[#1d3224] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:scale-102 active:scale-98 transition-all duration-200 shadow-sm"
                        >
                          <span className="text-gold-400 text-[10px]">✦</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Curated Category Shortcuts */}
                  <div className="pt-2 text-left">
                    <span className="text-[10px] uppercase tracking-luxury text-gold-400/80 font-semibold block mb-3">
                      Explore By Signature Vault
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {CURATED_CATEGORIES.map((cat) => (
                        <div
                          key={cat.slug}
                          onClick={() => handleCategoryClick(cat.slug)}
                          className="p-3 sm:p-3.5 rounded-xl bg-[#142318] border border-gold-500/25 hover:border-gold-400/60 hover:bg-[#192d1f] transition-all duration-200 cursor-pointer flex items-center justify-between group shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg p-1.5 rounded-lg bg-gold-500/10 border border-gold-400/20">
                              {cat.icon}
                            </span>
                            <div>
                              <h5 className="font-serif text-sm text-ivory group-hover:text-gold-300 transition-colors">
                                {cat.name}
                              </h5>
                              <p className="text-[10px] text-ivory/50 font-light">
                                {cat.hint}
                              </p>
                            </div>
                          </div>
                          <FiArrowRight className="text-gold-400/60 group-hover:text-gold-300 group-hover:translate-x-1 transition-all text-xs" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modern Bottom Shortcut Bar */}
            <div className="px-5 sm:px-7 py-3 bg-[#0a110c] border-t border-gold-500/20 flex items-center justify-between text-[10px] sm:text-[11px] text-ivory/50">
              <span className="font-serif tracking-wider text-gold-400/80 uppercase">
                New Shiv Jewellers • Est. 2024
              </span>
              <div className="flex items-center gap-3 sm:gap-4 font-mono">
                <span className="hidden sm:inline">↵ to view details</span>
                <span>ESC to exit</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
