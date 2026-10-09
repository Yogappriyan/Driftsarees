import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { handleImageError, normalizeImageUrl } from '../utils/imageFallback';

export const CurvedShowcaseSection: React.FC = () => {
  const { products, setSelectedProduct, addToCart, toggleWishlist, isInWishlist, setCursorMode } = useShop();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Mouse Drag to Scroll State
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    const scrollAmount = clientWidth * 0.75;
    const newPosition = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;

    carouselRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollPosition((scrollLeft / maxScroll) * 100);
    }
  };

  // Drag handlers for mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftState(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.6; // Scroll speed multiplier
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    carouselRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <section
      id="collection-showcase"
      className="relative w-full py-24 md:py-36 bg-[#0B0909] overflow-hidden"
    >
      {/* Background radial spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#541123]/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#FAF7F2]/10 pb-8">
          <div>
            <div className="text-xs tracking-[0.35em] uppercase text-[#C5A880] mb-2 font-medium font-mono">
              THE VKT SILKS AND SAREES SIGNATURES
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#FAF7F2] font-normal tracking-tight">
              Woven to Be <span className="font-serif italic text-[#C5A880] font-light">Remembered</span>
            </h2>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#ECE5DC]/50 uppercase tracking-widest font-mono hidden sm:inline">
              DRAG OR GLIDE
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-11 h-11 rounded-full border border-[#FAF7F2]/20 hover:border-[#C5A880] bg-[#141212]/80 backdrop-blur-md flex items-center justify-center text-[#ECE5DC] hover:text-[#C5A880] transition-colors cursor-pointer"
                aria-label="Previous signature pieces"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-11 h-11 rounded-full border border-[#FAF7F2]/20 hover:border-[#C5A880] bg-[#141212]/80 backdrop-blur-md flex items-center justify-center text-[#ECE5DC] hover:text-[#C5A880] transition-colors cursor-pointer"
                aria-label="Next signature pieces"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Perspective Carousel Track with Momentum Drag */}
      <div className="relative w-full">
        {/* Left edge shadow gradient */}
        <div className="absolute top-0 bottom-0 left-0 w-8 md:w-24 bg-gradient-to-r from-[#0B0909] to-transparent z-10 pointer-events-none" />
        {/* Right edge shadow gradient */}
        <div className="absolute top-0 bottom-0 right-0 w-8 md:w-24 bg-gradient-to-l from-[#0B0909] to-transparent z-10 pointer-events-none" />

        <div
          ref={carouselRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={() => {
            handleMouseUpOrLeave();
            setCursorMode('default');
          }}
          onMouseEnter={() => setCursorMode('drag')}
          className={`flex gap-6 md:gap-8 overflow-x-auto scrollbar-none px-4 sm:px-8 md:px-16 py-8 snap-x snap-mandatory select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
        >
          {products.map((product) => {
            const isHovered = hoveredCardId === product.id;
            const inWishlist = isInWishlist(product.id);

            return (
              <motion.div
                key={product.id}
                onMouseEnter={() => {
                  setHoveredCardId(product.id);
                  setCursorMode('view');
                }}
                onMouseLeave={() => {
                  setHoveredCardId(null);
                  setCursorMode('drag');
                }}
                className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] snap-center group relative flex flex-col"
              >
                {/* Product Card Container */}
                <div
                  onClick={() => {
                    if (!hasMoved) {
                      setSelectedProduct(product);
                    }
                  }}
                  className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[#161313] border border-[#FAF7F2]/10 group-hover:border-[#C5A880]/50 transition-all duration-500 shadow-xl group-hover:shadow-2xl group-hover:shadow-[#541123]/30 cursor-pointer"
                >
                  {/* Primary & Secondary Image Swap on Hover */}
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={normalizeImageUrl(product.primaryImage)}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                      className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isHovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
                      }`}
                    />
                    <img
                      src={normalizeImageUrl(product.secondaryImage || product.primaryImage)}
                      alt={`${product.name} detail view`}
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                      className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isHovered ? 'scale-105 opacity-100' : 'scale-100 opacity-0'
                      }`}
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0909] via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
                    {product.isNew ? (
                      <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#F5EBE1] bg-[#541123]/90 px-3 py-1 rounded-full border border-[#8C1D3B]/40 font-mono">
                        NEW DROP
                      </span>
                    ) : product.isBestseller ? (
                      <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#0F0D0D] bg-[#C5A880] px-3 py-1 rounded-full font-mono">
                        BESTSELLER
                      </span>
                    ) : (
                      <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#FAF7F2]/80 bg-[#161313]/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#FAF7F2]/10 font-mono">
                        {product.category}
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="w-9 h-9 rounded-full bg-[#141212]/80 backdrop-blur-md border border-[#FAF7F2]/20 hover:border-[#C5A880] flex items-center justify-center text-[#ECE5DC] transition-all hover:scale-110 cursor-pointer"
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          inWishlist ? 'text-[#8C1D3B] fill-[#8C1D3B]' : 'hover:text-[#C5A880]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Hover Quick Action Buttons */}
                  <div className="absolute bottom-4 inset-x-4 z-20 flex gap-2 transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, undefined, undefined, e.currentTarget);
                      }}
                      className="flex-1 py-2.5 px-4 bg-[#541123] hover:bg-[#781830] text-[#F5EBE1] text-xs uppercase tracking-widest font-semibold rounded-xl border border-[#8C1D3B]/50 flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Quick Add</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="w-11 h-11 bg-[#1A1817]/90 hover:bg-[#2A2422] text-[#FAF7F2] rounded-xl border border-[#FAF7F2]/20 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="View product details"
                    >
                      <Eye className="w-4 h-4 text-[#C5A880]" />
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div
                  onClick={() => {
                    if (!hasMoved) setSelectedProduct(product);
                  }}
                  className="mt-4 flex flex-col cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs text-[#C5A880] tracking-[0.2em] uppercase font-mono mb-1">
                    <span>{product.mood}</span>
                    <span>★ {product.rating}</span>
                  </div>

                  <h3 className="font-serif text-xl md:text-2xl text-[#FAF7F2] font-normal tracking-tight group-hover:text-[#C5A880] transition-colors">
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
        </div>

        {/* Global Progress Track Line */}
        <div className="max-w-xs mx-auto mt-6 px-4">
          <div className="w-full h-1 bg-[#221D1C] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8C1D3B] to-[#C5A880] transition-all duration-200"
              style={{ width: `${Math.max(12, scrollPosition)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
