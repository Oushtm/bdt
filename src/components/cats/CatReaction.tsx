'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { springs } from '@/lib/animations';

type Reaction = 'surprised' | 'happy' | 'love' | 'thinking' | 'excited';

interface CatReactionProps {
  reaction: Reaction;
  text: string;
  show: boolean;
}

const REACTION_EMOJI: Record<Reaction, string> = {
  surprised: '😻',
  happy:     '😸',
  love:      '😸',
  thinking:  '🤔',
  excited:   '🤩',
};

/**
 * A speech-bubble style cat reaction overlay that pops in and out.
 */
export default function CatReaction({ reaction, text, show }: CatReactionProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-pink shadow-lg"
          initial={{ opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -5 }}
          transition={springs.bouncy}
          style={{ zIndex: 60 }}
        >
          <span className="text-2xl">{REACTION_EMOJI[reaction]}</span>
          <span className="text-sm font-bold text-[#3D3142]/80 font-body">{text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
