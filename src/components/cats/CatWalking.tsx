'use client';

import { motion } from 'framer-motion';

/** Cat walking across the screen — used in ending */
interface CatWalkingProps {
  startX?: number;
  delay?: number;
  scale?: number;
  color?: string;
  onTap?: () => void;
}

export default function CatWalking({
  startX = -60,
  delay = 0,
  scale = 1,
  color = '#FFC4DD',
  onTap,
}: CatWalkingProps) {
  return (
    <motion.div
      style={{ scale, cursor: onTap ? 'pointer' : 'default' }}
      initial={{ x: startX }}
      animate={{ x: '115vw' }}
      transition={{ duration: 12, delay, ease: 'linear', repeat: Infinity, repeatDelay: 2 }}
      onClick={onTap}
      whileTap={onTap ? { scale: 1.2, y: -20 } : undefined}
    >
      {/* Walking cat body — simple frame */}
      <svg width="60" height="52" viewBox="0 0 60 52">
        {/* Body */}
        <ellipse cx="30" cy="35" rx="20" ry="14" fill={color} />
        {/* Head */}
        <circle cx="48" cy="22" r="14" fill={color} />
        {/* Ears */}
        <polygon points="42,10 37,2 47,10" fill={color} />
        <polygon points="55,10 60,2 50,10" fill={color} />
        <polygon points="43,10 39,4 46,10" fill="#FF9EC8" />
        <polygon points="54,10 58,4 51,10" fill="#FF9EC8" />
        {/* Eyes */}
        <circle cx="44" cy="20" r="3" fill="#3D3142" />
        <circle cx="53" cy="20" r="3" fill="#3D3142" />
        <circle cx="45" cy="19" r="1.2" fill="white" />
        <circle cx="54" cy="19" r="1.2" fill="white" />
        {/* Nose */}
        <polygon points="48,25 46,27 50,27" fill="#FF7EB6" />
        {/* Tail */}
        <path d="M10 32 Q2 22 6 14" stroke="#FF9EC8" strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* Legs walking */}
        <motion.g
          animate={{ rotate: [0, 20, 0, -20, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ transformOrigin: '22px 42px' }}
        >
          <line x1="22" y1="42" x2="16" y2="52" stroke="#FFB3D1" strokeWidth="4" strokeLinecap="round" />
          <line x1="36" y1="42" x2="42" y2="52" stroke="#FFB3D1" strokeWidth="4" strokeLinecap="round" />
        </motion.g>
        <motion.g
          animate={{ rotate: [0, -20, 0, 20, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ transformOrigin: '30px 45px' }}
        >
          <line x1="26" y1="45" x2="20" y2="52" stroke="#FFB3D1" strokeWidth="4" strokeLinecap="round" />
          <line x1="34" y1="45" x2="40" y2="52" stroke="#FFB3D1" strokeWidth="4" strokeLinecap="round" />
        </motion.g>
      </svg>
    </motion.div>
  );
}
