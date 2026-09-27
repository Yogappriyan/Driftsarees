import React, { useState, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EditorialTicker } from './components/EditorialTicker';
import { SixMoodsSection } from './components/SixMoodsSection';
import { CurvedShowcaseSection } from './components/CurvedShowcaseSection';
import { CraftsmanshipSection } from './components/CraftsmanshipSection';
import { OffersAccordionSection } from './components/OffersAccordionSection';
import { CatalogSection } from './components/CatalogSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { AdminPanel } from './components/AdminPanel';
import { StickyEditorialChip } from './components/StickyEditorialChip';
import { ToastNotification } from './components/ToastNotification';
import { FlyToCartAnimation } from './components/FlyToCartAnimation';
import { Footer } from './components/Footer';
import { ShieldCheck } from 'lucide-react';

const MainExperience: React.FC = () => {
  const { selectedProduct, setSelectedProduct, setIsAdminOpen, isAdminOpen } = useShop();
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Prevent background scroll while Admin Panel is open, restoring completely on exit
  useEffect(() => {
    if (isAdminOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAdminOpen]);

  // Global keyboard shortcut for Admin Panel: ⌘+Shift+A or Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminOpen(!isAdminOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminOpen, setIsAdminOpen]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#0F0D0D] text-[#ECE5DC] selection:bg-[#781830] selection:text-[#FAF7F2]">
      {/* GPU Film Grain Overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Permanent Round Cursor Follower Icon */}
      <CustomCursor />

      {/* Initial Page Preloader */}
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main id="main-content">
        {/* Full-bleed Cinematic Ken-Burns Hero */}
        <HeroSection />

        {/* Marquee Editorial Ticker */}
        <EditorialTicker />

        {/* "SIX MOODS. Timeless Drapes" Arched Showcase */}
        <SixMoodsSection />

        {/* "THE DRIFT SIGNATURES - Woven to Be Remembered" Curved Carousel */}
        <CurvedShowcaseSection />

        {/* Artisanal Loom Story & Layered Editorial Parallax Composition */}
        <CraftsmanshipSection />

        {/* "CURRENT OFFERS - Worth your attention" Expanding Accordion Showcase */}
        <OffersAccordionSection />

        {/* Complete Catalog Grid with Filters & Sort */}
        <CatalogSection />
      </main>

      {/* Sticky "Shop the Look" Floating Chip */}
      <StickyEditorialChip />

      {/* Floating Quick "Atelier Admin" Access Pill (Bottom Right Above Toast) */}
      <button
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#181315]/95 hover:bg-[#2C141C] border border-[#8C1D3B]/60 text-[#C5A880] shadow-2xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer font-mono text-xs"
        title="Open Maison Atelier Admin & Analytics (Ctrl+Shift+A)"
      >
        <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
        <span>Atelier Admin</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/50 text-[#ECE5DC]/60">⌘⇧A</span>
      </button>

      {/* Ghost product fly-to-cart effect */}
      <FlyToCartAnimation />

      {/* Slide-in Drawers, Modals & Admin Suite */}
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <AdminPanel />

      {/* Toast Notification with animated checkmark draw */}
      <ToastNotification />

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainExperience />
    </ShopProvider>
  );
}
