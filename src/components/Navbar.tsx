import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { scrollToElement } from '../utils/scroll';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsAdminOpen,
    activeView,
    setActiveView,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (totalScroll > 0) {
        setScrollProgress((currentScrollY / totalScroll) * 100);
      }

      setIsScrolled(currentScrollY > 40);

      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY.current + 8) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY.current - 8) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', view: 'home' as const, targetId: '#hero' },
    { label: 'Sarees', view: 'collection' as const, targetId: '#collection-showcase' },
    { label: 'Collections', view: 'lookbook' as const, targetId: '#six-moods' },
    { label: 'The Craft', view: 'craft' as const, targetId: '#craft-story' },
    { label: 'Privilege Offers', view: 'collection' as const, targetId: '#offers' },
  ];

  const handleNavClick = (view: any, targetId: string) => {
    setActiveView(view);
    scrollToElement(targetId, -60);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Top Announcement Ribbon */}
        <div className="bg-[#541123] text-[#FAF7F2] text-[11px] md:text-xs py-1.5 px-4 tracking-[0.2em] font-medium border-b border-[#781830]/40 flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
            <span className="text-[#C5A880] font-mono">NEW FESTIVE DROP</span>
          </div>

          <div className="mx-auto flex items-center gap-3 md:gap-6 text-center">
            <span>UP TO 40% OFF ON FESTIVE EXCLUSIVES</span>
            <span className="opacity-40 hidden md:inline">·</span>
            <span className="text-[#E7D5B8] hidden md:inline">COMPLIMENTARY WORLDWIDE INSURED SHIPPING</span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Admin Toggle in ribbon */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1A1013] hover:bg-[#34161F] text-[#C5A880] text-[10px] font-mono tracking-wider transition-colors border border-[#8C1D3B]/40 cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3 text-[#C5A880]" />
              <span>ATELIER ADMIN</span>
            </button>
            <span className="text-[10px] text-[#C5A880]/70 font-mono">INR ₹ · EN</span>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div
          className={`transition-all duration-500 ${
            isScrolled
              ? 'bg-[#0F0D0D]/95 backdrop-blur-md border-b border-[#FAF7F2]/10 py-3 shadow-2xl shadow-black/40'
              : 'bg-gradient-to-b from-[#0F0D0D]/80 via-[#0F0D0D]/40 to-transparent py-4 md:py-6'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            {/* Zone 1: Wordmark */}
            <div className="flex items-center gap-4">
              <a
                href="#hero"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('home', '#hero');
                }}
                className="group flex flex-col items-start cursor-pointer"
              >
                <span className="font-serif text-2xl md:text-3xl font-medium tracking-[0.28em] text-[#FAF7F2] group-hover:text-[#C5A880] transition-colors uppercase">
                  DRIFT
                </span>
                <span className="text-[9px] tracking-[0.35em] text-[#C5A880] uppercase -mt-1 font-light opacity-90 hidden sm:block font-mono">
                  Draped in Stories
                </span>
              </a>
            </div>

            {/* Zone 2: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = activeView === link.view;
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.view, link.targetId)}
                    className={`relative text-xs tracking-[0.2em] uppercase font-mono font-medium py-1 transition-colors cursor-pointer ${
                      isActive ? 'text-[#C5A880]' : 'text-[#ECE5DC]/80 hover:text-white'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A880] transition-transform duration-300 origin-left ${
                        isActive ? 'scale-x-100' : 'scale-x-0 hover:scale-x-100'
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Interactive Controls */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* Search Bar Input Pill */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-2.5 bg-[#1C1918]/80 hover:bg-[#2A2422] text-[#ECE5DC]/70 hover:text-white px-3.5 py-1.5 rounded-full border border-[#FAF7F2]/10 hover:border-[#C5A880]/40 transition-all text-xs tracking-wider cursor-pointer font-mono"
                aria-label="Search collection"
              >
                <Search className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="text-[11px] text-[#ECE5DC]/60 pr-2">Search sarees...</span>
                <kbd className="text-[9px] bg-[#0F0D0D] px-1.5 py-0.5 rounded text-[#C5A880]/70 font-mono">⌘K</kbd>
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 text-[#ECE5DC]/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Admin Portal Button */}
              <button
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E1819] hover:bg-[#34161F] text-[#C5A880] rounded-full border border-[#8C1D3B]/50 transition-colors text-xs font-mono tracking-wider cursor-pointer"
                title="Maison Atelier Admin Panel & Analytics"
              >
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <span className="hidden xl:inline">Admin</span>
              </button>

              {/* Wishlist Button with Badge */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2 text-[#ECE5DC]/80 hover:text-[#C5A880] transition-colors cursor-pointer"
                aria-label={`View Wishlist with ${wishlist.length} items`}
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={wishlist.length}
                    className="absolute top-1 right-1 w-4 h-4 bg-[#69152C] border border-[#FAF7F2]/30 text-white rounded-full text-[9px] font-mono flex items-center justify-center font-bold"
                  >
                    {wishlist.length}
                  </motion.span>
                )}
              </button>

              {/* Cart Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                id="navbar-bag-button"
                className="relative flex items-center gap-2 bg-[#541123]/80 hover:bg-[#69152C] text-[#FAF7F2] px-3.5 py-2 rounded-full border border-[#8C1D3B]/50 transition-all shadow-md group cursor-pointer"
                aria-label={`Shopping bag with ${cartCount} items`}
              >
                <ShoppingBag className="w-4 h-4 text-[#C5A880] group-hover:scale-110 transition-transform" />
                <span className="text-xs tracking-wider hidden sm:inline font-mono">Bag</span>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.5, y: -4 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                    className="w-4 h-4 bg-[#C5A880] text-[#0F0D0D] rounded-full text-[10px] font-mono font-bold flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                </AnimatePresence>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-[#ECE5DC] hover:text-[#C5A880] cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Slim scroll-progress line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#221D1C]">
            <div
              className="h-full bg-gradient-to-r from-[#8C1D3B] via-[#C5A880] to-[#FAF7F2] transition-[width] duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md lg:hidden flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-4/5 max-w-sm h-full bg-[#141212] border-l border-[#FAF7F2]/10 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#FAF7F2]/10">
                  <span className="font-serif text-2xl tracking-[0.2em] text-[#FAF7F2]">
                    DRIFT
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-[#ECE5DC]/70 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-6 flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => {
                        handleNavClick(link.view, link.targetId);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-between py-3 text-sm tracking-[0.2em] uppercase font-mono font-medium text-[#ECE5DC] border-b border-[#FAF7F2]/5 hover:text-[#C5A880] text-left cursor-pointer"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-4 h-4 text-[#C5A880]/60" />
                    </button>
                  ))}

                  {/* Mobile Admin Portal Button */}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsAdminOpen(true);
                    }}
                    className="flex items-center justify-between py-3.5 px-4 mt-4 bg-[#541123]/80 rounded-xl text-xs tracking-[0.2em] uppercase font-mono font-semibold text-[#FAF7F2] border border-[#8C1D3B]/60 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                      <span>Atelier Admin Portal</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-[#FAF7F2]/10 text-xs text-[#ECE5DC]/60 flex flex-col gap-2 font-mono">
                <p className="tracking-widest uppercase text-[#C5A880]">DRAPED IN STORIES</p>
                <p className="font-sans text-xs">Pure Handloom Silks &amp; Bespoke Bridal Couture</p>
                <p className="text-[10px] mt-2">© 2026 DRIFT Haute Couture</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
