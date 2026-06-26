'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { springs } from '@/lib/animations';
import CatKitten from '@/components/cats/CatKitten';
import type { KittenEmotion } from '@/components/cats/CatKitten';
import { playSfx } from '@/lib/audioSynth';
import HuntPopup from '@/components/ui/HuntPopup';

interface Level3CatRescueProps {
  onComplete: () => void;
  onProgress: (current: number, target: number, suffix: string) => void;
}

interface CatData {
  id: number;
  name: string;
  x: number;
  y: number;
  color: string;
  rescued: boolean;
  message: string;
}

const CATS: CatData[] = [
  { id: 0, name: 'Mochi',   x: 15, y: 28, color: '#FFD166', rescued: false, message: 'Thank mew! 🐾' },
  { id: 1, name: 'Luna',    x: 65, y: 22, color: '#C8A8FF', rescued: false, message: 'Purr purr ✨' },
  { id: 2, name: 'Coco',    x: 30, y: 58, color: '#FF9AA2', rescued: false, message: 'You\'re the best! ⭐' },
  { id: 3, name: 'Pudding', x: 72, y: 62, color: '#7ED6A7', rescued: false, message: 'Meow meow! 🌟' },
  { id: 4, name: 'Biscuit', x: 50, y: 40, color: '#FFDAC1', rescued: false, message: 'Paw-some! ✨' },
];

interface TinyCatProps {
  cat: CatData;
  onRescue: (id: number) => void;
}

function TinyCat({ cat, onRescue }: TinyCatProps) {
  const [tapped, setTapped] = useState(false);

  const handleTap = () => {
    if (cat.rescued || tapped) return;
    setTapped(true);
    setTimeout(() => onRescue(cat.id), 600);
  };

  return (
    <AnimatePresence>
      {!cat.rescued && (
        <motion.div
          className="absolute flex flex-col items-center gap-1 cursor-pointer select-none"
          style={{ left: `${cat.x}%`, top: `${cat.y}%`, transform: 'translate(-50%,-50%)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 3, opacity: 0, y: -40 }}
          transition={tapped ? springs.bouncy : { ...springs.bouncy, delay: cat.id * 0.2 }}
          onClick={handleTap}
          whileTap={{ scale: 0.85 }}
        >
          {/* Cat body — tiny SVG */}
          <div style={{ width: 56, height: 56, position: 'relative' }}>
            <svg viewBox="0 0 60 65" width="56" height="56">
              {/* Ears */}
              <polygon points="10,20 2,2 22,14"  fill={cat.color} />
              <polygon points="50,20 58,2 38,14" fill={cat.color} />
              {/* Head */}
              <ellipse cx="30" cy="30" rx="24" ry="22" fill={cat.color} />
              {/* Eyes */}
              <ellipse cx="20" cy="27" rx={tapped ? 6 : 4} ry={tapped ? 2 : 5} fill="#3D3142" />
              <ellipse cx="40" cy="27" rx={tapped ? 6 : 4} ry={tapped ? 2 : 5} fill="#3D3142" />
              {/* Nose */}
              <ellipse cx="30" cy="34" rx="3" ry="2.5" fill="#FF7EB6" />
              {/* Mouth */}
              <path d="M26 37 Q30 41 34 37" stroke="#3D3142" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              {/* Body */}
              <ellipse cx="30" cy="56" rx="16" ry="12" fill={cat.color} />
              {/* Tail */}
              <path d="M46 58 Q58 50 54 40" stroke={cat.color} strokeWidth="6" fill="none" strokeLinecap="round"/>
              {/* Shine */}
              <ellipse cx="23" cy="22" rx="5" ry="4" fill="rgba(255,255,255,0.3)" />
            </svg>

            {/* Exclamation bubble */}
            {!tapped && (
              <motion.div
                className="absolute -top-4 -right-4 text-xl"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ❗
              </motion.div>
            )}
          </div>

          {/* Name tag */}
          <div className="glass rounded-full px-2 py-0.5">
            <span className="text-xs font-bold text-[#3D3142]/70">{cat.name}</span>
          </div>

          {/* Message on rescue */}
          {tapped && (
            <motion.div
              className="absolute -top-10 left-1/2 -translate-x-1/2 glass-pink rounded-2xl px-3 py-1 whitespace-nowrap"
              initial={{ opacity: 0, scale: 0.8, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: -8 }}
              exit={{ opacity: 0 }}
            >
              <span className="text-xs font-bold text-[#FF7EB6]">{cat.message}</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Level3CatRescue({ onComplete, onProgress }: Level3CatRescueProps) {
  const [cats, setCats]       = useState<CatData[]>(CATS);
  const [rescued, setRescued] = useState(0);
  const [emotion, setEmotion] = useState<KittenEmotion>('noticing');

  useEffect(() => {
    onProgress(rescued, CATS.length, '🐱');
  }, [rescued, onProgress]);

  const handleRescue = (id: number) => {
    setCats((prev) => prev.map((c) => c.id === id ? { ...c, rescued: true } : c));
    try { playSfx('meow'); } catch {}
    setRescued((r) => {
      const next = r + 1;
      if (next >= CATS.length) {
        setEmotion('excited');
        try { playSfx('success'); } catch {}
        setTimeout(onComplete, 1200);
      } else if (next >= 3) {
        setEmotion('happy');
        try { playSfx('collect'); } catch {}
      } else {
        setEmotion('purring');
        try { playSfx('sparkle'); } catch {}
        setTimeout(() => setEmotion('noticing'), 1500);
      }
      return next;
    });
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #E8D5FF 0%, #FFC8E8 55%, #FFE8F5 100%)' }}
    >
      {/* Hunt Popup */}
      <HuntPopup
        emoji="🐱"
        title="Rescue the kittens!"
        description="5 kittens are hiding around the screen. Tap each one to rescue them! 🐾"
        duration={3500}
      />

      {/* Main kitten guide — top right */}
      <motion.div
        className="absolute right-4 top-20 z-20 pointer-events-none"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <CatKitten emotion={emotion} size={70} />
      </motion.div>

      {/* Lost cats scattered around */}
      <div className="absolute inset-0">
        {cats.map((cat) => (
          <TinyCat key={cat.id} cat={cat} onRescue={handleRescue} />
        ))}
      </div>

      {/* Rescued celebration */}
      <AnimatePresence>
        {rescued > 0 && (
          <motion.div
            className="absolute bottom-12 left-0 right-0 flex justify-center pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass rounded-full px-6 py-3 flex gap-2 items-center">
              {Array.from({ length: rescued }).map((_, i) => (
                <motion.span
                  key={i}
                  className="text-2xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={springs.bouncy}
                >
                  🐾
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background paw prints */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute opacity-10"
          style={{ left: `${8 + i * 14}%`, bottom: `${10 + (i % 3) * 15}%` }}
        >
          <svg width="24" height="24" viewBox="0 0 32 32" fill="#C8A8FF">
            <ellipse cx="10" cy="8"  rx="4" ry="5" />
            <ellipse cx="22" cy="8"  rx="4" ry="5" />
            <ellipse cx="5"  cy="16" rx="3.5" ry="4.5" />
            <ellipse cx="27" cy="16" rx="3.5" ry="4.5" />
            <ellipse cx="16" cy="22" rx="8" ry="9" />
          </svg>
        </div>
      ))}
    </div>
  );
}
