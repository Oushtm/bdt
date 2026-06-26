'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { springs, fadeUp, staggerContainer } from '@/lib/animations';
import CatWaving from '@/components/cats/CatWaving';
import TypewriterText from '@/components/ui/TypewriterText';
import { playSfx } from '@/lib/audioSynth';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [catClicks, setCatClicks] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const handleCatTap = () => {
    playSfx('meow');
    const next = catClicks + 1;
    setCatClicks(next);
    if (next === 3) setShowHint(true);
  };

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-between py-12 px-6 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 25%, #F8E4EF 0%, #FAF3F7 70%)',
      }}
    >
      {/* Floating ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left:  `${8 + i * 11}%`,
              top:   `${10 + (i % 4) * 18}%`,
              fontSize: `${14 + (i % 3) * 4}px`,
              opacity: 0.45,
            }}
            animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.35 }}
          >
            {['✨','🌸','⭐','🎀','✦','🎈'][i % 6]}
          </motion.div>
        ))}
      </div>

      {/* Date pill */}
      <motion.div
        className="glass rounded-full px-4 py-1.5 shadow-sm"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.gentle}
      >
        <span className="text-[11px] font-bold text-[#E58CA3] tracking-widest uppercase">
          🎂 June 27, 2025
        </span>
      </motion.div>

      {/* Center content */}
      <motion.div
        className="flex flex-col items-center gap-5 text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Cat — tap it! */}
        <motion.div
          variants={fadeUp}
          className="cursor-pointer select-none relative"
          onClick={handleCatTap}
          whileTap={{ scale: 0.92 }}
        >
          <CatWaving />
          {/* Tap sparkle */}
          {catClicks > 0 && catClicks < 3 && (
            <motion.div
              className="absolute -top-4 -right-4 text-xl pointer-events-none"
              initial={{ opacity: 1, scale: 0, y: 0 }}
              animate={{ opacity: 0, scale: 1.4, y: -28 }}
              transition={{ duration: 0.75 }}
            >
              ✨
            </motion.div>
          )}
          {showHint && (
            <motion.div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 glass rounded-full px-3 py-1"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="text-[10px] font-bold text-[#E58CA3] tracking-wide">She likes pets! 🐾</span>
            </motion.div>
          )}
        </motion.div>

        {/* Title */}
        <motion.div variants={fadeUp} className="space-y-1.5">
          <h1 className="font-display text-5xl font-black leading-tight tracking-tight text-shimmer">
            Happy<br/>Birthday!
          </h1>
          <p className="font-display text-lg font-semibold text-[#2C2230]/55 tracking-wide">
            <TypewriterText text="Shadow Khadija ✨" delay={0.8} />
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          className="font-body text-[#2C2230]/45 text-sm leading-relaxed max-w-[230px]"
        >
          A magical adventure crafted just for you.
          Five levels of birthday surprises await!
        </motion.p>
      </motion.div>

      {/* Start button */}
      <motion.div
        className="flex flex-col items-center gap-2.5 w-full"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.gentle, delay: 1.1 }}
      >
        <motion.button
          id="welcome-start-btn"
          className="btn-primary w-full max-w-[240px] py-4 text-sm"
          whileTap={{ scale: 0.96 }}
          onClick={onStart}
        >
          Begin the Adventure ✨
        </motion.button>
        <p className="text-[10px] text-[#2C2230]/35 font-semibold tracking-widest uppercase">
          5 levels · Tap to start
        </p>
      </motion.div>
    </div>
  );
}
