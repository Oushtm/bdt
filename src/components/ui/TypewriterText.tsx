'use client';

import { motion } from 'framer-motion';

interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number;   // seconds before first char appears
  speed?: number;   // ms per character (default 35ms → ~0.035s)
  onComplete?: () => void;
}

export default function TypewriterText({
  text,
  className = '',
  delay = 0,
  speed = 35,
  onComplete,
}: TypewriterTextProps) {
  const chars = text.split('');
  const staggerDelay = speed / 1000; // convert ms → seconds for framer-motion

  const containerVariants = {
    hidden:  { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren:   delay,
      },
    },
  };

  const charVariants = {
    hidden:  { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } },
  };

  return (
    <>
      {/* Screen reader text */}
      <span className="sr-only">{text}</span>

      {/* Animated text (aria-hidden) */}
      <motion.span
        aria-hidden="true"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={onComplete}
        className={`inline ${className}`}
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {chars.map((char, i) => (
          <motion.span
            key={i}
            variants={charVariants}
            style={{ display: 'inline-block' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    </>
  );
}
