import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, RotateCcw } from 'lucide-react';

export const CatalogSection: React.FC = () => {
  const {
    products,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setCursorMode,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedMoodFilter,
    setSelectedMoodFilter,
  } = useShop();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const categories = ['All', 'Kanjivaram', 'Banarasi', 'Paithani', 'Organza', 'Net', 'Chiffon'];
  const moods = [
    'All',
    'Wedding Edit',
    'Kanchipuram Icons',
    'Banarasi Heirlooms',
    'Festive Radiance',
    'Zari Signatures',
    'Bridal Glam',
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const matchCat = selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter;
        const matchMood = selectedMoodFilter === 'All' || item.mood === selectedMoodFilter;
        return matchCat && matchMood;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategoryFilter, selectedMoodFilter, sortBy]);

  const hasActiveFilters = selectedCategoryFilter !== 'All' || selectedMoodFilter !== 'All';

  const resetFilters = () => {
    setSelectedCategoryFilter('All');
    setSelectedMoodFilter('All');
  };

  return (
    <section id="full-catalog" className="relative w-full py-24 bg-[#0B0909] text-[#ECE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs tracking-[0.35em] uppercase text-[#C5A880] block mb-2 font-medium font-mono">
            THE COMPLETE COLLECTION
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#FAF7F2] font-normal tracking-tight">
            Curated Artisanal <span className="font-serif italic text-[#C5A880]">Haute Drapes</span>
          </h2>
          <p className="mt-3 text-sm text-[#ECE5DC]/70 font-light">
            Each drape is handloom registered, inspected thread-by-thread, and hallmarked for absolute purity.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-10 p-3 sm:p-4 rounded-2xl bg-[#141212] border border-[#FAF7F2]/10 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto scrollbar-none pb-1 lg:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategoryFilter === cat
                    ? 'bg-[#541123] text-[#FAF7F2] border border-[#8C1D3B]/40 shadow-sm font-semibold'
                    : 'text-[#ECE5DC]/70 hover:text-white hover:bg-[#1E1B1A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Controls: Mood & Sort */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end text-xs">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241C1C] hover:bg-[#342424] text-[#C5A880] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-[#ECE5DC]/50 uppercase tracking-widest font-mono hidden sm:inline">Theme:</span>
              <select
                value={selectedMoodFilter}
                onChange={(e) => setSelectedMoodFilter(e.target.value)}
                className="bg-[#1C1918] text-[#ECE5DC] border border-[#FAF7F2]/10 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#C5A880] font-mono text-xs cursor-pointer"
              >
                {moods.map((m) => (
                  <option key={m} value={m}>
                    {m === 'All' ? 'All Themes' : m}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#ECE5DC]/50 uppercase tracking-widest font-mono hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#1C1918] text-[#ECE5DC] border border-[#FAF7F2]/10 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#C5A880] font-mono text-xs cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count & Badges */}
        <div className="flex items-center justify-between text-xs text-[#C5A880] tracking-widest uppercase mb-6 font-mono">
          <span>
            Showing {filteredProducts.length} certified {filteredProducts.length === 1 ? 'creation' : 'creations'}
            {selectedCategoryFilter !== 'All' ? ` in ${selectedCategoryFilter}` : ''}
            {selectedMoodFilter !== 'All' ? ` (${selectedMoodFilter})` : ''}
          </span>
          <span className="hidden sm:inline">Tested 2G Pure Zari</span>
        </div>

        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#141212] rounded-3xl border border-[#FAF7F2]/10 p-8">
            <p className="font-serif text-2xl text-[#FAF7F2] mb-2">No Sarees in this Combination</p>
            <p className="text-xs text-[#ECE5DC]/60 max-w-sm mx-auto mb-6">
              Our master weavers craft limited numbers per batch. Try adjusting your weave category or theme filter.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#541123] hover:bg-[#781830] text-[#FAF7F2] text-xs font-mono uppercase tracking-widest rounded-full font-semibold cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <AnimatePresence>
              {filteredProducts.map((product) => {
                const isHovered = hoveredId === product.id;
                const inWishlist = isInWishlist(product.id);

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    onMouseEnter={() => {
                      setHoveredId(product.id);
                      setCursorMode('view');
                    }}
                    onMouseLeave={() => {
                      setHoveredId(null);
                      setCursorMode('default');
                    }}
                    className="group flex flex-col cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {/* Image Card Container */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#161313] border border-[#FAF7F2]/10 group-hover:border-[#C5A880]/50 transition-all duration-500 shadow-lg group-hover:shadow-2xl">
                      <img
                        src={product.primaryImage}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isHovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
                        }`}
                      />
                      <img
                        src={product.secondaryImage || product.primaryImage}
                        alt={`${product.name} alternate view`}
                        referrerPolicy="no-referrer"
                        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isHovered ? 'scale-105 opacity-100' : 'scale-100 opacity-0'
                        }`}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20">
                        {product.isNew ? (
                          <span className="text-[9px] font-mono tracking-widest uppercase font-semibold text-[#FAF7F2] bg-[#541123]/90 px-2 py-0.5 rounded-full border border-[#8C1D3B]/40">
                            NEW
                          </span>
                        ) : product.isBestseller ? (
                          <span className="text-[9px] font-mono tracking-widest uppercase font-semibold text-[#0F0D0D] bg-[#C5A880] px-2 py-0.5 rounded-full">
                            ICONIC
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono tracking-widest uppercase text-[#FAF7F2]/70 bg-black/60 px-2 py-0.5 rounded-full">
                            {product.category}
                          </span>
                        )}

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className="w-8 h-8 rounded-full bg-[#141212]/80 backdrop-blur-md border border-[#FAF7F2]/20 flex items-center justify-center text-[#ECE5DC] hover:text-[#C5A880] transition-colors cursor-pointer"
                          aria-label="Wishlist"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              inWishlist ? 'text-[#8C1D3B] fill-[#8C1D3B]' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Quick Add Button */}
                      <div className="absolute bottom-3 inset-x-3 z-20 flex gap-2 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, undefined, undefined, e.currentTarget);
                          }}
                          className="flex-1 py-2 px-3 bg-[#541123] hover:bg-[#781830] text-[#FAF7F2] text-[11px] uppercase tracking-wider font-semibold rounded-lg border border-[#8C1D3B]/40 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>Quick Add</span>
                        </button>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="mt-3 flex flex-col">
                      <div className="flex items-center justify-between text-[11px] text-[#C5A880] tracking-wider uppercase font-mono mb-1">
                        <span>{product.category}</span>
                        <span>★ {product.rating}</span>
                      </div>

                      <h3 className="font-serif text-lg text-[#FAF7F2] group-hover:text-[#C5A880] transition-colors font-medium">
                        {product.name}
                      </h3>

                      <div className="mt-1 flex items-baseline gap-2 text-sm font-mono tabular-nums">
                        <span className="text-[#FAF7F2] font-semibold">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-[#ECE5DC]/40 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};
