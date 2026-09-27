import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';

export const StickyEditorialChip: React.FC = () => {
  const { setSelectedProduct } = useShop();
  const [visible, setVisible] = useState(false);
  const featured = PRODUCTS[0]; // Rosé Net Embroidered

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero and before footer
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const isPastHero = scrollY > 600;
      const isBeforeFooter = scrollY < docHeight - 1200;
      setVisible(isPastHero && isBeforeFooter);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-6 z-40 hidden md:block"
        >
          <div
            onClick={() => setSelectedProduct(featured)}
            className="flex items-center gap-3 bg-[#181414]/90 hover:bg-[#221B1B] backdrop-blur-xl border border-[#C5A880]/40 p-2 pr-4 rounded-full shadow-2xl shadow-black/80 cursor-pointer group transition-all"
          >
            <img
              src={featured.primaryImage}
              alt={featured.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-[#C5A880]/60 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#C5A880] uppercase">
                <Sparkles className="w-2.5 h-2.5" />
                <span>SHOP THE LOOK</span>
              </div>
              <span className="font-serif text-xs text-[#FAF7F2] font-medium group-hover:text-[#C5A880] transition-colors">
                {featured.name} · ₹{featured.price.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#541123] flex items-center justify-center text-[#C5A880] ml-1">
              <Eye className="w-3 h-3" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
