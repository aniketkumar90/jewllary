import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <SettingsProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <AppRoutes />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </SettingsProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
