import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { wishlistService } from '../services/wishlistService';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('vanya_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync with backend if authenticated
  useEffect(() => {
    const fetchRemoteWishlist = async () => {
      if (isAuthenticated) {
        try {
          const data = await wishlistService.getWishlist();
          if (data.wishlist) {
            setWishlist(data.wishlist);
          }
        } catch (e) {
          console.warn('[Wishlist] Sync error:', e.message);
        }
      }
    };

    fetchRemoteWishlist();
  }, [isAuthenticated]);

  // Persist locally for guests
  useEffect(() => {
    try {
      localStorage.setItem('vanya_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('[Wishlist] Local storage error:', e);
    }
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  const toggleWishlist = async (product) => {
    const exists = isInWishlist(product._id);

    if (exists) {
      setWishlist((prev) => prev.filter((item) => (item._id || item) !== product._id));
      toast.info('Removed from your wishlist');
      if (isAuthenticated) {
        try {
          await wishlistService.removeFromWishlist(product._id);
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      setWishlist((prev) => [...prev, product]);
      toast.success('Saved to your wishlist');
      if (isAuthenticated) {
        try {
          await wishlistService.addToWishlist(product._id);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
