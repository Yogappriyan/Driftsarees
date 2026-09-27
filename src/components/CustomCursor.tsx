import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

/**
 * Permanent circular luxury cursor follower:
 * Distinctive central gold dot with a smooth trailing circular outer ring.
 */
export const CustomCursor: React.FC = () => {
  const [hasMoved, setHasMoved] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth responsive spring for outer circle trailing
  const springConfig = { damping: 26, stiffness: 280, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!hasMoved) setHasMoved(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = target.closest(
          'button, a, input, select, textarea, [role="button"], [data-cursor-pointer], .cursor-pointer'
        );
        setIsPointer(!!isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [hasMoved, mouseX, mouseY]);

  if (!hasMoved) return null;

  return (
    <>
      {/* Outer Round Ring Icon moving with smooth spring trail */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#C5A880]/70 pointer-events-none select-none z-[999999] box-border"
        style={{
          width: 34,
          height: 34,
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.85 : isPointer ? 1.35 : 1,
          borderColor: isPointer ? 'rgba(234, 216, 192, 0.9)' : 'rgba(197, 168, 128, 0.75)',
          backgroundColor: isPointer ? 'rgba(197, 168, 128, 0.08)' : 'rgba(197, 168, 128, 0.02)',
        }}
        transition={{ type: 'spring', damping: 22, stiffness: 320 }}
      />

      {/* Central Round Solid Dot locked precisely to mouse pointer */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#C5A880] pointer-events-none select-none z-[999999] shadow-[0_0_6px_rgba(197,168,128,0.6)]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 1.4 : isPointer ? 1.25 : 1,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
      />
    </>
  );
};
