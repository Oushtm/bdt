'use client';

import { motion } from 'framer-motion';
import { rand } from '@/lib/utils';
import { useMemo } from 'react';

interface SparkleProps {
  size?: number;
  color?: string;
  x?: number | string;
  y?: number | string;
  delay?: number;
  duration?: number;
}

export default function Sparkle({
  size,
  color = '#FFD166',
  x,
  y,
  delay,
  duration,
}: SparkleProps) {
  const s  = useMemo(() => size  ?? rand(10, 24), [size]);
  const d  = useMemo(() => delay ?? rand(0, 3),   [delay]);
  const dr = useMemo(() => duration ?? rand(2, 4), [duration]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x ?? `${rand(5, 95)}%`,
        top:  y ?? `${rand(5, 95)}%`,
        width:  s,
        height: s,
        pointerEvents: 'none',
        zIndex: 10,
      }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale:   [0, 1, 1, 0],
        rotate:  [0, 90, 180],
      }}
      transition={{
        duration: dr,
        delay: d,
        repeat: Infinity,
        repeatDelay: rand(1, 4),
        ease: 'easeInOut',
      }}
    >
      <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" />
      </svg>
    </motion.div>
  );
}

/** Renders N sparkles in a container */
export function SparkleField({
  count = 8,
  colors = ['#FFD166', '#FF7EB6', '#DCC8FF'],
}: {
  count?: number;
  colors?: string[];
}) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        color: colors[i % colors.length],
      })),
    [count, colors]
  );

  return (
    <>
      {sparkles.map((s) => (
        <Sparkle key={s.id} color={s.color} />
      ))}
    </>
  );
}
