import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate } from '../../utils/formatters';
import { FiCheckCircle } from 'react-icons/fi';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(orderId);
        if (res.order) setOrder(res.order);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <LoadingSpinner fullScreen label="Verifying Royal Vault Order..." />;
  }

  return (
    <div className="pt-28 pb-20 bg-[#0e1610] text-ivory min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Success Emblem */}
        <div className="w-20 h-20 rounded-full bg-[#18281d] border border-gold-400/50 flex items-center justify-center text-gold-300 mx-auto mb-6 shadow-2xl shadow-gold-500/20">
          <FiCheckCircle className="text-4xl" />
        </div>

        <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold mb-2 block">
          ✦ Reservation Confirmed ✦
        </span>

        <h1 className="text-3xl sm:text-4xl font-serif text-ivory font-normal mb-3">
          Your Royal Heirloom is Reserved
        </h1>

        <p className="text-xs sm:text-sm text-ivory/75 max-w-lg mx-auto leading-relaxed mb-6 font-sans font-light">
          We have safely registered your order under identifier{' '}
          <strong className="text-gold-300 font-mono font-semibold">{order?.orderNumber || orderId}</strong>.
          Our concierge will contact you via email and phone with insured vault tracking details.
        </p>

        {/* Order Details Card */}
        {order && (
          <div className="bg-[#142318] border border-gold-400/35 rounded-xl p-6 sm:p-8 text-left space-y-6 shadow-2xl shadow-black/50 mb-8">
            <div className="flex flex-col sm:flex-row justify-between pb-4 border-b border-gold-500/20 text-xs gap-2">
              <div>
                <span className="text-gold-400/70 uppercase tracking-wider text-[10px] block">Order Date</span>
                <span className="font-medium text-ivory">{formatDate(order.createdAt)}</span>
              </div>
              <div>
                <span className="text-gold-400/70 uppercase tracking-wider text-[10px] block">Payment</span>
                <span className="font-medium text-ivory">{order.paymentMethod} ({order.paymentStatus})</span>
              </div>
              <div>
                <span className="text-gold-400/70 uppercase tracking-wider text-[10px] block">Order Status</span>
                <span className="font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 rounded px-2 py-0.5 text-[11px] uppercase tracking-wider">
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-xs uppercase tracking-luxury text-gold-400 font-semibold mb-3">
                Reserved Creations ({order.items?.length})
              </h4>
              <div className="divide-y divide-gold-500/15">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-14 object-cover border border-gold-400/30 rounded"
                      />
                      <div>
                        <p className="font-serif text-sm text-ivory">{item.name}</p>
                        <p className="text-[10px] text-ivory/50 font-mono">Qty: {item.quantity} • SKU: {item.sku}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gold-300">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="pt-4 border-t border-gold-500/20 text-xs text-ivory/70 space-y-1">
              <h4 className="uppercase tracking-luxury text-[11px] font-semibold text-gold-400 mb-2">
                Insured Delivery Address
              </h4>
              <p className="font-medium text-ivory">{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.addressLine1}, {order.shippingAddress?.addressLine2}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
              <p>Phone: {order.shippingAddress?.phone}</p>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-gold-500/20 flex justify-between items-center">
              <span className="text-xs uppercase tracking-luxury text-ivory/70">Total Investment</span>
              <span className="font-serif text-2xl text-gold-300 font-medium">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <Link to="/jewellery">
            <Button variant="gold">Continue Exploring Jewellery</Button>
          </Link>
          <Link to="/account">
            <Button variant="forest">View My Orders</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
