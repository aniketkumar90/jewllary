import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../../context/WishlistContext';

const WishlistButton = ({ product, className = '', iconSize = 'text-base' }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product?._id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) {
      toggleWishlist(product);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
      onClick={handleClick}
      className={`p-2 rounded-full transition-all duration-200 focus:outline-none ${
        isWishlisted
          ? 'bg-rose-50 text-rose-600 shadow-sm border border-rose-200'
          : 'bg-white/90 text-charcoal-700 hover:text-gold-600 hover:bg-white border border-[#E2D9CC]/50 shadow-sm backdrop-blur-sm'
      } ${className}`}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
    >
      <FiHeart
        className={`${iconSize} ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`}
      />
    </motion.button>
  );
};

export default WishlistButton;
