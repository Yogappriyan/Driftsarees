import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { Search, X, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setSelectedProduct, products } = useShop();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const results = query.trim() === ''
    ? products.slice(0, 4)
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.mood.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-[95] overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 lg:p-12">
      <div className="fixed inset-0" onClick={() => setIsSearchOpen(false)} />

      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl bg-[#141212] border border-[#FAF7F2]/15 rounded-2xl shadow-2xl overflow-hidden mt-12 sm:mt-20"
      >
        {/* Search Header */}
        <div className="flex items-center px-5 py-4 border-b border-[#FAF7F2]/10 bg-[#0F0D0D]">
          <Search className="w-5 h-5 text-[#C5A880] mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search by weave, fabric, occasion (e.g. Kanjivaram, Banarasi, Bridal)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#FAF7F2] placeholder-[#ECE5DC]/40 text-base outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#ECE5DC]/50 hover:text-white mr-2"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-[#ECE5DC]/60 hover:text-white rounded-lg hover:bg-[#1E1B1A]"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Filters */}
        <div className="px-5 py-3 border-b border-[#FAF7F2]/5 bg-[#171414] flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-[#ECE5DC]/50 uppercase tracking-wider text-[10px] font-mono shrink-0">
            SUGGESTIONS:
          </span>
          {['Kanjivaram', 'Banarasi', 'Organza', 'Rosé', 'Wedding Edit'].map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-2.5 py-1 rounded-md bg-[#221D1D] text-[#ECE5DC]/80 hover:text-[#C5A880] hover:bg-[#2A2424] whitespace-nowrap text-[11px]"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div 
          className="p-4 max-h-[60vh] overflow-y-auto overscroll-contain flex flex-col gap-2"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {results.length === 0 ? (
            <div className="text-center py-12 text-[#ECE5DC]/60 text-sm">
              No creations found matching &quot;{query}&quot;. Try exploring &quot;Kanjivaram&quot; or &quot;Organza&quot;.
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  setIsSearchOpen(false);
                }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1C1818] border border-transparent hover:border-[#FAF7F2]/10 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.primaryImage}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <span className="text-[10px] text-[#C5A880] uppercase tracking-wider font-mono">
                      {product.category} · {product.mood}
                    </span>
                    <h4 className="font-serif text-base text-[#FAF7F2] group-hover:text-[#C5A880] transition-colors">
                      {product.name}
                    </h4>
                    <span className="text-xs font-mono text-[#ECE5DC]/80">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-[#ECE5DC]/40 group-hover:text-[#C5A880] group-hover:translate-x-1 transition-all" />
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-[#0F0D0D] border-t border-[#FAF7F2]/5 flex items-center justify-between text-[11px] text-[#ECE5DC]/50 font-mono">
          <span>Press ESC to close</span>
          <span>DRIFT Archive 2026</span>
        </div>
      </motion.div>
    </div>
  );
};
