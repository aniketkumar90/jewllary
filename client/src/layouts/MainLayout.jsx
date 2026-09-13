import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Navbar from '../components/layout/Navbar';
import MobileMenu from '../components/layout/MobileMenu';
import Footer from '../components/layout/Footer';
import SearchModal from '../components/customer/SearchModal';
import CurtainReveal from '../components/common/CurtainReveal';

const MainLayout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0e1610] text-ivory font-sans selection:bg-gold-500 selection:text-forest-900">
      {/* Royal Theatrical Velvet Curtain Intro */}
      <CurtainReveal />

      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
};

export default MainLayout;
