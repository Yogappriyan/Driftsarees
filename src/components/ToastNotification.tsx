import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast, setIsCartOpen } = useShop();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-[#181414]/95 backdrop-blur-xl border border-[#C5A880]/50 rounded-2xl p-4 shadow-2xl shadow-black/80 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            {/* Animated SVG Checkmark draw */}
            <div className="w-10 h-10 rounded-full bg-[#541123] border border-[#8C1D3B] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#C5A880]" viewBox="0 0 24 24" fill="none">
                <motion.path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />
              </svg>
            </div>

            <div>
              <h4 className="font-serif text-sm text-[#FAF7F2] font-medium leading-snug">
                {toast.title}
              </h4>
              <p className="text-[11px] text-[#ECE5DC]/70 font-mono line-clamp-1 mt-0.5">
                {toast.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="px-3 py-1.5 bg-[#541123] hover:bg-[#781830] text-[#FAF7F2] text-[10px] uppercase font-mono tracking-wider font-semibold rounded-lg shrink-0 border border-[#8C1D3B]/40 flex items-center gap-1 shadow-sm"
          >
            <ShoppingBag className="w-3 h-3 text-[#C5A880]" />
            <span>View Bag</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
