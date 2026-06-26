'use client';

import { motion } from 'framer-motion';

interface MusicToggleProps {
  muted: boolean;
  onToggle: () => void;
}

export default function MusicToggle({ muted, onToggle }: MusicToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="flex items-center justify-center w-8 h-8 rounded-full glass shadow-sm select-none border border-white/45 cursor-pointer"
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.1 }}
    >
      <span className="text-xs">{muted ? '🔇' : '🎵'}</span>
    </motion.button>
  );
}
