'use client';

import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateStarShadows, rand } from '@/lib/utils';

export type MagicLevel = 0 | 1 | 2 | 3 | 4 | 5;

interface WorldLayerProps {
  magicLevel: MagicLevel;
}

/* ── Paw print SVG ──────────────────────────────────────────────────────── */
function PawPrint({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.3, 0], scale: [0.5, 1, 0.5] }}
      transition={{ duration: 3, delay, repeat: Infinity, repeatDelay: rand(5, 12) }}
    >
      <svg width="24" height="24" viewBox="0 0 32 32" fill="#FF7EB6">
        <ellipse cx="10" cy="8" rx="4" ry="5" opacity="0.7" />
        <ellipse cx="22" cy="8" rx="4" ry="5" opacity="0.7" />
        <ellipse cx="5"  cy="16" rx="3.5" ry="4.5" opacity="0.7" />
        <ellipse cx="27" cy="16" rx="3.5" ry="4.5" opacity="0.7" />
        <ellipse cx="16" cy="22" rx="8" ry="9" opacity="0.7" />
      </svg>
    </motion.div>
  );
}

/* ── Floating star/sparkle/balloon ──────────────────────────────────────── */
function FloatingStar({ x, delay, size, opacity, char }: { x: number; delay: number; size: number; opacity: number; char: string }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: `${x}%`, bottom: '-10%', fontSize: size, opacity }}
      animate={{ y: '-120vh', rotate: [0, 360], opacity: [0, opacity, opacity, 0] }}
      transition={{ duration: rand(8, 14), delay, repeat: Infinity, ease: 'linear' }}
    >
      {char}
    </motion.div>
  );
}

/* ── Floating cloud ─────────────────────────────────────────────────────── */
function Cloud({ y, delay, scale }: { y: number; delay: number; scale: number }) {
  return (
    <motion.div
      style={{ position: 'absolute', top: `${y}%`, right: '-120px', scale }}
      animate={{ x: [0, -500] }}
      transition={{ duration: rand(30, 50), delay, repeat: Infinity, ease: 'linear' }}
    >
      <svg width="120" height="60" viewBox="0 0 120 60" fill="white" opacity="0.4">
        <ellipse cx="60" cy="40" rx="50" ry="22" />
        <ellipse cx="40" cy="32" rx="28" ry="22" />
        <ellipse cx="76" cy="30" rx="24" ry="20" />
      </svg>
    </motion.div>
  );
}

/* ── Mini flower ────────────────────────────────────────────────────────── */
function Flower({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 4, delay, repeat: Infinity, repeatDelay: rand(4, 10) }}
    >
      <svg width="18" height="18" viewBox="0 0 20 20">
        {[0, 60, 120, 180, 240, 300].map((a, i) => (
          <ellipse
            key={i}
            cx={10 + 6 * Math.cos((a * Math.PI) / 180)}
            cy={10 + 6 * Math.sin((a * Math.PI) / 180)}
            rx="4" ry="3"
            transform={`rotate(${a} ${10 + 6 * Math.cos((a * Math.PI) / 180)} ${10 + 6 * Math.sin((a * Math.PI) / 180)})`}
            fill="#FF7EB6" opacity="0.7"
          />
        ))}
        <circle cx="10" cy="10" r="3.5" fill="#FFD166" />
      </svg>
    </motion.div>
  );
}

/* ── Glowing orb ────────────────────────────────────────────────────────── */
function GlowOrb({ x, y, delay, color }: { x: number; y: number; delay: number; color: string }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top:  `${y}%`,
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: color,
        filter: 'blur(12px)',
        opacity: 0,
      }}
      animate={{ y: [0, -30, 0], opacity: [0, 0.5, 0] }}
      transition={{ duration: rand(4, 8), delay, repeat: Infinity }}
    />
  );
}

