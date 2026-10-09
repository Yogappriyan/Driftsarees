import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Play, Sparkles, Volume2, VolumeX, X } from 'lucide-react';
import { HERO_IMAGE, CRAFT_LOOM_IMAGE } from '../data/products';
import { MagneticButton } from './MagneticButton';
import { useShop } from '../context/ShopContext';
import { scrollToElement } from '../utils/scroll';
import { boutiqueAudio } from '../utils/audio';
import { handleImageError, normalizeImageUrl } from '../utils/imageFallback';

export const HeroSection: React.FC = () => {
  const { setActiveView } = useShop();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.22]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) / (width / 2);
    const y = (clientY - (top + height / 2)) / (height / 2);
    setMouseOffset({ x: x * 3.5, y: y * 3.5 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const handleToggleAudio = () => {
    const active = boutiqueAudio.toggle();
    setIsPlayingAudio(active);
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen min-h-[720px] max-h-[1080px] overflow-hidden flex items-center justify-center bg-[#0D0B0B]"
    >
      {/* Background Image Container */}
      <motion.div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          scale: imageScale,
          y: imageY,
          rotateX: -mouseOffset.y,
          rotateY: mouseOffset.x,
        }}
        transition={{ type: 'spring', stiffness: 40, damping: 25 }}
      >
        <img
          src={normalizeImageUrl(HERO_IMAGE)}
          alt="VKT Silks and Sarees Luxury Bridal Salon and Handloom Silk Gallery"
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0D] via-[#0F0D0D]/40 to-[#0F0D0D]/60" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0F0D0D]/20 to-[#0F0D0D]/80" />
        <div className="absolute inset-0 bg-[#541123]/15 mix-blend-color" />
      </motion.div>

      {/* Floating sound toggle badge with real Web Audio synthesizer */}
      <button
        onClick={handleToggleAudio}
        className="absolute bottom-8 left-6 md:left-12 z-20 flex items-center gap-2.5 bg-[#141212]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#FAF7F2]/10 hover:border-[#C5A880]/50 text-[#ECE5DC] text-[11px] tracking-wider transition-all cursor-pointer font-mono"
        aria-label="Toggle salon ambient soundtrack"
      >
        {isPlayingAudio ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#C5A880] animate-pulse" />
            <span className="text-[#C5A880]">Soundtrack · Tanpura &amp; Chime (Active)</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-[#ECE5DC]/60" />
            <span className="text-[#ECE5DC]/70">Salon Soundscape (Click to Play)</span>
          </>
        )}
      </button>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 bg-[#541123]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#8C1D3B]/60 text-[#F5EBE1] text-[11px] md:text-xs tracking-[0.25em] uppercase font-medium mb-6 shadow-lg shadow-[#541123]/30"
        >
          <Sparkles className="w-3 h-3 text-[#C5A880]" />
          <span>Six weavers, one thread — months of patient hands.</span>
        </motion.div>

        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#FAF7F2] font-normal tracking-tight leading-[0.95]"
          >
            More Than <span className="font-serif italic text-[#C5A880]">a Saree</span>
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs md:text-sm tracking-[0.35em] uppercase text-[#C5A880] font-medium mb-4 font-mono"
        >
          TRADITION MEETS TOMORROW
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm md:text-base text-[#ECE5DC]/90 max-w-xl font-light leading-relaxed mb-8 tracking-wide"
        >
          Timeless weaves. Modern expressions. For every you, in every moment. Crafted on ancestral looms with certified pure zari and uncompromised dignity.
        </motion.p>

        {/* CTA Button Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          <MagneticButton
            variant="primary"
            onClick={() => {
              setActiveView('collection');
              scrollToElement('#collection-showcase', -60);
            }}
            className="text-xs tracking-[0.2em] uppercase font-semibold cursor-pointer"
          >
            Explore Collections
          </MagneticButton>

          <MagneticButton
            variant="secondary"
            onClick={() => {
              setIsVideoModalOpen(true);
            }}
            className="text-xs tracking-[0.2em] uppercase font-medium flex items-center gap-2.5 cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current text-[#C5A880]" />
            <span>The Weaver’s Film</span>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Downward Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 right-6 md:right-12 z-20 flex flex-col items-center gap-2 cursor-pointer group"
        onClick={() => scrollToElement('#editorial-marquee', 0)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#ECE5DC]/60 group-hover:text-[#C5A880] transition-colors font-mono">
          SCROLL
        </span>
        <div className="w-[1px] h-8 bg-[#FAF7F2]/20 relative overflow-hidden">
          <motion.div
            className="w-full h-1/2 bg-[#C5A880]"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* The Weaver's Film Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setIsVideoModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-4xl bg-[#141212] border border-[#FAF7F2]/15 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#FAF7F2]/10 bg-[#0F0D0D]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-ping" />
                  <span className="font-serif text-sm tracking-widest uppercase text-[#FAF7F2]">
                    The Weaver’s Film · Varanasi &amp; Kanchipuram Ateliers
                  </span>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="p-1.5 text-[#ECE5DC]/70 hover:text-white rounded-full hover:bg-[#201C1C]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={CRAFT_LOOM_IMAGE}
                  alt="Ancestral Handloom documentary"
                  className="w-full h-full object-cover filter brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-[#541123]/90 border border-[#C5A880] flex items-center justify-center text-[#C5A880] mb-4 shadow-2xl">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-normal mb-2">
                    Six Weavers, One Thread
                  </h3>
                  <p className="text-xs text-[#ECE5DC]/80 max-w-md font-light">
                    A cinematic documentary exploring the generational pit looms of Varanasi and the korvai temple borders of Kanchipuram.
                  </p>
                  <button
                    onClick={() => {
                      setIsVideoModalOpen(false);
                      scrollToElement('#craft-story', -40);
                    }}
                    className="mt-6 px-6 py-2.5 bg-[#8C1D3B] hover:bg-[#A32244] text-[#FAF7F2] text-xs font-mono uppercase tracking-widest rounded-full font-semibold cursor-pointer"
                  >
                    Read The Full Loom Chronicle
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
