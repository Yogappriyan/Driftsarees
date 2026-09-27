import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { X, Heart, ShieldCheck, Truck, RotateCcw, ArrowRight, Star, Ruler, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProduct } = useShop();

  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeLookIndex, setActiveLookIndex] = useState<number>(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.primaryImage);
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0]?.name || 'Standard');
      setActiveLookIndex(0);
    }
  }, [product]);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/85 backdrop-blur-lg flex items-center justify-center p-0 sm:p-4 lg:p-8">
        {/* Modal Backdrop click */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-6xl bg-[#141111] border border-[#FAF7F2]/10 sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col"
        >
          {/* Top Bar with Close */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#FAF7F2]/10 bg-[#0F0D0D]/90 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <span className="font-serif text-sm tracking-[0.2em] uppercase text-[#C5A880]">
                DRIFT ATELIER
              </span>
              <span className="text-[#ECE5DC]/30">·</span>
              <span className="text-xs text-[#ECE5DC]/70 font-mono tracking-widest uppercase">
                {product.category}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#1C1818] border border-[#FAF7F2]/10 hover:border-[#C5A880] flex items-center justify-center text-[#ECE5DC] hover:text-[#C5A880] transition-colors"
              aria-label="Close product view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body: Two-Column Layout (Matching Reference Images 6 & 7) */}
          <div 
            className="overflow-y-auto overscroll-contain p-6 md:p-10 flex-1"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: Change Look sidebar + Main Gallery */}
              <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
                {/* "Change look" sidebar thumbnails (Matching Reference 6 & 7) */}
                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-[#C5A880] mb-1 font-mono hidden sm:block">
                    Change look
                  </div>
                  {product.altLooks.map((look, i) => (
                    <button
                      key={look.label}
                      onClick={() => {
                        setActiveImage(look.image);
                        setActiveLookIndex(i);
                      }}
                      className={`relative w-16 h-20 sm:w-20 sm:h-26 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        activeLookIndex === i
                          ? 'border-[#C5A880] ring-2 ring-[#C5A880]/30 shadow-lg'
                          : 'border-[#FAF7F2]/15 hover:border-[#FAF7F2]/40 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={look.image}
                        alt={look.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-white p-0.5 text-center font-mono">
                        {look.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Main Feature Image Container */}
                <div className="relative flex-1 aspect-[3/4] sm:min-h-[520px] rounded-2xl overflow-hidden bg-[#181515] border border-[#FAF7F2]/10 shadow-2xl">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImage}
                      src={activeImage}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full h-full object-cover object-center"
                    />
                  </AnimatePresence>

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Badge */}
                  <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-[#120F0F]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#FAF7F2]/10 text-xs text-[#FAF7F2]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span className="font-mono text-[11px] text-[#C5A880]">100% PURE MULBERRY SILK</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Purchasing Module */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-3 text-xs mb-2">
                    <div className="flex items-center gap-1 text-[#C5A880]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-mono font-semibold">{product.rating}</span>
                    </div>
                    <span className="text-[#ECE5DC]/40">·</span>
                    <span className="text-[#ECE5DC]/70 underline decoration-[#FAF7F2]/20">
                      {product.reviewCount} Artisanal Reviews
                    </span>
                  </div>

                  {/* Title & Price */}
                  <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-normal tracking-tight uppercase mb-3">
                    {product.name}
                  </h1>

                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-2xl sm:text-3xl font-serif text-[#FAF7F2] font-medium font-mono tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-[#ECE5DC]/40 line-through font-mono">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="text-xs text-[#C5A880] tracking-wider font-mono">
                      (Inclusive of all taxes & Fall/Pico)
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#ECE5DC]/80 font-light leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Fabric Specs Badges (Matching Reference 6 & 7) */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {product.fabricSpecs.map((spec) => (
                      <div
                        key={spec}
                        className="bg-[#1B1717] border border-[#FAF7F2]/5 px-3 py-2 rounded-xl text-xs text-[#ECE5DC]/80 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                  {/* Size Selector */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[#ECE5DC]/70 uppercase tracking-widest font-mono">
                        Select Blouse Size: <strong className="text-[#FAF7F2]">{selectedSize}</strong>
                      </span>
                      <button
                        onClick={() => setShowSizeGuide(!showSizeGuide)}
                        className="flex items-center gap-1 text-[#C5A880] hover:underline text-[11px]"
                      >
                        <Ruler className="w-3 h-3" />
                        <span>Size Guide</span>
                      </button>
                    </div>

                    <div className="flex gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`flex-1 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                            selectedSize === size
                              ? 'bg-[#FAF7F2] text-[#0F0D0D] font-bold shadow-md'
                              : 'bg-[#1C1818] text-[#ECE5DC]/80 hover:text-white border border-[#FAF7F2]/10'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    {showSizeGuide && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 p-3 rounded-xl bg-[#1C1818] border border-[#FAF7F2]/10 text-xs text-[#ECE5DC]/80"
                      >
                        <p className="font-semibold text-[#FAF7F2] mb-1">Standard Atelier Sizing (Bust Inches):</p>
                        <p className="text-[11px] font-mono">S: 34-36″ | M: 36-38″ | L: 38-40″ | XL: 40-42″ | 2XL: 42-44″</p>
                        <p className="text-[10px] text-[#C5A880] mt-1">Includes 2-inch margin inside for easy alterations.</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Colour Swatches */}
                  <div className="mb-8">
                    <span className="text-xs text-[#ECE5DC]/70 uppercase tracking-widest font-mono block mb-2">
                      Select Colour: <strong className="text-[#FAF7F2]">{selectedColor}</strong>
                    </span>
                    <div className="flex items-center gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`relative w-8 h-8 rounded-full border-2 transition-transform ${
                            selectedColor === color.name
                              ? 'scale-110 border-[#FAF7F2] ring-2 ring-[#C5A880]'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Action Button (Matching Curved Burgundy Pill in Reference 6 & 7) */}
                <div className="flex items-center gap-3 pt-6 border-t border-[#FAF7F2]/10">
                  <button
                    onClick={(e) => {
                      addToCart(product, selectedSize, selectedColor, e.currentTarget);
                    }}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-[#541123] to-[#781830] hover:from-[#69152C] hover:to-[#8C1D3B] text-[#FAF7F2] text-xs uppercase tracking-[0.25em] font-bold rounded-full border border-[#8C1D3B]/60 flex items-center justify-between shadow-xl shadow-[#541123]/40 group transition-all"
                  >
                    <span>ADD TO CART</span>
                    <div className="w-7 h-7 rounded-full bg-[#C5A880] text-[#0F0D0D] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="w-13 h-13 rounded-full bg-[#1C1818] border border-[#FAF7F2]/15 hover:border-[#C5A880] flex items-center justify-center text-[#ECE5DC] hover:text-[#C5A880] transition-colors"
                    aria-label="Wishlist toggle"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        inWishlist ? 'text-[#8C1D3B] fill-[#8C1D3B]' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Trust Markers */}
                <div className="mt-6 pt-4 border-t border-[#FAF7F2]/10 grid grid-cols-3 gap-2 text-center text-[10px] text-[#ECE5DC]/60 font-mono">
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                    <span>Tested 2G Zari</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-[#C5A880]" />
                    <span>Insured Courier</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RotateCcw className="w-4 h-4 text-[#C5A880]" />
                    <span>7-Day Returns</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Pieces */}
            <div className="mt-16 pt-12 border-t border-[#FAF7F2]/10">
              <h3 className="font-serif text-2xl text-[#FAF7F2] mb-6">
                Complete The Royal Trousseau
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedProduct(item)}
                    className="flex gap-4 p-3 rounded-xl bg-[#181515] border border-[#FAF7F2]/5 hover:border-[#C5A880]/40 transition-colors cursor-pointer"
                  >
                    <img
                      src={item.primaryImage}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-20 object-cover rounded-lg"
                    />
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] text-[#C5A880] uppercase tracking-wider font-mono">
                        {item.category}
                      </span>
                      <h4 className="font-serif text-sm text-[#FAF7F2] font-medium leading-snug">
                        {item.name}
                      </h4>
                      <span className="text-xs text-[#ECE5DC]/80 font-mono mt-1">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
