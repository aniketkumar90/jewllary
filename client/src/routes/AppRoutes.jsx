import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Guard
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Customer Pages
import HomePage from '../pages/customer/HomePage';
import CataloguePage from '../pages/customer/CataloguePage';
import ProductDetailPage from '../pages/customer/ProductDetailPage';
import CollectionsPage from '../pages/customer/CollectionsPage';
import CartPage from '../pages/customer/CartPage';
import CheckoutPage from '../pages/customer/CheckoutPage';
import OrderSuccessPage from '../pages/customer/OrderSuccessPage';
import WishlistPage from '../pages/customer/WishlistPage';
import AccountPage from '../pages/customer/AccountPage';
import AboutPage from '../pages/customer/AboutPage';
import ContactPage from '../pages/customer/ContactPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Admin Pages
import DashboardPage from '../pages/admin/DashboardPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import ProductFormPage from '../pages/admin/ProductFormPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminCollectionsPage from '../pages/admin/AdminCollectionsPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminHomepageCMSPage from '../pages/admin/AdminHomepageCMSPage';
import AdminBannersPage from '../pages/admin/AdminBannersPage';
import MediaLibraryPage from '../pages/admin/MediaLibraryPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminReviewsPage from '../pages/admin/AdminReviewsPage';
import AdminSubscribersPage from '../pages/admin/AdminSubscribersPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer Store Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="jewellery" element={<CataloguePage />} />
        <Route path="jewellery/:categorySlug" element={<CataloguePage />} />
        <Route path="product/:slug" element={<ProductDetailPage />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="collections/:slug" element={<CollectionsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-success/:orderId" element={<OrderSuccessPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route
          path="account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/edit/:id" element={<ProductFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="collections" element={<AdminCollectionsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="homepage" element={<AdminHomepageCMSPage />} />
        <Route path="banners" element={<AdminBannersPage />} />
        <Route path="media" element={<MediaLibraryPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="subscribers" element={<AdminSubscribersPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
