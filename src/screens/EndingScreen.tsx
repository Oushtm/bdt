'use client';

import { motion } from 'framer-motion';
import { springs } from '@/lib/animations';
import CatWalking from '@/components/cats/CatWalking';
import ConfettiCannon from '@/components/ui/ConfettiCannon';
import { playSfx } from '@/lib/audioSynth';
import { useEffect } from 'react';

interface EndingScreenProps {
  onRestart: () => void;
}

const CATS_DATA = [
  { id: 0, startX: -200, delay: 0,   scale: 1,    color: '#E58CA3' },
  { id: 1, startX: -280, delay: 1.5, scale: 0.75, color: '#EFC76E' },
  { id: 2, startX: -360, delay: 3,   scale: 0.85, color: '#B296E6' },
];

export default function EndingScreen({ onRestart }: EndingScreenProps) {
  useEffect(() => {
    try { playSfx('success'); } catch {}
  }, []);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden pt-[clamp(4.5rem,11dvh,5.5rem)] pb-[clamp(1rem,4dvh,2rem)] px-6"
      style={{
        background: 'radial-gradient(ellipse at 50% 15%, #F5DDE8 0%, #EDE0F5 45%, #F5EFDB 100%)',
      }}
    >
      <ConfettiCannon trigger={true} loop />

      {/* Star field */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${Math.random() * 92}%`,
            top:  `${5 + Math.random() * 45}%`,
            fontSize: `${14 + (i % 3) * 4}px`,
            opacity: 0.45,
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.8 + Math.random() * 1.8, repeat: Infinity, delay: Math.random() * 2 }}
        >
          {['⭐', '✨', '🌟', '💫'][i % 4]}
        </motion.div>
      ))}

      {/* Header Spacer (empty or for top bar margin) */}
      <div className="h-2" />

      {/* Main Content Area (Vertically Centered) */}
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-[clamp(8px,2.5dvh,20px)] relative z-10">
        {/* Main title area */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <motion.div
            className="text-[clamp(3.5rem,9dvh,4.5rem)] leading-none select-none"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ ...springs.bouncy, delay: 0.2 }}
          >
            🎂
          </motion.div>

          <div className="text-center space-y-0.5">
            <motion.h1
              className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[#2C2230] leading-tight"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.gentle, delay: 0.5 }}
            >
              Happy Birthday
            </motion.h1>
            <motion.p
              className="font-display text-lg sm:text-xl font-bold text-[#E58CA3]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.gentle, delay: 0.75 }}
            >
              Shadow Khadija!
            </motion.p>
          </div>

          <motion.div
            className="flex gap-2 mt-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            {['🌟', '🎈', '🎉', '✨', '🌸'].map((em, i) => (
              <motion.span
                key={i}
                className="text-base"
                animate={{ y: [0, -6, 0], rotate: [0, 8, -8, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.2 }}
              >
                {em}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Celebration card */}
        <motion.div
          className="glass rounded-3xl px-5 py-[clamp(10px,2.5dvh,16px)] mx-1 text-center shadow-lg border border-white/60 max-w-[310px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springs.gentle, delay: 1.4 }}
        >
          <p className="font-body text-[#2C2230]/65 text-xs leading-relaxed font-semibold">
            You completed all 5 magical levels! 🎊
            <br /><br />
            Wishing you a year filled with laughter, success, and endless joy. You deserve all the happiness in the world! ✨
          </p>
          <div className="flex justify-center gap-1.5 mt-2">
            {['🎀', '🎁', '🎈', '🎊', '🎉'].map((em, i) => (
              <motion.span
                key={i}
                className="text-sm sm:text-base"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.28 }}
              >
                {em}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Walking cats parade */}
        <div className="relative h-12 w-full overflow-hidden">
          {CATS_DATA.map((cat) => (
            <CatWalking
              key={cat.id}
              startX={cat.startX}
              delay={cat.delay}
              scale={cat.scale * 0.65}
              color={cat.color}
            />
          ))}
        </div>
      </div>

      {/* Bottom Area (Restart actions) */}
      <div className="w-full flex justify-center pb-4 z-20">
        <motion.button
          id="ending-restart-btn"
          className="btn-primary px-10 py-3.5 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
        >
          Play Again 🔄
        </motion.button>
      </div>
    </div>
  );
}
