'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { springs } from '@/lib/animations';

interface HuntPopupProps {
  emoji: string;
  title: string;
  description: string;
  /** How long the popup stays visible (ms). Default 3000 */
  duration?: number;
}

/**
 * HuntPopup — A brief animated tutorial popup shown at the start of each level.
 * Auto-dismisses after `duration` ms. Can also be dismissed by tapping it.
 */
export default function HuntPopup({ emoji, title, description, duration = 3200 }: HuntPopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-x-0 top-20 z-40 flex justify-center px-5 pointer-events-auto"
          initial={{ opacity: 0, y: -24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.92 }}
          transition={{ ...springs.bouncy }}
          onClick={() => setVisible(false)}
        >
          <div
            className="glass rounded-2xl px-5 py-3.5 flex gap-3 items-start max-w-[300px] shadow-lg border border-white/70 cursor-pointer"
          >
            {/* Emoji icon */}
            <motion.div
              className="text-2xl flex-shrink-0 mt-0.5"
              animate={{ rotate: [0, -8, 8, -5, 5, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
            >
              {emoji}
            </motion.div>

            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="font-display text-xs font-black text-[#2C2230] leading-tight tracking-wide">
                {title}
              </p>
              <p className="font-body text-[11px] text-[#2C2230]/60 font-medium leading-snug">
                {description}
              </p>
            </div>

            {/* Tap to dismiss hint */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-4 h-4 rounded-full bg-[#2C2230]/10 flex items-center justify-center">
                <span className="text-[9px] text-[#2C2230]/40 font-bold">✕</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