/* ── Main WorldLayer ────────────────────────────────────────────────────── */
const WorldLayer = memo(function WorldLayer({ magicLevel }: WorldLayerProps) {
  // Generate stable particle shadows on mount
  const stars = useMemo(() => ({
    small:  generateStarShadows(500, 1500, 'rgba(255,192,220,0.5)'),
    medium: generateStarShadows(150, 1500, 'rgba(255,209,102,0.6)'),
    large:  generateStarShadows(60,  1500, 'rgba(220,200,255,0.7)'),
  }), []);

  const paws    = useMemo(() => Array.from({ length: 8  }, (_, i) => ({ id: i, x: rand(5, 90), y: rand(5, 90), delay: i * 2.5 })), []);
  const floatingItems = useMemo(() => Array.from({ length: 10 }, (_, i) => ({ id: i, x: rand(5, 90), delay: i * 1.8, size: rand(14, 26), opacity: rand(0.2, 0.5), char: ['⭐', '✨', '🎈', '🌸', '🌟'][i % 5] })), []);
  const clouds  = useMemo(() => [{ y: 10, delay: 0, scale: 0.9 }, { y: 35, delay: 15, scale: 0.6 }], []);
  const flowers = useMemo(() => Array.from({ length: 8  }, (_, i) => ({ id: i, x: rand(5, 90), y: rand(10, 90), delay: i * 1.5 })), []);
  const orbs    = useMemo(() => [
    { x: 15,  y: 20,  delay: 0,   color: 'rgba(255,126,182,0.6)' },
    { x: 70,  y: 50,  delay: 2.5, color: 'rgba(220,200,255,0.6)' },
    { x: 40,  y: 75,  delay: 1.2, color: 'rgba(255,209,102,0.5)' },
    { x: 85,  y: 30,  delay: 3.8, color: 'rgba(126,214,167,0.5)' },
  ], []);

  // Background gradient shifts warmer as magic grows
  const bgGradient = [
    'radial-gradient(ellipse at 30% 20%, #FFE8F5 0%, #FFF8FC 60%)',
    'radial-gradient(ellipse at 40% 25%, #FFD6EE 0%, #FFF4FA 55%)',
    'radial-gradient(ellipse at 50% 30%, #FFC8E8 0%, #FFEFF8 50%)',
    'radial-gradient(ellipse at 50% 35%, #FFB8E0 0%, #FFE8F5 45%)',
    'radial-gradient(ellipse at 50% 40%, #FFA8D8 0%, #FFE0F0 40%)',
    'radial-gradient(ellipse at 50% 45%, #FF96CE 0%, #FFD8EC 35%)',
  ][magicLevel];

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0"
        animate={{ background: bgGradient }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />

      {/* Star/dust field — CSS box-shadow trick (GPU composited) */}
      <div
        className="absolute"
        style={{
          width: 1, height: 1,
          background: 'transparent',
          boxShadow: stars.small,
          animation: 'driftUp 180s linear infinite',
          opacity: magicLevel >= 1 ? 0.6 : 0.2,
          transition: 'opacity 2s',
        }}
      />
      <div
        className="absolute"
        style={{
          width: 2, height: 2,
          background: 'transparent',
          boxShadow: stars.medium,
          animation: 'driftUp 120s linear infinite',
          opacity: magicLevel >= 2 ? 0.7 : 0.1,
          transition: 'opacity 2s',
        }}
      />
      <div
        className="absolute"
        style={{
          width: 3, height: 3,
          background: 'transparent',
          boxShadow: stars.large,
          animation: 'driftUp 80s linear infinite',
          opacity: magicLevel >= 3 ? 0.8 : 0,
          transition: 'opacity 2s',
        }}
      />

      {/* Clouds — always visible */}
      {clouds.map((c, i) => <Cloud key={i} {...c} />)}

      {/* Paw prints — level 1+ */}
      <AnimatePresence>
        {magicLevel >= 1 && paws.map(p => <PawPrint key={p.id} {...p} />)}
      </AnimatePresence>

      {/* Small floating items — level 2+ */}
      <AnimatePresence>
        {magicLevel >= 2 && floatingItems.slice(0, 6).map(h => <FloatingStar key={h.id} {...h} />)}
      </AnimatePresence>

      {/* Flowers — level 3+ */}
      <AnimatePresence>
        {magicLevel >= 3 && flowers.map(f => <Flower key={f.id} {...f} />)}
      </AnimatePresence>

      {/* Glow orbs — level 4+ */}
      <AnimatePresence>
        {magicLevel >= 4 && orbs.map((o, i) => <GlowOrb key={i} {...o} />)}
      </AnimatePresence>

      {/* Large floating items — level 4+ */}
      <AnimatePresence>
        {magicLevel >= 4 && floatingItems.slice(6).map(h => (
          <FloatingStar key={`big-${h.id}`} x={h.x} delay={h.delay + 2} size={h.size + 10} opacity={0.4} char={h.char} />
        ))}
      </AnimatePresence>
    </div>
  );
});

export default WorldLayer;
