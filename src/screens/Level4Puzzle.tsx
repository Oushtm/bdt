'use client';

import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useState, useEffect } from 'react';
import { springs } from '@/lib/animations';
import { playSfx } from '@/lib/audioSynth';

interface Level4PuzzleProps {
  onComplete: () => void;
  onProgress: (current: number, target: number, suffix: string) => void;
}

// Birthday message puzzle — user drags tiles into correct order
const CORRECT_ORDER = ['Happy', 'Birthday', 'Shadow', 'Khadija', '🎂', '✨'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TILE_COLORS: Record<string, string> = {
  'Happy':    '#FF7EB6',
  'Birthday': '#FFD166',
  'Shadow':   '#C8A8FF',
  'Khadija':  '#7ED6A7',
  '🎂':       '#FF9AA2',
  '✨':        '#FFDAC1',
};

export default function Level4Puzzle({ onComplete, onProgress }: Level4PuzzleProps) {
  const [items, setItems] = useState<string[]>(() => shuffle(CORRECT_ORDER));
  const [solved, setSolved] = useState(false);

  const correctCount = items.filter((item, i) => item === CORRECT_ORDER[i]).length;

  useEffect(() => {
    onProgress(correctCount, CORRECT_ORDER.length, '🧩');
  }, [correctCount, onProgress]);

  const checkSolution = (currentItems: string[]) => {
    const correct = currentItems.every((item, i) => item === CORRECT_ORDER[i]);
    if (correct && !solved) {
      setSolved(true);
      try { playSfx('success'); } catch {}
      setTimeout(onComplete, 1500);
    } else {
      // Check if at least one new item is in correct position
      const anyCorrect = currentItems.some((item, i) => item === CORRECT_ORDER[i]);
      if (anyCorrect) { try { playSfx('collect'); } catch {} }
    }
  };

  const handleReorder = (newOrder: string[]) => {
    setItems(newOrder);
    checkSolution(newOrder);
  };

  return (
    <div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FFE8F5 0%, #E8D5FF 60%, #FFF4FA 100%)' }}
    >
      {/* Target pattern */}
      <div className="flex flex-col items-center px-6 pt-20 pb-4 mb-4">
        <p className="text-[10px] font-bold text-[#3D3142]/40 tracking-widest uppercase mb-2">
          Target Order:
        </p>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {CORRECT_ORDER.map((word, i) => (
            <div
              key={i}
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: `${TILE_COLORS[word]}22`,
                border: `1px solid ${TILE_COLORS[word]}66`,
                color: TILE_COLORS[word],
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>

      {/* Draggable tiles */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={handleReorder}
          className="flex flex-col gap-3 w-full max-w-xs"
        >
          {items.map((item, index) => {
            const isCorrect = item === CORRECT_ORDER[index];
            return (
              <Reorder.Item
                key={item}
                value={item}
                className="select-none cursor-grab active:cursor-grabbing"
                whileDrag={{ scale: 1.05, zIndex: 50 }}
              >
                <motion.div
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl shadow-md"
                  style={{
                    background: isCorrect && solved
                      ? 'rgba(126, 214, 167, 0.3)'
                      : 'rgba(255,255,255,0.7)',
                    border: `2px solid ${isCorrect ? TILE_COLORS[item] : 'rgba(255,255,255,0.8)'}`,
                    backdropFilter: 'blur(12px)',
                  }}
                  animate={isCorrect && solved ? { scale: [1, 1.04, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {/* Drag handle */}
                  <span className="text-[#3D3142]/30 text-lg font-black">⣿</span>

                  {/* Word */}
                  <span
                    className="font-display text-2xl flex-1"
                    style={{ color: TILE_COLORS[item] }}
                  >
                    {item}
                  </span>

                  {/* Position number */}
                  <span className="text-xs font-bold text-[#3D3142]/30">
                    #{index + 1}
                  </span>

                  {/* Check mark if correct */}
                  <AnimatePresence>
                    {isCorrect && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={springs.bouncy}
                        className="text-xl"
                      >
                        ✅
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>

      {/* Solved overlay */}
      <AnimatePresence>
        {solved && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(255,209,102,0.4) 0%, transparent 70%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-8xl"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={springs.bouncy}
            >
              🎊
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
