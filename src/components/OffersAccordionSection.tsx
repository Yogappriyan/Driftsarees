import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CURRENT_OFFERS } from '../data/products';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { scrollToElement } from '../utils/scroll';
import { handleImageError, normalizeImageUrl } from '../utils/imageFallback';

export const OffersAccordionSection: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('02');
  const { setSelectedCategoryFilter, setSelectedMoodFilter } = useShop();

  const handleCtaClick = (offer: typeof CURRENT_OFFERS[0]) => {
    if (offer.targetMood) {
      setSelectedMoodFilter(offer.targetMood);
    }
    if (offer.targetCategory) {
      setSelectedCategoryFilter(offer.targetCategory);
    }
    scrollToElement('#full-catalog', -40);
  };

  return (
    <section
      id="offers"
      className="relative w-full py-24 md:py-36 bg-[#0F0D0D] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-[#FAF7F2]/10 pb-6">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-[#C5A880] block mb-2 font-medium font-mono">
              CURRENT OFFERS
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#FAF7F2] font-normal tracking-tight">
              Worth your <span className="font-serif italic text-[#C5A880]">attention</span>
            </h2>
          </div>
          <span className="text-xs text-[#ECE5DC]/60 uppercase tracking-widest font-mono">
            EXCLUSIVE PRIVILEGES · FESTIVE 2026
          </span>
        </div>

        {/* Expanding Accordion Panels */}
        <div className="min-h-[500px] md:h-[560px] flex flex-col md:flex-row gap-3 w-full">
          {CURRENT_OFFERS.map((offer) => {
            const isActive = activeId === offer.id;

            return (
              <motion.div
                key={offer.id}
                onClick={() => setActiveId(offer.id)}
                layout
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`relative overflow-hidden rounded-2xl cursor-pointer border transition-colors ${
                  isActive
                    ? 'flex-[5] min-h-[340px] md:min-h-0 border-[#C5A880]/60 shadow-2xl shadow-[#541123]/30'
                    : 'flex-[1] min-h-[70px] md:min-h-0 border-[#FAF7F2]/10 hover:border-[#C5A880]/30'
                } bg-[#161313]`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveId(offer.id);
                  }
                }}
              >
                {/* Background Image */}
                <img
                  src={normalizeImageUrl(offer.image)}
                  alt={offer.title}
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className={`absolute inset-0 w-full h-full object-cover object-center filter ${
                    isActive ? 'brightness-90 scale-100' : 'brightness-[0.35] grayscale scale-105'
                  } transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]`}
                />

                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    isActive
                      ? 'bg-gradient-to-t from-black/95 via-black/40 to-black/20'
                      : 'bg-black/60'
                  }`}
                />

                {/* Number Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className="text-xs font-mono font-bold tracking-widest text-[#C5A880] bg-[#141212]/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#FAF7F2]/10">
                    {offer.num}
                  </span>
                </div>

                {/* Collapsed State Title (Desktop) */}
                {!isActive && (
                  <div className="hidden md:flex absolute inset-0 items-center justify-center p-4 pointer-events-none">
                    <span className="font-serif text-sm tracking-widest uppercase text-[#FAF7F2]/70 whitespace-nowrap transform -rotate-90">
                      {offer.title}
                    </span>
                  </div>
                )}

                {/* Collapsed State Title (Mobile) */}
                {!isActive && (
                  <div className="flex md:hidden absolute inset-y-0 left-16 right-4 items-center">
                    <span className="font-serif text-base text-[#FAF7F2]/80 font-medium">
                      {offer.title}
                    </span>
                  </div>
                )}

                {/* Active Expanded State Content */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.35 }}
                    className="absolute bottom-0 inset-x-0 p-6 md:p-10 z-20 flex flex-col justify-end"
                  >
                    <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#C5A880] mb-2 font-mono">
                      <Sparkles className="w-3 h-3" />
                      <span>{offer.tag}</span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#FAF7F2] font-medium leading-tight mb-2">
                      {offer.title}
                    </h3>

                    <p className="text-sm md:text-base text-[#E7D5B8] font-medium mb-2">
                      {offer.offer}
                    </p>

                    <p className="text-xs md:text-sm text-[#ECE5DC]/80 font-light max-w-lg mb-6 leading-relaxed hidden sm:block">
                      {offer.description}
                    </p>

                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCtaClick(offer);
                        }}
                        className="inline-flex items-center gap-2 bg-[#541123] hover:bg-[#781830] text-[#F5EBE1] text-xs uppercase tracking-[0.2em] font-semibold px-5 py-2.5 rounded-full border border-[#8C1D3B]/50 transition-all shadow-lg hover:gap-3 cursor-pointer"
                      >
                        <span>{offer.cta}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
  