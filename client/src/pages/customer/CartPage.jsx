import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import QuantitySelector from '../../components/customer/QuantitySelector';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { FiTrash2, FiShoppingBag, FiLock, FiShield, FiTruck } from 'react-icons/fi';

const CartPage = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-20 bg-[#0e1610] text-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Vault / Shopping Cart' }]} />

        <div className="py-6 border-b border-gold-400/25">
          <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
            ✦ Reserved Curations ✦
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-ivory font-normal mb-2">
            Your Private Vault
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold-300/70 font-sans">
            {cartCount} {cartCount === 1 ? 'Creation Reserved' : 'Creations Reserved'}
          </p>
        </div>

        {cart.length === 0 ? (
          <EmptyState
            icon={FiShoppingBag}
            title="Your Vault is Empty"
            description="Discover our handcrafted Indian luxury jewellery and reserve a timeless creation today."
            actionText="Explore All Jewellery"
            actionLink="/jewellery"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start py-8">
            {/* Items Table / List (8 Cols) */}
            <div className="lg:col-span-8 bg-[#142318] border border-gold-400/35 rounded-xl p-6 sm:p-8 shadow-2xl shadow-black/50">
              <div className="hidden sm:grid grid-cols-12 pb-4 border-b border-gold-500/20 text-[10px] uppercase tracking-luxury text-gold-400 font-semibold">
                <span className="col-span-6">Creation / Details</span>
                <span className="col-span-2 text-center">Unit Price</span>
                <span className="col-span-2 text-center">Quantity</span>
                <span className="col-span-2 text-right">Subtotal</span>
              </div>

              <div className="divide-y divide-gold-500/15">
                {cart.map((item) => {
                  const itemPrice = item.product.salePrice || item.product.price;
                  const itemSubtotal = itemPrice * item.quantity;

                  return (
                    <div
                      key={item.product._id}
                      className="py-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center"
                    >
                      {/* Product Preview */}
                      <div className="col-span-6 flex gap-4 w-full items-center">
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="w-20 h-24 flex-shrink-0 bg-[#18281d] border border-gold-400/30 rounded overflow-hidden shadow-sm"
                        >
                          <img
                            src={item.product.mainImage?.secure_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover brightness-[0.95]"
                          />
                        </Link>
                        <div className="text-left">
                          <Link
                            to={`/product/${item.product.slug}`}
                            className="font-serif text-base text-ivory hover:text-gold-300 leading-snug line-clamp-1 block transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <span className="text-[10px] uppercase tracking-widest text-gold-400/70 block mt-1 font-mono">
                            SKU: {item.product.sku}
                          </span>
                          <span className="text-xs text-ivory/60 block mt-0.5">
                            {item.product.material}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product._id)}
                            className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 mt-2 transition-colors"
                          >
                            <FiTrash2 className="text-xs" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="col-span-2 text-center text-xs font-medium text-gold-300 hidden sm:block">
                        {formatPrice(itemPrice)}
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2 flex justify-center w-full sm:w-auto">
                        <QuantitySelector
                          quantity={item.quantity}
                          onIncrease={() => updateQuantity(item.product._id, item.quantity + 1)}
                          onDecrease={() => updateQuantity(item.product._id, item.quantity - 1)}
                          max={item.product.stock || 10}
                          dark={true}
                        />
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-2 text-right font-serif text-sm font-medium text-gold-300 w-full sm:w-auto flex justify-between sm:block">
                        <span className="sm:hidden text-xs text-ivory/60">Subtotal:</span>
                        <span>{formatPrice(itemSubtotal)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-gold-500/20 flex justify-between items-center">
                <Link to="/jewellery" className="text-xs uppercase tracking-luxury text-gold-400 hover:text-gold-300 transition-colors">
                  ← Continue Exploring
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs uppercase tracking-luxury text-ivory/40 hover:text-rose-400 transition-colors"
                >
                  Clear Vault
                </button>
              </div>
            </div>

            {/* Order Summary (4 Cols) */}
            <div className="lg:col-span-4 bg-[#142318] border border-gold-400/35 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/50 text-left">
              <h3 className="font-serif text-xl text-ivory pb-3 border-b border-gold-400/25">
                Vault Summary
              </h3>

              <div className="space-y-3 text-xs text-ivory/75">
                <div className="flex justify-between">
                  <span>Vault Subtotal</span>
                  <span className="font-medium text-ivory">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Tamper-Evident Courier</span>
                  <span className="text-emerald-400 font-medium">Complimentary</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Hallmark Duties</span>
                  <span className="text-ivory/50">Included</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-ivory pt-3 border-t border-gold-500/20">
                  <span>Total Investment</span>
                  <span className="font-serif text-xl text-gold-300">{formatPrice(cartSubtotal)}</span>
                </div>
              </div>

              <Button
                variant="gold"
                fullWidth
                size="lg"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>

              <div className="space-y-3 pt-4 border-t border-gold-500/20 text-[11px] text-ivory/60">
                <p className="flex items-center gap-2">
                  <FiLock className="text-gold-400 text-sm flex-shrink-0" />
                  <span>256-Bit SSL Encrypted & Bank Vault Secure</span>
                </p>
                <p className="flex items-center gap-2">
                  <FiTruck className="text-gold-400 text-sm flex-shrink-0" />
                  <span>Discreet White-Glove Hand Delivery</span>
                </p>
                <p className="flex items-center gap-2">
                  <FiShield className="text-gold-400 text-sm flex-shrink-0" />
                  <span>30-Day Inspection Guarantee</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
