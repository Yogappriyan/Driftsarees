import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useShop } from '../context/ShopContext';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  strength?: number;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  variant = 'primary',
  strength = 0.35,
  type = 'button',
  ariaLabel,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { setCursorMode } = useShop();

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setCursorMode('default');
  };

  const handleMouseEnter = () => {
    setCursorMode('magnetic');
  };

  // Base styling for luxury look
  let baseStyle = 'relative overflow-hidden inline-flex items-center justify-center font-sans transition-all duration-300 select-none';
  if (variant === 'primary') {
    baseStyle += ' bg-[#5A1224] text-[#F5EBE1] hover:text-white px-7 py-3 rounded-full border border-[#8C1D3B]/40 shadow-lg shadow-[#5A1224]/20';
  } else if (variant === 'secondary') {
    baseStyle += ' bg-[#1C1918] text-[#ECE5DC] hover:text-[#C5A880] px-6 py-3 rounded-full border border-[#C5A880]/30 hover:border-[#C5A880]/70';
  } else if (variant === 'outline') {
    baseStyle += ' bg-transparent text-[#ECE5DC] hover:text-white px-6 py-3 rounded-full border border-[#FAF7F2]/30 hover:border-[#C5A880]';
  } else if (variant === 'text') {
    baseStyle += ' bg-transparent text-[#ECE5DC] hover:text-[#C5A880] px-3 py-1';
  }

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.2 }}
      className={`${baseStyle} ${className} group`}
    >
      {/* Background sweep effect on hover */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#8C1D3B] via-[#A32244] to-[#C5A880] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
        {children}
      </span>
    </motion.button>
  );
};
