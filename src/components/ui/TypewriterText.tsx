'use client';

import { motion } from 'framer-motion';
import { typewriterContainer, typewriterChar } from '@/lib/animations';

interface TypewriterTextProps {
  text: string;
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'span' | 'div';
  onComplete?: () => void;
}

export default function TypewriterText({
  text,
  className = '',
  as: Tag = 'p',
  onComplete,
}: TypewriterTextProps) {
  const chars = text.split('');

  return (
    <>
      {/* Screen reader text */}
      <span className="sr-only">{text}</span>

      {/* Animated text (aria-hidden) */}
      <motion.span
        aria-hidden="true"
        variants={typewriterContainer}
        initial="hidden"
        animate="visible"
        onAnimationComplete={onComplete}
        className={`inline ${className}`}
        style={{ whiteSpace: 'pre-wrap' }}
        // @ts-expect-error -- motion wraps string tags
        as={Tag}
      >
        {chars.map((char, i) => (
          <motion.span
            key={i}
            variants={typewriterChar}
            style={{ display: 'inline-block' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    </>
  );
}
