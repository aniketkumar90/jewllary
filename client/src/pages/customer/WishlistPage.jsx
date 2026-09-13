import React from 'react';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductGrid from '../../components/customer/ProductGrid';
import EmptyState from '../../components/common/EmptyState';
import { useWishlist } from '../../context/WishlistContext';
import { FiHeart } from 'react-icons/fi';

const WishlistPage = () => {
  const { wishlist, wishlistCount } = useWishlist();

  return (
    <div className="pt-24 pb-20 bg-[#0e1610] text-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Saved Heirlooms (Wishlist)' }]} />

        <div className="py-6 border-b border-gold-400/25 mb-8">
          <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
            ✦ Personal Curations ✦
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-ivory font-normal">
            Your Private Vault Wishlist
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold-300/70 mt-1 font-sans">
            {wishlistCount} {wishlistCount === 1 ? 'Heirloom Saved' : 'Heirlooms Saved'}
          </p>
        </div>

        {wishlist.length === 0 ? (
          <EmptyState
            icon={FiHeart}
            title="Your Vault is Empty"
            description="Explore our jewellery portfolios and tap the heart emblem on any piece to save it for your private salon visit."
            actionText="Explore Jewellery"
            actionLink="/jewellery"
          />
        ) : (
          <ProductGrid products={wishlist} columns={4} />
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
