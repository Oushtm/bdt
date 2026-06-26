'use client';

import { motion } from 'framer-motion';
import { springs } from '@/lib/animations';
import ConfettiCannon from '@/components/ui/ConfettiCannon';

interface LevelSuccessScreenProps {
  message: string;
  emoji: string;
  onContinue: () => void;
}

const CHEERS = ['Amazing! ✨', 'You did it! 🌟', 'Perfect! ✨', 'Wonderful! 🎉'];

export default function LevelSuccessScreen({
  message,
  emoji,
  onContinue,
}: LevelSuccessScreenProps) {
  const cheer = CHEERS[Math.floor(Math.random() * CHEERS.length)];

  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center px-8 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, rgba(245, 218, 228, 0.97) 0%, rgba(250, 243, 247, 0.98) 65%)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <ConfettiCannon trigger={true} />

      {/* Big emoji burst */}
      <motion.div
        className="text-[80px] select-none leading-none"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ ...springs.bouncy, delay: 0.1 }}
      >
        {emoji}
      </motion.div>

      {/* Cheer text */}
      <div className="text-center space-y-2">
        <motion.h2
          className="font-display text-3xl font-black text-[#E58CA3] tracking-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.3 }}
        >
          {cheer}
        </motion.h2>
        <motion.p
          className="font-body text-[#2C2230]/55 text-sm leading-relaxed font-semibold max-w-[220px] mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.45 }}
        >
          {message}
        </motion.p>
      </div>

      {/* Star row */}
      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...springs.bouncy, delay: 0.55 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="text-3xl"
            animate={{ rotate: [0, 18, -18, 0], y: [0, -7, 0] }}
            transition={{ duration: 1.6, delay: 0.65 + i * 0.15, repeat: Infinity, repeatDelay: 2.5 }}
          >
            ⭐
          </motion.span>
        ))}
      </motion.div>

      {/* Continue button */}
      <motion.button
        id="success-continue-btn"
        className="btn-primary px-10 py-3.5 text-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.gentle, delay: 0.7 }}
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
      >
        Keep Going →
      </motion.button>
    </motion.div>
  );
}
