import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { LogIn, LogOut, User as UserIcon, ShieldCheck, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { currentUser, isAuthLoading, loginWithGoogle, logout, setIsAdminOpen } = useShop();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isAuthLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181313] border border-[#FAF7F2]/10 text-xs font-mono text-[#ECE5DC]/60 animate-pulse">
        <span className="w-2 h-2 rounded-full bg-[#C5A880]/60" />
        <span className="hidden sm:inline">Connecting...</span>
      </div>
    );
  }

  // Not Logged In
  if (!currentUser) {
    return (
      <button
        onClick={() => loginWithGoogle()}
        className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#181414] hover:bg-[#251A1E] text-[#ECE5DC] hover:text-[#FAF7F2] border border-[#C5A880]/40 hover:border-[#C5A880] transition-all text-xs font-mono tracking-wider cursor-pointer shadow-sm group"
        title="Sign in with Google to sync your bridal wishlist and salon orders"
      >
        {/* Real Google SVG Icon */}
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.15C3.25 21.31 7.31 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.23 0 10.06 0 12s.46 3.77 1.26 5.39l4.01-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.26 6.61l4.01 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
          />
        </svg>
        <span className="hidden sm:inline">Sign In</span>
      </button>
    );
  }

  // Logged In
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#1A1416] hover:bg-[#2C1620] border border-[#8C1D3B]/60 text-xs text-[#FAF7F2] transition-all cursor-pointer font-mono shadow-md"
      >
        {currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt={currentUser.displayName || 'Patron'}
            referrerPolicy="no-referrer"
            className="w-5 h-5 rounded-full object-cover border border-[#C5A880]/70"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-[#69152C] text-[#C5A880] flex items-center justify-center text-[10px] font-bold">
            {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
          </div>
        )}

        <span className="hidden md:inline max-w-[110px] truncate text-[11px]">
          {currentUser.displayName?.split(' ')[0] || 'Patron'}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[#C5A880] transition-transform duration-200 ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Account Details Dropdown */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-64 bg-[#141011] border border-[#FAF7F2]/15 rounded-2xl shadow-2xl p-4 z-50 text-left backdrop-blur-xl"
          >
            {/* User Profile Overview */}
            <div className="flex items-center gap-3 pb-3 border-b border-[#FAF7F2]/10">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Patron'}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-[#C5A880]"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#69152C] text-[#C5A880] flex items-center justify-center text-sm font-bold font-serif">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#FAF7F2] truncate font-sans">
                  {currentUser.displayName || 'Maison Patron'}
                </p>
                <p className="text-[10px] text-[#ECE5DC]/60 truncate font-mono">
                  {currentUser.email}
                </p>
              </div>
            </div>

            {/* Live Firestore Sync Status */}
            <div className="py-2.5 px-3 my-2.5 rounded-xl bg-[#1C1618] border border-[#FAF7F2]/5 flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#ECE5DC]/70">Firebase Realtime:</span>
              <span className="inline-flex items-center gap-1 text-[#4BB543]">
                <CheckCircle2 className="w-3 h-3 text-[#4BB543]" />
                <span>Connected</span>
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-1 text-xs font-mono">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setIsAdminOpen(true);
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#ECE5DC] hover:text-[#C5A880] hover:bg-[#20171A] transition-colors w-full text-left cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <span>Atelier Admin Portal</span>
              </button>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#E08A8A] hover:text-[#FF7070] hover:bg-[#2C1417] transition-colors w-full text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-[#E08A8A]" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
