import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiShoppingBag, FiLock } from 'react-icons/fi';
import QuantitySelector from './QuantitySelector';
import Button from '../common/Button';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';

const CartDrawer = () => {
  const {
    cart,
    isCartDrawerOpen,
    closeCartDrawer,
    cartCount,
    cartSubtotal,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const navigate = useNavigate();

  // Prevent background scrolling when open
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartDrawerOpen]);

  const handleCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
            className="fixed inset-0 bg-[#070b08]/85 backdrop-blur-sm"
          />

          {/* Slide-in panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-[#142318] text-ivory h-full shadow-2xl z-10 flex flex-col justify-between border-l border-gold-400/40"
          >
            {/* Header */}
            <div className="p-6 border-b border-gold-400/25 flex items-center justify-between bg-[#18281d]">
              <div className="flex items-center gap-3">
                <FiShoppingBag className="text-xl text-gold-400" />
                <div className="text-left">
                  <h3 className="font-serif text-lg font-normal text-ivory">
                    Your Private Vault
                  </h3>
                  <span className="text-[10px] uppercase tracking-luxury text-gold-400/80 font-sans">
                    {cartCount} {cartCount === 1 ? 'Heirloom Piece' : 'Heirloom Pieces'}
                  </span>
                </div>
              </div>
              <button
                onClick={closeCartDrawer}
                className="text-ivory/60 hover:text-ivory p-2 transition-colors"
                aria-label="Close vault drawer"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#18281d] border border-gold-400/40 flex items-center justify-center text-gold-300 mb-4 shadow-xl">
                    <FiShoppingBag className="text-2xl" />
                  </div>
                  <h4 className="font-serif text-xl text-ivory mb-2">
                    Your Vault is Empty
                  </h4>
                  <p className="text-xs text-ivory/65 max-w-xs mb-6 font-light leading-relaxed">
                    Discover our handcrafted heirlooms and reserve a timeless creation today.
                  </p>
                  <Button variant="gold" onClick={closeCartDrawer}>
                    Explore Collections
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gold-500/15">
                  {cart.map((item) => {
                    const itemPrice = item.product.salePrice || item.product.price;
                    return (
                      <div key={item.product._id} className="py-4 flex gap-4 items-center">
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={closeCartDrawer}
                          className="w-20 h-24 flex-shrink-0 bg-[#18281d] border border-gold-400/30 rounded overflow-hidden shadow-sm"
                        >
                          <img
                            src={item.product.mainImage?.secure_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover brightness-[0.95]"
                          />
                        </Link>

                        <div className="flex-1 text-left">
                          <Link
                            to={`/product/${item.product.slug}`}
                            onClick={closeCartDrawer}
                            className="font-serif text-sm text-ivory hover:text-gold-300 line-clamp-1 block transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <span className="text-[10px] text-gold-400/70 uppercase tracking-widest block mt-0.5 font-mono">
                            SKU: {item.product.sku}
                          </span>

                          <p className="text-xs font-medium text-gold-300 mt-1">
                            {formatPrice(itemPrice)}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            <QuantitySelector
                              quantity={item.quantity}
                              onIncrease={() => updateQuantity(item.product._id, item.quantity + 1)}
                              onDecrease={() => updateQuantity(item.product._id, item.quantity - 1)}
                              className="scale-90 origin-left"
                              dark={true}
                            />
                            <button
                              onClick={() => removeFromCart(item.product._id)}
                              className="text-ivory/50 hover:text-rose-400 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <FiTrash2 className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gold-400/25 bg-[#18281d] space-y-4 text-left">
                <div className="space-y-1.5 text-xs text-ivory/75">
                  <div className="flex justify-between">
                    <span>Vault Subtotal</span>
                    <span className="font-medium text-ivory">{formatPrice(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insured White-Glove Shipping</span>
                    <span className="text-emerald-400 font-medium">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-ivory pt-2 border-t border-gold-500/20">
                    <span>Total Investment</span>
                    <span className="text-base text-gold-300 font-serif">{formatPrice(cartSubtotal)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="gold" fullWidth size="lg" onClick={handleCheckout}>
                    Proceed to Reserve / Checkout
                  </Button>
                  <Link
                    to="/cart"
                    onClick={closeCartDrawer}
                    className="block text-center text-xs uppercase tracking-luxury text-gold-400/80 hover:text-gold-300 pt-1"
                  >
                    Review Vault Details
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-ivory/50 uppercase tracking-widest pt-2">
                  <FiLock className="text-gold-400" />
                  <span>Insured & Vault Secured Transaction</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
