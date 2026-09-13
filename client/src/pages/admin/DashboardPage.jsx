import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/admin/StatCard';
import DashboardChart from '../../components/admin/DashboardChart';
import StatusBadge from '../../components/admin/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { cmsService } from '../../services/cmsService';
import { formatPrice, formatDate } from '../../utils/formatters';
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiBox,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
} from 'react-icons/fi';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await cmsService.getDashboardStats();
        setData(res);
      } catch (error) {
        console.error('[Dashboard Error]:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen label="Compiling Royal Executive Analytics..." />;
  }

  const { stats, recentOrders = [], topProducts = [], salesTimeline = [] } = data || {};

  return (
    <div className="space-y-8 text-left">
      {/* Page Title */}
      <div>
        <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
          ✦ Executive Overview ✦
        </span>
        <h1 className="text-3xl font-serif text-ivory font-normal">
          Maison Operations & Revenue
        </h1>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Total Gross Revenue"
          value={formatPrice(stats?.totalRevenue || 0)}
          icon={FiDollarSign}
          change="18.4% vs last quarter"
          changeType="positive"
        />
        <StatCard
          title="Total Vault Orders"
          value={stats?.totalOrders || 0}
          icon={FiShoppingBag}
          subtitle={`${stats?.pendingOrders || 0} pending vault verification`}
        />
        <StatCard
          title="Registered Patrons"
          value={stats?.totalUsers || 0}
          icon={FiUsers}
          change="New patrons joining daily"
        />
        <StatCard
          title="High Jewellery Creations"
          value={stats?.totalProducts || 0}
          icon={FiBox}
          subtitle="Catalogued in database"
        />
        <StatCard
          title="Pending Dispatches"
          value={stats?.pendingOrders || 0}
          icon={FiClock}
          subtitle="Awaiting courier vault pickup"
        />
        <StatCard
          title="Delivered Heirlooms"
          value={stats?.deliveredOrders || 0}
          icon={FiCheckCircle}
          subtitle="Successfully delivered"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8">
        <DashboardChart
          title="Revenue & Vault Trajectory"
          subtitle="Monthly revenue from confirmed orders"
          data={salesTimeline.map((item) => ({
            label: `Month ${item._id.month}`,
            revenue: item.revenue,
            orders: item.ordersCount,
          }))}
        />
      </div>

      {/* Two-Column: Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (7 Cols) */}
        <div className="lg:col-span-7 bg-[#142318] border border-gold-400/30 p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-gold-400/20 mb-4">
            <h3 className="font-serif text-lg text-ivory font-normal">
              Recent Vault Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs uppercase tracking-luxury text-gold-400 hover:text-gold-300 flex items-center gap-1 font-medium transition-colors"
            >
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ivory/80">
              <thead className="text-[10px] uppercase tracking-wider text-gold-300/80 bg-[#18281d] border-b border-gold-500/20">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Patron</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/15">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-ivory/50">
                      No recent orders
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="py-3 px-3 font-mono font-medium text-gold-300">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-3 text-ivory/90">
                        {ord.shippingAddress?.name || ord.user?.name || 'Patron'}
                      </td>
                      <td className="py-3 px-3 font-medium text-ivory">
                        {formatPrice(ord.total)}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={ord.orderStatus} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Heirlooms (5 Cols) */}
        <div className="lg:col-span-5 bg-[#142318] border border-gold-400/30 p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-gold-400/20 mb-4">
            <h3 className="font-serif text-lg text-ivory font-normal">
              Celebrated Creations
            </h3>
            <Link
              to="/admin/products"
              className="text-xs uppercase tracking-luxury text-gold-400 hover:text-gold-300 flex items-center gap-1 font-medium transition-colors"
            >
              <span>Catalogue</span>
              <FiArrowRight />
            </Link>
          </div>

          <div className="divide-y divide-gold-500/15">
            {topProducts.map((p) => (
              <div key={p._id} className="py-3 flex items-center gap-3">
                <img
                  src={p.mainImage?.secure_url}
                  alt={p.name}
                  className="w-12 h-14 object-cover border border-gold-500/30 bg-[#18281d] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-xs text-ivory line-clamp-1">
                    {p.name}
                  </h4>
                  <p className="text-[10px] text-ivory/60 mt-0.5">
                    Stock: {p.stock} • {p.material}
                  </p>
                </div>
                <span className="text-xs font-semibold text-gold-300 flex-shrink-0">
                  {formatPrice(p.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
