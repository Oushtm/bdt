import { Variants } from 'framer-motion';

// ── Spring Presets ─────────────────────────────────────────────────────────
export const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 20 },
  bouncy: { type: 'spring' as const, stiffness: 300, damping: 15 },
  snappy: { type: 'spring' as const, stiffness: 500, damping: 30 },
  floaty: { type: 'spring' as const, stiffness:  60, damping: 12 },
  snap:   { type: 'spring' as const, stiffness: 600, damping: 35 },
};

// ── Variant Presets ────────────────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0,   transition: springs.gentle },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1,   transition: springs.bouncy },
  exit:    { opacity: 0, scale: 0.9, transition: { duration: 0.15 } },
};

export const slideUp: Variants = {
  hidden:  { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0,      transition: springs.gentle },
  exit:    { opacity: 0, y: '100%', transition: { duration: 0.25 } },
};

export const slideLeft: Variants = {
  hidden:  { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0,   transition: springs.gentle },
  exit:    { opacity: 0, x: -60, transition: { duration: 0.2 } },
};

export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const staggerFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

// ── Typewriter ─────────────────────────────────────────────────────────────
export const typewriterContainer: Variants = {
  hidden:  { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.035, delayChildren: 0.3 } },
};

export const typewriterChar: Variants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
};
