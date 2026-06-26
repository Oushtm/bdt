'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import CatSleeping from '@/components/cats/CatSleeping';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LOADING_MESSAGES = [
  'Waking up the magic...',
  'Preparing surprises...',
  'Charging birthday power...',
  'Almost ready! ✨',
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx]     = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 18 + 8;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return next;
      });
    }, 350);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const t = setInterval(() => setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-10"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #FFE8F5 0%, #FFF4FA 70%)',
      }}
    >
      {/* Floating sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none"
          style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 20}%` }}
          animate={{ y: [0, -15, 0], opacity: [0.4, 1, 0.4], rotate: [0, 20, 0] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        >
          {['✨', '🎈', '⭐', '🌸', '🎀', '✦'][i]}
        </motion.div>
      ))}

      {/* Cat */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <CatSleeping />
      </motion.div>

      {/* Title */}
      <motion.h1
        className="font-display text-3xl text-[#FF7EB6] text-center px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Something magical
        <br />
        is loading...
      </motion.h1>

      {/* Progress bar */}
      <div className="w-64 px-2">
        <div className="h-3 rounded-full bg-[#FFC4DD]/40 overflow-hidden relative">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #FF7EB6, #FFD166)',
              boxShadow: '0 0 12px rgba(255,126,182,0.7)',
            }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          />
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 w-16"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            }}
            animate={{ x: [-60, 270] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <motion.p
          key={msgIdx}
          className="text-center text-sm text-[#3D3142]/50 font-semibold mt-3"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {LOADING_MESSAGES[msgIdx]}
        </motion.p>
      </div>
    </div>
  );
}
