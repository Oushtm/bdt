'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { springs } from '@/lib/animations';
import { playSfx } from '@/lib/audioSynth';
import HuntPopup from '@/components/ui/HuntPopup';

interface Level2PawMemoryProps {
  onComplete: () => void;
  onProgress: (current: number, target: number, suffix: string) => void;
}

// 9 cards index mapping
const GRID_SIZE = 9;

// Pastel colors for the paw print emojis
const PAW_COLORS = [
  'text-[#E58CA3]',
  'text-[#EFC76E]',
  'text-[#B296E6]',
  'text-[#72C49A]',
  'text-[#F5A5B9]',
];

export default function Level2PawMemory({ onComplete, onProgress }: Level2PawMemoryProps) {
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<'intro' | 'showing' | 'playing' | 'success'>('intro');
  const [activePaws, setActivePaws] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>(Array(GRID_SIZE).fill(false));
  const [wigglingCard, setWigglingCard] = useState<number | null>(null);

  // Set up HUD progress
  useEffect(() => {
    onProgress(round, 3, '🐾');
  }, [round, onProgress]);

  // Start a new round
  const startRound = useCallback((r: number) => {
    setRound(r);
    setPhase('intro');
    setSelected([]);
    setRevealed(Array(GRID_SIZE).fill(false));

    // Choose random unique indices for paws
    const count = r === 1 ? 3 : r === 2 ? 4 : 5;
    const indices: number[] = [];
    while (indices.length < count) {
      const idx = Math.floor(Math.random() * GRID_SIZE);
      if (!indices.includes(idx)) {
        indices.push(idx);
      }
    }
    setActivePaws(indices);

    // After 1 second of intro, show the pattern
    setTimeout(() => {
      setPhase('showing');
      // Reveal the active cards
      setRevealed(prev => prev.map((_, i) => indices.includes(i)));
      try { playSfx('magic'); } catch {}

      // Hide them again after 1.8 seconds to start playing
      setTimeout(() => {
        setRevealed(Array(GRID_SIZE).fill(false));
        setPhase('playing');
      }, 1800);
    }, 1000);
  }, [onProgress]);

  // Initialize round 1
  useEffect(() => {
    startRound(1);
  }, [startRound]);

  // Handle card tap
  const handleCardTap = (idx: number) => {
    if (phase !== 'playing') return;
    if (revealed[idx] || selected.includes(idx)) return;

    const isCorrect = activePaws.includes(idx);

    if (isCorrect) {
      // Correct guess!
      try { playSfx('collect'); } catch {}
      if (navigator.vibrate) navigator.vibrate(12);

      const newSelected = [...selected, idx];
      setSelected(newSelected);
      setRevealed(prev => {
        const next = [...prev];
        next[idx] = true;
        return next;
      });

      // Check if round complete
      if (newSelected.length === activePaws.length) {
        setPhase('success');
        try { playSfx('success'); } catch {}
        if (navigator.vibrate) navigator.vibrate([20, 30, 20]);

        setTimeout(() => {
          if (round < 3) {
            startRound(round + 1);
          } else {
            onComplete();
          }
        }, 1500);
      }
    } else {
      // Incorrect guess
      try { playSfx('tap'); } catch {}
      setWigglingCard(idx);
      if (navigator.vibrate) navigator.vibrate([30, 50]);
      setTimeout(() => setWigglingCard(null), 500);
    }
  };

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #FDF0F5 0%, #F5E8F3 60%, #EAE2F8 100%)',
      }}
    >
      {/* Hunt Popup */}
      <HuntPopup
        emoji="🐾"
        title="Cat Paw Memory!"
        description="Watch which paws light up, then tap them from memory. Cards hide after 1.8s!"
        duration={3800}
      />

      {/* Centered content column */}
      <div className="flex flex-col items-center justify-center gap-5 w-full pt-16">
        {/* HUD Info subtitle */}
        <div className="text-center w-full px-6 pointer-events-none">
          <h2 className="font-display text-xl text-[#2C2230] tracking-wide mb-1">
            {phase === 'showing' ? 'Remember the Paws! 👀' : phase === 'playing' ? 'Tap the Paws! 🐾' : 'Prepare Yourself... ⚡'}
          </h2>
          <p className="text-xs text-[#2C2230]/40 font-semibold tracking-wider uppercase">
            {phase === 'showing' ? 'Watch carefully' : phase === 'playing' ? `Find the ${activePaws.length - selected.length} remaining` : 'Round starting'}
          </p>
        </div>

        {/* Grid container */}
        <div className="w-full max-w-[270px] grid grid-cols-3 gap-3 aspect-square">
        {Array.from({ length: GRID_SIZE }).map((_, idx) => {
          const isPaw = activePaws.includes(idx);
          const isFlipped = revealed[idx];
          const isWiggling = wigglingCard === idx;

          return (
            <motion.div
              key={idx}
              className={`relative cursor-pointer perspective-1000 select-none aspect-square`}
              onClick={() => handleCardTap(idx)}
              animate={isWiggling ? { x: [-6, 6, -6, 6, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
              whileTap={{ scale: 0.94 }}
            >
              <div
                className="w-full h-full duration-500 preserve-3d relative rounded-2xl shadow-sm border border-white/50"
                style={{
                  transform: isFlipped ? 'rotateY(180deg)' : 'none',
                }}
              >
                {/* Card Back (Hidden) */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl flex items-center justify-center backface-hidden"
                  style={{
                    background: 'rgba(255, 255, 255, 0.45)',
                  }}
                >
                  <span className="text-xl opacity-30 select-none">🐾</span>
                </div>

                {/* Card Front (Revealed) */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl flex items-center justify-center rotate-y-180 backface-hidden"
                  style={{
                    background: isPaw ? 'rgba(255, 255, 255, 0.9)' : 'rgba(229, 140, 163, 0.1)',
                  }}
                >
                  {isPaw ? (
                    <motion.span
                      className={`text-3xl ${PAW_COLORS[idx % PAW_COLORS.length]}`}
                      initial={{ scale: 0 }}
                      animate={isFlipped ? { scale: 1.1 } : { scale: 0 }}
                      transition={springs.bouncy}
                    >
                      🐾
                    </motion.span>
                  ) : (
                    <span className="text-2xl opacity-40">❌</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
