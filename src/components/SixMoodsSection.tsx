import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MOODS } from '../data/products';
import { ArrowUpRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { scrollToElement } from '../utils/scroll';

export const SixMoodsSection: React.FC = () => {
  const { setSelectedMoodFilter } = useShop();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.4], [30, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  const handleSelectMood = (moodName: string) => {
    setSelectedMoodFilter(moodName);
    scrollToElement('#full-catalog', -40);
  };

  return (
    <section
      id="six-moods"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 bg-[#0F0D0D] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#541123]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-[#C5A880]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-[#FAF7F2]/10 pb-8"
        >
          <div>
            <div className="flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#C5A880] mb-2 font-medium font-mono">
              <span>THE DRIFT ARCHIVE</span>
              <span>·</span>
              <span>CURATED THEMES</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#FAF7F2] font-normal tracking-tight">
              SIX MOODS. <span className="font-serif italic text-[#C5A880]">Timeless Drapes</span>
            </h2>
          </div>

          <p className="text-sm md:text-base text-[#ECE5DC]/70 max-w-md font-light leading-relaxed">
            Discover museum-grade silks hand-draped for celebratory rituals, ancestral blessings, and midnight receptions. Click any mood to explore its collection.
          </p>
        </motion.div>

        {/* 6 Arched Editorial Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {MOODS.map((mood, idx) => (
            <motion.div
              key={mood.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => handleSelectMood(mood.name)}
              className="group relative cursor-pointer flex flex-col"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSelectMood(mood.name);
                }
              }}
              aria-label={`Explore ${mood.name} collection`}
            >
              {/* Arched Image Container */}
              <div className="relative w-full aspect-[9/16] rounded-t-[100px] rounded-b-2xl overflow-hidden bg-[#181514] border border-[#FAF7F2]/10 group-hover:border-[#C5A880]/60 transition-all duration-700 shadow-xl group-hover:shadow-2xl group-hover:shadow-[#541123]/30">
                <img
                  src={mood.image}
                  alt={mood.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter brightness-[0.85] group-hover:brightness-100 group-hover:scale-108 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0D] via-[#0F0D0D]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Top arched outline glow */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#141212]/80 backdrop-blur-md border border-[#FAF7F2]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 text-[#C5A880]" />
                </div>

                {/* Bottom Content within card */}
                <div className="absolute bottom-0 inset-x-0 p-4 text-center">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#C5A880] block mb-1 font-mono">
                    {mood.count} CREATIONS
                  </span>
                  <h3 className="font-serif text-lg md:text-xl text-[#FAF7F2] font-medium leading-tight group-hover:text-[#C5A880] transition-colors">
                    {mood.name}
                  </h3>
                  <p className="text-[11px] text-[#ECE5DC]/70 font-light mt-1 hidden sm:block">
                    {mood.tagline}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
