import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import { authService } from '../../services/authService';
import { formatPrice, formatDate } from '../../utils/formatters';
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiLock,
  FiLogOut,
} from 'react-icons/fi';

const AccountPage = () => {
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // orders | profile | password
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Form state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders();
        if (res.orders) setOrders(res.orders);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({ name: profileName, phone: profilePhone });
      toast.success('Patron profile details updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setSavingPassword(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast.success('Security password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('You have been securely signed out');
    navigate('/');
  };

  if (!user) return <LoadingSpinner fullScreen label="Opening Patron Portfolio..." />;

  return (
    <div className="pt-24 pb-20 bg-[#0e1610] text-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Patron Account' }]} />

        <div className="py-6 border-b border-gold-400/25 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
              ✦ Patron Sanctuary ✦
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-ivory font-normal">
              Private Client Portfolio
            </h1>
            <p className="text-xs uppercase tracking-luxury text-gold-300/70 mt-1 font-sans">
              Welcome back, {user.name} ({user.email})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs uppercase tracking-luxury text-rose-400 hover:text-rose-300 transition-colors font-medium border border-rose-500/40 px-4 py-2 bg-[#18281d] rounded hover:bg-rose-950/40"
          >
            <FiLogOut />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Account Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 items-start">
          {/* Navigation Tabs (3 Cols) */}
          <div className="lg:col-span-3 bg-[#142318] border border-gold-400/35 rounded-xl overflow-hidden divide-y divide-gold-500/20 shadow-xl shadow-black/50">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-5 py-4 flex items-center gap-3 text-xs uppercase tracking-luxury font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'bg-gold-500/20 text-gold-300 border-l-4 border-gold-400 font-semibold shadow-inner'
                  : 'text-ivory/70 hover:bg-[#18281d] hover:text-gold-300'
              }`}
            >
              <FiPackage className="text-base text-gold-400" />
              <span>My Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-5 py-4 flex items-center gap-3 text-xs uppercase tracking-luxury font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-gold-500/20 text-gold-300 border-l-4 border-gold-400 font-semibold shadow-inner'
                  : 'text-ivory/70 hover:bg-[#18281d] hover:text-gold-300'
              }`}
            >
              <FiUser className="text-base text-gold-400" />
              <span>Patron Profile</span>
            </button>

            <Link
              to="/wishlist"
              className="w-full text-left px-5 py-4 flex items-center gap-3 text-xs uppercase tracking-luxury font-medium text-ivory/70 hover:bg-[#18281d] hover:text-gold-300 transition-colors"
            >
              <FiHeart className="text-base text-gold-400" />
              <span>Saved Heirlooms</span>
            </Link>

            <button
              onClick={() => setActiveTab('password')}
              className={`w-full text-left px-5 py-4 flex items-center gap-3 text-xs uppercase tracking-luxury font-medium transition-colors ${
                activeTab === 'password'
                  ? 'bg-gold-500/20 text-gold-300 border-l-4 border-gold-400 font-semibold shadow-inner'
                  : 'text-ivory/70 hover:bg-[#18281d] hover:text-gold-300'
              }`}
            >
              <FiLock className="text-base text-gold-400" />
              <span>Vault Password</span>
            </button>
          </div>

          {/* Active Tab Content (9 Cols) */}
          <div className="lg:col-span-9 bg-[#142318] border border-gold-400/35 rounded-xl p-6 sm:p-8 shadow-2xl shadow-black/50 text-left">
            {/* 1. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="font-serif text-2xl text-ivory pb-3 border-b border-gold-400/25">
                  Your Order & Reservation History
                </h3>

                {loadingOrders ? (
                  <LoadingSpinner label="Fetching your orders..." />
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="font-serif text-lg text-ivory mb-2">No past orders found</p>
                    <p className="text-xs text-ivory/60 mb-6">You have not placed any orders yet.</p>
                    <Link to="/jewellery">
                      <Button variant="gold">Explore Jewellery</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((ord) => (
                      <div
                        key={ord._id}
                        className="border border-gold-500/25 rounded-lg p-5 space-y-4 bg-[#18281d]"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs pb-3 border-b border-gold-500/20 gap-2">
                          <div>
                            <span className="text-gold-400/70 uppercase tracking-widest text-[10px] block">Order ID</span>
                            <span className="font-mono font-bold text-gold-300 text-sm">{ord.orderNumber}</span>
                          </div>
                          <div>
                            <span className="text-gold-400/70 uppercase tracking-widest text-[10px] block">Date</span>
                            <span className="text-ivory/80">{formatDate(ord.createdAt)}</span>
                          </div>
                          <div>
                            <span className="text-gold-400/70 uppercase tracking-widest text-[10px] block">Total</span>
                            <span className="font-semibold text-gold-300">{formatPrice(ord.total)}</span>
                          </div>
                          <div>
                            <span className="text-gold-400/70 uppercase tracking-widest text-[10px] block">Status</span>
                            <span className="inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 rounded">
                              {ord.orderStatus}
                            </span>
                          </div>
                        </div>

                        {/* Items in order */}
                        <div className="divide-y divide-gold-500/15">
                          {ord.items?.map((item, i) => (
                            <div key={i} className="py-2.5 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-14 object-cover border border-gold-400/30 rounded"
                                />
                                <div>
                                  <p className="font-serif text-sm text-ivory">{item.name}</p>
                                  <p className="text-[10px] text-ivory/50">Qty: {item.quantity} • SKU: {item.sku}</p>
                                </div>
                              </div>
                              <span className="text-xs font-medium text-gold-300">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Delivery address */}
                        <div className="pt-2 text-xs text-ivory/60 border-t border-gold-500/20 flex flex-col sm:flex-row justify-between">
                          <span>
                            <strong className="text-gold-400/80">Destination:</strong> {ord.shippingAddress?.addressLine1}, {ord.shippingAddress?.city}
                          </span>
                          <span className="text-gold-400 font-medium">{ord.paymentMethod}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. PROFILE TAB */}
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                <h3 className="font-serif text-2xl text-ivory pb-3 border-b border-gold-400/25">
                  Patron Profile Details
                </h3>

                <Input
                  label="Full Name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  dark={true}
                />

                <Input
                  label="Registered Email (Cannot be changed)"
                  value={user.email}
                  disabled
                  dark={true}
                />

                <Input
                  label="Mobile Contact Phone"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="+91 98200 12345"
                  dark={true}
                />

                <Button type="submit" variant="gold" loading={savingProfile}>
                  Save Profile
                </Button>
              </form>
            )}

            {/* 3. PASSWORD TAB */}
            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
                <h3 className="font-serif text-2xl text-ivory pb-3 border-b border-gold-400/25">
                  Security & Password
                </h3>

                <Input
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  dark={true}
                />

                <Input
                  label="New Password (min 6 characters)"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  dark={true}
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  dark={true}
                />

                <Button type="submit" variant="gold" loading={savingPassword}>
                  Update Password
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
