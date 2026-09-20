import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { AuthOverlay } from './components/auth/AuthOverlay';
import { AdminPortal } from './components/admin/AdminPortal';
import { TopGuaranteeBar } from './components/TopGuaranteeBar';
import { Navbar } from './components/Navbar';
import { LuxuryStoriesBar } from './components/LuxuryStoriesBar';
import { Hero } from './components/Hero';
import { CircularCycleShowcase } from './components/CircularCycleShowcase';
import { TrendingStoreSection } from './components/TrendingStoreSection';
import { FloatingProductsMarquee } from './components/FloatingProductsMarquee';
import { CategoryWiseProductSection } from './components/CategoryWiseProductSection';
import { ProductGrid } from './components/ProductGrid';
import { TrustBadges } from './components/TrustBadges';
import { Footer } from './components/Footer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CartDrawer } from './components/CartDrawer';
import { TrackOrderModal } from './components/TrackOrderModal';
import { LocationModal } from './components/LocationModal';
import { QuickViewModal } from './components/QuickViewModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { VirtualDemoModal } from './components/VirtualDemoModal';
import { FloatingAmbientBackground } from './components/ui/FloatingAmbientBackground';
import { Toast } from './components/Toast';

export function AppContent() {
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isVirtualDemoOpen, setIsVirtualDemoOpen] = useState(false);
  const { selectedCategory, setSelectedCategory, setQuickViewProduct } = useStore();

  // Check URL hash for #admin or /admin
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.pathname.includes('/admin')) {
        setIsAdminPortalOpen(true);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#1F2937] relative overflow-x-hidden">
      {/* Animated Ambient Background Mesh & Floating Glow Orbs */}
      <FloatingAmbientBackground />

      {/* Customer Full-Screen Login & OTP Guard Overlay */}
      <AuthOverlay />

      {/* Admin Portal (2-Step Login, Admin OTP, Admin Dashboard) */}
      <AdminPortal 
        isOpen={isAdminPortalOpen} 
        onClose={() => {
          setIsAdminPortalOpen(false);
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
        }} 
      />

      {/* Main Navbar with Logo, Search, Wishlist Heart Toggle, Cart */}
      <Navbar onOpenAdmin={() => setIsAdminPortalOpen(true)} />

      {/* 4. Luxury Hero Carousel Slider */}
      <Hero />

      {/* Interactive Circular Motion Kids Cycles & Toys Showcase */}
      <CircularCycleShowcase />

      {/* 5. Trending Store Category Section */}
      <TrendingStoreSection />

      {/* Continuous 3D Floating Products Marquee (Right-to-Left Infinite Motion) */}
      <FloatingProductsMarquee />

      {/* 6. Product Grid & Category Collections Section */}
      <ProductGrid />

      {/* 7. Footer */}
      <Footer onOpenAdmin={() => setIsAdminPortalOpen(true)} />

      {/* Overlays, VIP Virtual Demo & Drawers */}
      <WishlistDrawer />
      <CartDrawer />
      <TrackOrderModal />
      <LocationModal />
      <QuickViewModal />
      <CheckoutModal />
      <VirtualDemoModal 
        isOpen={isVirtualDemoOpen} 
        onClose={() => setIsVirtualDemoOpen(false)} 
      />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </AuthProvider>
  );
}
