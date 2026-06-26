'use client';

import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  glow = false,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`
        relative rounded-3xl
        bg-white/20 backdrop-blur-md
        border border-white/30
        shadow-xl
        overflow-hidden
        ${glow ? 'shadow-[0_0_40px_rgba(255,126,182,0.25)]' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={onClick ? { scale: 1.01 } : undefined}
      whileTap={onClick  ? { scale: 0.99 } : undefined}
    >
      {/* Glass highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      {children}
    </motion.div>
  );
}
