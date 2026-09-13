import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../utils/formatters';
import { FiLock, FiShield } from 'react-icons/fi';

const CheckoutPage = () => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery'); // Cash on Delivery | Online
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Your vault is empty');
      navigate('/cart');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill in all mandatory delivery details');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          sku: item.product.sku,
          image: item.product.mainImage?.secure_url,
          price: item.product.salePrice || item.product.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name: formData.name || 'Valued Patron',
          phone: formData.phone || '+91 9876543210',
          addressLine1: formData.addressLine1 || 'Flagship Delivery',
          addressLine2: formData.addressLine2 || '',
          city: formData.city || 'City Centre',
          state: formData.state || 'Delhi',
          pincode: formData.pincode || '110001',
        },
        paymentMethod,
        subtotal: cartSubtotal,
        tax: 0,
        shippingFee: 0,
        total: cartSubtotal,
        notes: formData.notes,
      };

      const res = await orderService.createOrder(orderData);
      clearCart();
      toast.success('Your royal order has been confirmed!');
      navigate(`/order-success/${res.order.orderNumber}`);
    } catch (error) {
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-[#0e1610] text-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Vault', path: '/cart' }, { label: 'Checkout & Reservation' }]} />

        <div className="py-6 border-b border-gold-400/25">
          <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
            ✦ Secure Vault Transmission ✦
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-ivory font-normal">
            Bespoke Order & Reservation
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold-300/70 mt-1 font-sans">
            Complimentary Insured White-Glove Hand Delivery
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-8 items-start">
          {/* Shipping & Payment (7 Cols) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Patron Details */}
            <div className="bg-[#142318] border border-gold-400/35 rounded-xl p-6 sm:p-8 space-y-4 shadow-2xl shadow-black/50">
              <div className="flex items-center justify-between pb-3 border-b border-gold-400/25">
                <h3 className="font-serif text-xl text-ivory">
                  1. Patron Contact & Identification
                </h3>
                {!isAuthenticated && (
                  <Link
                    to="/login?redirect=/checkout"
                    className="text-xs uppercase tracking-luxury text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    Have an account? Sign in
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  dark={true}
                />
                <Input
                  label="Email Address (For Invoicing & Tracking)"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  dark={true}
                />
              </div>

              <Input
                label="Mobile Phone (For Delivery OTP)"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98200 00000"
                dark={true}
              />
            </div>

            {/* Delivery Address */}
            <div className="bg-[#142318] border border-gold-400/35 rounded-xl p-6 sm:p-8 space-y-4 shadow-2xl shadow-black/50">
              <h3 className="font-serif text-xl text-ivory pb-3 border-b border-gold-400/25">
                2. Insured Destination Address
              </h3>

              <Input
                label="Flat / Bungalow / Building Name"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                dark={true}
              />

              <Input
                label="Street / Landmark / Area"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                dark={true}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  dark={true}
                />
                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  dark={true}
                />
                <Input
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  dark={true}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-gold-300/90 mb-1.5 font-medium">
                  Special Vault / Delivery Instructions (Optional)
                </label>
                <textarea
                  rows="2"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Ring doorbell, gift wrap with personalized wax-sealed note..."
                  className="w-full bg-[#18281d] border border-gold-500/35 p-3 text-xs font-sans rounded-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold-400 focus:bg-[#1f3227] transition-all"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#142318] border border-gold-400/35 rounded-xl p-6 sm:p-8 space-y-4 shadow-2xl shadow-black/50">
              <h3 className="font-serif text-xl text-ivory pb-3 border-b border-gold-400/25">
                3. Select Payment Preference
              </h3>

              <div className="space-y-3">
                <label
                  className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-gold-400 bg-gold-500/15'
                      : 'border-gold-500/25 bg-[#18281d] hover:border-gold-400/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 accent-[#D4AF37]"
                  />
                  <div>
                    <span className="font-medium text-ivory text-sm block">
                      Pay on Delivery / Cash on Delivery (COD)
                    </span>
                    <span className="text-xs text-ivory/65 block mt-0.5 leading-relaxed font-light">
                      Inspect your certified heirloom upon arrival inside the tamper-evident lockbox and pay our authorized bonded courier.
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'Online'
                      ? 'border-gold-400 bg-gold-500/15'
                      : 'border-gold-500/25 bg-[#18281d] hover:border-gold-400/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Online"
                    checked={paymentMethod === 'Online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 accent-[#D4AF37]"
                  />
                  <div>
                    <span className="font-medium text-ivory text-sm block">
                      Direct Bank Transfer / UPI / Card (Simulation)
                    </span>
                    <span className="text-xs text-ivory/65 block mt-0.5 leading-relaxed font-light">
                      Instant simulation confirmation with 256-bit bank vault encryption.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Review & Submit (5 Cols) */}
          <div className="lg:col-span-5 bg-[#142318] border border-gold-400/35 rounded-xl p-6 sm:p-8 space-y-6 sticky top-28 shadow-2xl shadow-black/50 text-left">
            <h3 className="font-serif text-xl text-ivory pb-3 border-b border-gold-400/25">
              Reservation Overview
            </h3>

            {/* Itemized Mini List */}
            <div className="divide-y divide-gold-500/15 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product._id} className="py-3 flex gap-3 items-center">
                  <img
                    src={item.product.mainImage?.secure_url}
                    alt={item.product.name}
                    className="w-12 h-14 object-cover border border-gold-400/30 rounded flex-shrink-0"
                  />
                  <div className="flex-1 text-left">
                    <p className="font-serif text-xs text-ivory line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-[10px] text-ivory/50 font-mono">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-medium text-gold-300">
                    {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-ivory/75 pt-3 border-t border-gold-400/25">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-ivory">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Insured White-Glove Shipping</span>
                <span className="text-emerald-400 font-medium">Complimentary</span>
              </div>
              <div className="flex justify-between">
                <span>BIS Hallmarking & Insurance</span>
                <span className="text-ivory/50">Included</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-ivory pt-3 border-t border-gold-500/20">
                <span>Total Due</span>
                <span className="font-serif text-2xl text-gold-300">{formatPrice(cartSubtotal)}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              fullWidth
              size="lg"
              loading={loading}
            >
              Complete Reservation
            </Button>

            <div className="space-y-2 pt-4 border-t border-gold-500/20 text-[11px] text-ivory/60">
              <p className="flex items-center gap-2">
                <FiLock className="text-gold-400 text-sm flex-shrink-0" />
                <span>Encrypted & Vault Bonded Purchase</span>
              </p>
              <p className="flex items-center gap-2">
                <FiShield className="text-gold-400 text-sm flex-shrink-0" />
                <span>Government Certified BIS 916 & GIA Reports</span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
