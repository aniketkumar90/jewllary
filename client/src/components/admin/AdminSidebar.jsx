import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BRAND_NAME } from '../../utils/constants';
import {
  FiGrid,
  FiBox,
  FiPlusCircle,
  FiFolder,
  FiLayers,
  FiShoppingBag,
  FiUsers,
  FiLayout,
  FiImage,
  FiStar,
  FiMail,
  FiSettings,
  FiLogOut,
  FiExternalLink,
} from 'react-icons/fi';

const menuItems = [
  { label: 'Dashboard', path: '/admin', icon: FiGrid, end: true },
  { label: 'All Products', path: '/admin/products', icon: FiBox },
  { label: 'Add Product', path: '/admin/products/new', icon: FiPlusCircle },
  { label: 'Categories', path: '/admin/categories', icon: FiFolder },
  { label: 'Collections', path: '/admin/collections', icon: FiLayers },
  { label: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
  { label: 'Customers', path: '/admin/users', icon: FiUsers },
  { label: 'Homepage CMS', path: '/admin/homepage', icon: FiLayout },
  { label: 'Banners', path: '/admin/banners', icon: FiImage },
  { label: 'Media Library', path: '/admin/media', icon: FiImage },
  { label: 'Patron Reviews', path: '/admin/reviews', icon: FiStar },
  { label: 'Subscribers', path: '/admin/subscribers', icon: FiMail },
  { label: 'Store Settings', path: '/admin/settings', icon: FiSettings },
];

const AdminSidebar = ({ onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-[#09100a] text-ivory flex flex-col justify-between border-r border-gold-400/25 h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-gold-500/20">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="New Shiv Jewellers"
              className="w-10 h-10 object-contain rounded-md border border-gold-400/40 p-0.5 shadow-md"
            />
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg tracking-wider text-gold-400 font-bold uppercase truncate">
                  {BRAND_NAME}
                </span>
                <span className="text-[8px] uppercase tracking-luxury text-gold-300 bg-gold-500/10 border border-gold-500/30 px-1.5 py-0.5 font-bold ml-1 rounded">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* View Store Direct Link */}
        <div className="px-4 py-3 border-b border-gold-500/15">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 text-[11px] uppercase tracking-wider text-gold-300 hover:text-gold-200 bg-[#131f16] border border-gold-500/30 rounded transition-colors shadow-sm"
          >
            <span>Live Customer Store</span>
            <FiExternalLink className="text-xs" />
          </a>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1 text-left">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase tracking-luxury font-medium rounded transition-all ${
                  isActive
                    ? 'bg-gold-500 text-forest-950 font-semibold shadow-md shadow-gold-500/15'
                    : 'text-ivory/70 hover:text-gold-300 hover:bg-[#131f16]'
                }`
              }
            >
              <item.icon className="text-sm flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Admin User Info & Logout */}
      <div className="p-4 border-t border-gold-500/20 bg-[#060b07]">
        <div className="flex items-center gap-3 mb-3 text-left">
          <div className="w-8 h-8 rounded-full bg-gold-500 text-forest-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
            {user?.name ? user.name[0] : 'A'}
          </div>
          <div className="truncate">
            <p className="text-xs font-medium text-ivory truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-ivory/50 truncate font-mono">{user?.email || 'admin@vanya.com'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-[11px] uppercase tracking-luxury py-2 text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 border border-rose-800/40 rounded transition-colors"
        >
          <FiLogOut className="text-xs" />
          <span>Exit Admin</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
