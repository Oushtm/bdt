'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { springs } from '@/lib/animations';
import TypewriterText from '@/components/ui/TypewriterText';
import CatKitten from '@/components/cats/CatKitten';
import { playSfx } from '@/lib/audioSynth';

interface FinalMessageScreenProps {
  onComplete: () => void;
}

const MESSAGE_LINES = [
  'To a truly special friend —',
  'Shadow Khadija ✨',
  'May your birthday be filled with',
  'all the joy, laughter, and success',
  'you truly deserve.',
  'You bring so much brightness to everyone around you.',
  'Wishing you a wonderful year ahead! 🎂🌟',
];

export default function FinalMessageScreen({ onComplete }: FinalMessageScreenProps) {
  const [lineIdx, setLineIdx] = useState(0);
  const [allDone, setAllDone]  = useState(false);

  useEffect(() => {
    if (lineIdx < MESSAGE_LINES.length - 1) {
      try { playSfx('sparkle'); } catch {}
      const t = setTimeout(() => setLineIdx((i) => i + 1), 2400);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setAllDone(true), 2000);
      return () => clearTimeout(t);
    }
  }, [lineIdx]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden pt-20 pb-8 px-6"
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, #F5DDE8 0%, #EDE0F5 50%, #F5EFDB 100%)',
      }}
    >
      {/* Subtle ambient sparkles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${8 + i * 8.5}%`,
            top:  `${8 + (i % 5) * 16}%`,
            fontSize: `${10 + (i % 4) * 3}px`,
            opacity: 0.35,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + (i % 4) * 0.6, repeat: Infinity, delay: i * 0.25 }}
        >
          {['✨', '🌸', '⭐', '🎀', '✦'][i % 5]}
        </motion.div>
      ))}

      {/* Header Spacer */}
      <div className="h-6" />

      {/* Main Content Area (Vertically Centered) */}
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-6 relative z-10">
        {/* Kitten */}
        <motion.div
          className="pointer-events-none"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springs.gentle }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.8, repeat: Infinity }}
          >
            <CatKitten emotion="happy" size={80} />
          </motion.div>
        </motion.div>

        {/* Letter card */}
        <div className="w-full max-w-[300px] mx-auto">
          <motion.div
            className="glass rounded-3xl px-6 py-5 w-full shadow-lg border border-white/60"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springs.gentle, delay: 0.2 }}
          >
            <div className="flex flex-col gap-2.5">
              {MESSAGE_LINES.slice(0, lineIdx + 1).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springs.gentle, delay: 0.05 }}
                  className={`font-body text-center ${
                    i === 1
                      ? 'font-display text-xl font-black text-shimmer'
                      : i === 0
                      ? 'text-[10px] font-bold text-[#2C2230]/40 tracking-widest uppercase'
                      : i === MESSAGE_LINES.length - 1
                      ? 'text-xs font-bold text-[#E58CA3]'
                      : 'text-xs text-[#2C2230]/65 font-semibold leading-relaxed'
                  }`}
                >
                  {i === lineIdx
                    ? <TypewriterText text={line} delay={0} speed={35} />
                    : line
                  }
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Area (Action controls) */}
      <div className="w-full flex flex-col items-center gap-2.5 z-20 pb-4">
        <motion.div
          className="w-full flex flex-col items-center gap-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: allDone ? 1 : 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.button
            id="final-message-continue-btn"
            className="btn-primary w-full max-w-[240px] py-4 text-sm"
            onClick={onComplete}
            whileTap={{ scale: 0.96 }}
            animate={allDone ? { y: [0, -3, 0] } : {}}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            See Your Surprise! 🎁
          </motion.button>
          <p className="text-[10px] text-[#2C2230]/35 font-semibold tracking-wider">A birthday surprise for Shadow Khadija</p>
        </motion.div>
      </div>
    </div>
  );
}
