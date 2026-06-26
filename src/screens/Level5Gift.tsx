'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { springs } from '@/lib/animations';
import ConfettiCannon from '@/components/ui/ConfettiCannon';
import { playSfx } from '@/lib/audioSynth';
import HuntPopup from '@/components/ui/HuntPopup';

interface Level5GiftProps {
  onComplete: () => void;
  onProgress: (current: number, target: number, suffix: string) => void;
}

const RIBBONS = ['#FF7EB6', '#FFD166', '#C8A8FF'];

// Layers of the gift to unwrap
const LAYERS = [
  { label: 'Shake it!',   action: 'shake',  emoji: '🎁',  hint: 'Give it a little shake...' },
  { label: 'Untie!',      action: 'ribbon', emoji: '🎀',  hint: 'Tap the ribbon to untie it' },
  { label: 'Open it!',    action: 'lid',    emoji: '📦',  hint: 'Tap the box to open it!' },
];

export default function Level5Gift({ onComplete, onProgress }: Level5GiftProps) {
  const [phase, setPhase]           = useState(0); // 0 = shake, 1 = ribbon, 2 = lid, 3 = opened
  const [shakeCount, setShakeCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [ribbonBroken, setRibbonBroken] = useState(false);

  useEffect(() => {
    const step = Math.min(phase + 1, 3);
    onProgress(step, 3, '🎁');
  }, [phase, onProgress]);

  const handleGiftTap = () => {
    if (phase === 0) {
      const next = shakeCount + 1;
      setShakeCount(next);
      try { playSfx('tap'); } catch {}
      if (navigator.vibrate) navigator.vibrate(10);
      if (next >= 5) {
        setTimeout(() => setPhase(1), 300);
      }
    } else if (phase === 1) {
      setRibbonBroken(true);
      try { playSfx('sparkle'); } catch {}
      setTimeout(() => setPhase(2), 800);
    } else if (phase === 2) {
      setShowConfetti(true);
      setPhase(3);
      try { playSfx('gift_open'); } catch {}
      if (navigator.vibrate) navigator.vibrate([30, 20, 50]);
      setTimeout(onComplete, 3000);
    }
  };

  const currentLayer = LAYERS[Math.min(phase, LAYERS.length - 1)];

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden px-6 pt-20 pb-8"
      style={{ background: 'linear-gradient(160deg, #FFE8F5 0%, #FFF4D6 55%, #E8F5FF 100%)' }}
    >
      <ConfettiCannon trigger={showConfetti} />

      {/* Hunt Popup */}
      <HuntPopup
        emoji="🎁"
        title="Unwrap your gift!"
        description="Shake it 5×, untie the ribbon, then open the box to reveal your surprise!"
        duration={4200}
      />

      {/* Header Area (HUD Info) */}
      <div className="w-full flex flex-col items-center justify-end h-20 text-center pointer-events-none z-20">
        <h2 className="font-display text-base text-[#2C2230]/70 tracking-wide mb-1 animate-pulse-glow">
          {phase < 3 ? currentLayer.hint : 'Gift Unwrapped! 🎁'}
        </h2>
        {phase === 0 && (
          <div className="flex justify-center gap-1.5 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: i < shakeCount ? 'var(--pink)' : 'rgba(229,140,163,0.2)',
                  boxShadow: i < shakeCount ? '0 0 6px rgba(229,140,163,0.6)' : 'none',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area (Vertically Centered) */}
      <div className="flex-1 w-full flex items-center justify-center relative">
        <motion.div
          className="relative flex flex-col items-center cursor-pointer select-none"
          onClick={handleGiftTap}
          whileTap={{ scale: 0.94 }}
          animate={
            phase === 0 && shakeCount > 0
              ? { x: [0, -12, 12, -8, 8, 0], rotate: [0, -4, 4, -2, 2, 0] }
              : phase === 3
              ? { y: [0, -8, 0], scale: [1, 1.05, 1] }
              : {}
          }
          transition={phase === 3 ? { duration: 2, repeat: Infinity } : { duration: 0.4 }}
        >
          {/* Lid — animates open on phase 3 */}
          <motion.div
            style={{ position: 'relative', zIndex: 2 }}
            animate={phase >= 3 ? { y: -80, rotate: -25, opacity: 0 } : {}}
            transition={springs.bouncy}
          >
            {/* Lid SVG */}
            <svg width="180" height="60" viewBox="0 0 180 60">
              <rect x="0" y="20" width="180" height="40" rx="8" fill="#E58CA3" />
              <rect x="0" y="20" width="180" height="40" rx="8" fill="url(#lidGrad)" />
              <rect x="60" y="0" width="60" height="30" rx="8" fill="#FF4499" />
              {/* Ribbon bow knot */}
              <circle cx="90" cy="15" r="10" fill="#EFC76E" />
              <defs>
                <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.2)"/>
                  <stop offset="100%" stopColor="transparent"/>
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Box body */}
          <svg width="180" height="160" viewBox="0 0 180 160" style={{ marginTop: -4 }}>
            {/* Box */}
            <rect x="5" y="5" width="170" height="150" rx="12" fill="#E58CA3"/>
            <rect x="5" y="5" width="170" height="150" rx="12" fill="url(#boxGrad)"/>
            {/* Ribbons */}
            <rect x="80" y="5" width="20" height="150" fill="#FF4499" opacity="0.6"/>
            {!ribbonBroken && (
              <>
                <line x1="5" y1="80" x2="175" y2="80" stroke="#EFC76E" strokeWidth="10" strokeLinecap="round"/>
              </>
            )}
            {/* Polka dots */}
            {[30,60,90,120,150].map((cx) =>
              [40, 100, 140].map((cy) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" fill="rgba(255,255,255,0.15)" />
              ))
            )}
            {/* Shine */}
            <ellipse cx="50" cy="40" rx="20" ry="15" fill="rgba(255,255,255,0.15)"/>
            <defs>
              <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)"/>
                <stop offset="100%" stopColor="transparent"/>
              </linearGradient>
            </defs>
          </svg>

          {/* Phase 3: reveal inside */}
          <AnimatePresence>
            {phase >= 3 && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...springs.bouncy, delay: 0.3 }}
              >
                <div className="text-7xl">🎂</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom Area (Phase indicator) */}
      <div className="w-full flex justify-center z-20">
        <div className="flex gap-4 items-center">
          {LAYERS.map((layer, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-1"
              animate={{ opacity: i <= phase ? 1 : 0.3 }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm"
                style={{
                  background: i < phase
                    ? 'rgba(126,214,167,0.4)'
                    : i === phase
                    ? 'rgba(229,140,163,0.3)'
                    : 'rgba(255,255,255,0.3)',
                  border: `2px solid ${i <= phase ? '#E58CA3' : 'rgba(229,140,163,0.2)'}`,
                }}
              >
                {i < phase ? '✅' : layer.emoji}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
