'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs } from '@/lib/animations';
import MusicToggle from './MusicToggle';

export type MagicLevel = 0 | 1 | 2 | 3 | 4 | 5;

interface MagicMeterProps {
  magicLevel: MagicLevel;
  levelNum?: number;
  levelTitle?: string;
  currentScore?: number;
  targetScore?: number;
  scoreSuffix?: string;
  muted: boolean;
  onToggleMute: () => void;
  hintText?: string;
}

export default function MagicMeter({
  magicLevel,
  levelNum,
  levelTitle,
  currentScore,
  targetScore,
  scoreSuffix = '',
  muted,
  onToggleMute,
  hintText,
}: MagicMeterProps) {
  const fillPercent = (magicLevel / 5) * 100;
  const [showHintModal, setShowHintModal] = useState(false);

  return (
    <>
      <div
        className="absolute top-0 left-0 right-0 z-50 h-14 px-4 flex items-center justify-between border-b border-white/20"
        style={{
          background: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Left: Level Info */}
        <div className="flex flex-col items-start min-w-[75px]">
          {levelNum ? (
            <>
              <span className="font-display text-[9px] uppercase tracking-wider text-[#E58CA3] leading-none">
                Level {levelNum}
              </span>
              <span className="font-display text-xs font-semibold text-[#2C2230] leading-tight mt-0.5">
                {levelTitle}
              </span>
            </>
          ) : (
            <span className="font-display text-xs font-bold text-[#E58CA3] tracking-wide">
              🎂 June 27
            </span>
          )}
        </div>

        {/* Center: Sleek overall progress bar */}
        <div className="flex flex-col items-center gap-1 flex-1 px-2">
          <span className="text-[9px] font-bold text-[#2C2230]/40 tracking-widest uppercase">
            Birthday Magic
          </span>
          <div className="w-20 sm:w-24 h-2 rounded-full bg-white/30 overflow-hidden relative border border-white/30">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, var(--pink), var(--yellow))',
                boxShadow: '0 0 6px rgba(229,140,163,0.5)',
              }}
              animate={{ width: `${fillPercent}%` }}
              transition={springs.gentle}
            />
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 w-8"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              }}
              animate={{ x: [-32, 120] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
            />
          </div>
        </div>

        {/* Right: Score Counter + Hint Button + Music Toggle */}
        <div className="flex items-center gap-1.5 min-w-[75px] justify-end">
          {targetScore !== undefined && targetScore > 0 && (
            <motion.div
              className="glass rounded-full px-2 py-0.5 shadow-sm text-[9px] font-bold text-[#2C2230]/75 border border-white/50"
              animate={currentScore ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {currentScore}/{targetScore} {scoreSuffix}
            </motion.div>
          )}

          {hintText && (
            <motion.button
              id="hud-hint-btn"
              className="w-7 h-7 rounded-full bg-white/60 hover:bg-white/90 border border-white/60 flex items-center justify-center text-xs shadow-sm"
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowHintModal(true)}
              title="Show Level Hint"
            >
              💡
            </motion.button>
          )}

          <MusicToggle muted={muted} onToggle={onToggleMute} />
        </div>
      </div>

      {/* Hint Modal Overlay */}
      <AnimatePresence>
        {showHintModal && hintText && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHintModal(false)}
          >
            <motion.div
              className="glass-pink rounded-3xl p-5 max-w-[280px] w-full text-center border border-white/70 shadow-xl flex flex-col items-center gap-3.5"
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              transition={springs.gentle}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-3xl select-none">💡</div>
              <div className="space-y-1">
                <h3 className="font-display font-black text-base text-[#2C2230] tracking-tight">Level Hint</h3>
                <p className="font-body text-xs text-[#2C2230]/70 font-semibold leading-relaxed">
                  {hintText}
                </p>
              </div>
              <button
                id="hud-hint-modal-close"
                className="btn-primary py-2 px-6 text-xs w-full mt-1"
                onClick={() => setShowHintModal(false)}
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
