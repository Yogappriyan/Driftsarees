import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            onComplete();
          }, 200);
          return 100;
        }
        const increment = Math.max(2, Math.floor((100 - prev) / 4) + Math.floor(Math.random() * 12));
        return Math.min(100, prev + increment);
      });
    }, 35);

    // Hard fallback safety to prevent any lock
    const safetyTimer = setTimeout(() => {
      setIsDone(true);
      onComplete();
    }, 1500);

    return () => {
      clearInterval(timer);
      clearTimeout(safetyTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsDone(true);
    onComplete();
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#0D0B0B]"
          exit={{
            opacity: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          }}
          style={{ pointerEvents: isDone ? 'none' : 'auto' }}
        >
          {/* Top ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-[#69152C]/20 rounded-full blur-[120px] pointer-events-none" />

          {/* Wordmark and subtitle */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-2"
            >
              <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-[0.25em] text-[#FAF7F2] uppercase">
                DRIFT
              </h1>
              <p className="font-sans text-xs md:text-sm tracking-[0.4em] text-[#C5A880] uppercase mt-2 font-medium font-mono">
                Draped in Stories
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-serif italic text-sm md:text-base text-[#ECE5DC] mt-4 max-w-sm tracking-wide"
            >
              Six weavers, one thread — months of patient hands.
            </motion.p>

            {/* Counter and sleek progress track */}
            <div className="mt-10 w-48 md:w-64 flex flex-col items-center gap-3">
              <div className="flex justify-between w-full text-xs text-[#C5A880]/80 font-mono tracking-widest tabular-nums">
                <span>HERITAGE WEAVE</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-[2px] bg-[#221D1C] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#8C1D3B] via-[#C5A880] to-[#FAF7F2]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Instant Skip / Enter Button so user is never trapped */}
            <button
              onClick={handleSkip}
              className="mt-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1818]/90 hover:bg-[#2A2424] border border-[#FAF7F2]/15 text-[#ECE5DC]/70 hover:text-[#C5A880] text-xs font-mono tracking-widest uppercase transition-colors cursor-pointer"
            >
              <span>Enter Atelier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
