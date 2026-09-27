import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';

export const FlyToCartAnimation: React.FC = () => {
  const { flyAnimation } = useShop();
  const [targetPos, setTargetPos] = useState<{ x: number; y: number }>({ x: window.innerWidth - 60, y: 30 });

  useEffect(() => {
    const bagBtn = document.getElementById('navbar-bag-button');
    if (bagBtn) {
      const rect = bagBtn.getBoundingClientRect();
      setTargetPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, [flyAnimation]);

  if (!flyAnimation) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          top: flyAnimation.y,
          left: flyAnimation.x,
          opacity: 1,
          scale: 0.9,
        }}
        animate={{
          top: targetPos.y,
          left: targetPos.x,
          opacity: 0.2,
          scale: 0.2,
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="fixed z-[10000] w-20 h-28 -translate-x-1/2 -translate-y-1/2 rounded-xl overflow-hidden pointer-events-none shadow-2xl border-2 border-[#C5A880]"
      >
        <img
          src={flyAnimation.image}
          alt="Adding to bag"
          className="w-full h-full object-cover"
        />
      </motion.div>
    </AnimatePresence>
  );
};
