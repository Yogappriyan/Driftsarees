import React from 'react';
import { motion } from 'motion/react';

export const EditorialTicker: React.FC = () => {
  const items = [
    'Pure zari, tested and certified',
    'New festive bridal edit',
    'Made-to-drape custom blouse stitching',
    'Easy 7-day white-glove returns',
    '100% Certified Mulberry handloom silk',
    'Complimentary worldwide insured shipping',
    'Direct lineage weaver families',
    'Silk Mark Organization of India Hallmarked',
  ];

  return (
    <div
      id="editorial-marquee"
      className="relative w-full bg-[#541123] border-y border-[#781830]/50 py-3 overflow-hidden select-none"
    >
      <div className="flex w-max">
        {/* First track */}
        <motion.div
          className="flex items-center gap-8 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
        >
          {items.concat(items).map((text, i) => (
            <div key={i} className="flex items-center gap-8">
              <span className="text-xs md:text-sm font-sans tracking-[0.22em] text-[#FAF7F2] uppercase font-medium">
                {text}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] inline-block" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
