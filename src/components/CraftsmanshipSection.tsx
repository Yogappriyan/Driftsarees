import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { CRAFT_LOOM_IMAGE } from '../data/products';
import { ShieldCheck, Award, Sparkles, Feather } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { useShop } from '../context/ShopContext';
import { handleImageError, normalizeImageUrl } from '../utils/imageFallback';

export const CraftsmanshipSection: React.FC = () => {
  const { setActiveView } = useShop();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const backImageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const frontImageY = useTransform(scrollYProgress, [0, 1], ['12%', '-12%']);
  const floatingCardY = useTransform(scrollYProgress, [0, 1], ['18%', '-18%']);

  const pillars = [
    {
      icon: Award,
      title: 'Tested 2G Pure Zari',
      desc: 'Hallmarked electroplated silver-gold threads that never tarnish with age.',
    },
    {
      icon: Feather,
      title: 'Korvai Interlock',
      desc: 'Two weavers simultaneously operating dual shuttles for seamless border fusion.',
    },
    {
      icon: ShieldCheck,
      title: 'Silk Mark Certified',
      desc: '100% genuine Mulberry silk verified by the Silk Mark Organization of India.',
    },
    {
      icon: Sparkles,
      title: 'Bespoke Tailoring',
      desc: 'Complimentary customized made-to-measure blouse and fall/pico draping.',
    },
  ];

  return (
    <section
      id="craft-story"
      ref={containerRef}
      className="relative w-full py-28 md:py-40 bg-[#120E0E] overflow-hidden"
    >
      {/* Top Animated Wavy SVG Divider */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none z-10">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 md:h-20 text-[#0B0909] fill-current"
        >
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,0 L0,0 Z" />
        </svg>
      </div>

      {/* Drifting aurora background gradient */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#541123]/25 via-[#C5A880]/10 to-transparent rounded-full blur-[140px] pointer-events-none animate-drift-gradient" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#C5A880] mb-3 font-medium">
            <span>THE LIVING HERITAGE</span>
            <span>·</span>
            <span>ANATOLIAN & INDIAN WEAVES</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#FAF7F2] font-normal tracking-tight">
            Months of Patient Hands, <br />
            <span className="font-serif italic text-[#C5A880]">Woven into Infinity</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-[#ECE5DC]/70 font-light leading-relaxed">
            In our master weavers’ ateliers across Varanasi, Kanchipuram, and Paithan, time does not pass in seconds — it is measured in centimeters of pure gold zari drawn across silk warps.
          </p>
        </div>

        {/* Layered Image & Text Composition (Editorial Overlap) */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-24">
          {/* Back Image (Large Handloom Macro) */}
          <div className="lg:col-span-8 relative">
            <motion.div
              style={{ y: backImageY }}
              className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-[#FAF7F2]/10"
            >
              <img
                src={normalizeImageUrl(CRAFT_LOOM_IMAGE)}
                alt="Master weaver handling golden zari on handloom"
                referrerPolicy="no-referrer"
                onError={handleImageError}
                className="w-full h-full object-cover filter brightness-90 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120E0E] via-transparent to-black/30" />
              
              <div className="absolute bottom-6 left-6 md:left-10 text-xs text-[#FAF7F2] font-mono tracking-widest uppercase">
                <span className="text-[#C5A880]">PLATE 04</span> · KADHWA PIT LOOM ATELIER
              </div>
            </motion.div>
          </div>

          {/* Front Offset Floating Image & Quote Card */}
          <div className="lg:col-span-4 relative mt-6 lg:-mt-12 lg:-ml-16 z-30">
            <motion.div
              style={{ y: frontImageY }}
              className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-[#C5A880]/30 hidden sm:block"
            >
              <img
                src={normalizeImageUrl('https://i.postimg.cc/rpgQNBWt/editorial-model-kanjivaram-1790444829857.jpg')}
                alt="Emerald Kanjivaram silk drape"
                referrerPolicy="no-referrer"
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </motion.div>

            {/* Floating Editorial Quote Card with organic blur */}
            <motion.div
              style={{ y: floatingCardY }}
              className="mt-4 sm:-mt-16 bg-[#1A1616]/95 backdrop-blur-xl border border-[#C5A880]/40 p-6 md:p-8 rounded-2xl shadow-2xl shadow-black/80"
            >
              <p className="font-serif italic text-lg md:text-xl text-[#FAF7F2] leading-snug">
                “A true handloom drape carries the heartbeat of the artisan. No two shuttle passes are identical — each saree is a singular masterpiece of patience.”
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-[#C5A880] tracking-wider uppercase">
                <span>Rameshwar Dev</span>
                <span>4th Generation Master Weaver</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-[#FAF7F2]/10">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className="p-6 rounded-2xl bg-[#181414] border border-[#FAF7F2]/5 hover:border-[#C5A880]/40 transition-colors group"
            >
              <pillar.icon className="w-6 h-6 text-[#C5A880] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-xl text-[#FAF7F2] font-medium mb-2">
                {pillar.title}
              </h3>
              <p className="text-xs text-[#ECE5DC]/70 leading-relaxed font-light">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 text-center">
          <MagneticButton
            variant="outline"
            onClick={() => {
              setActiveView('collection');
              const target = document.getElementById('collection-showcase');
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs uppercase tracking-[0.2em] font-medium"
          >
            Explore Certified Masterpieces
          </MagneticButton>
        </div>
      </div>

      {/* Bottom Animated Wavy SVG Divider */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10 rotate-180">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 md:h-20 text-[#0F0D0D] fill-current"
        >
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,0 L0,0 Z" />
        </svg>
      </div>
    </section>
  );
};
