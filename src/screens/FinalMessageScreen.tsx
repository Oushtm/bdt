'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { springs } from '@/lib/animations';
import TypewriterText from '@/components/ui/TypewriterText';
import CatKitten from '@/components/cats/CatKitten';
import { playSfx } from '@/lib/audioSynth';

interface FinalMessageScreenProps {
  onComplete: () => void;
}

const MESSAGE_LINES = [
  '🎉 Congratulations, Shadow Khadija! 🎉',
  'You did it! You completed all 5 magical levels. ✨',
  'I wanted to make your birthday a little more special than just sending a simple message, so I created this little adventure just for you.',
  "It's funny to think that all of this started with a random Valorant match. Out of all the people we could have queued with, we somehow ended up meeting each other — and I'm really glad we did.",
  'I hope this small game made you smile, even if it was just for a little while. Thank you for all the fun games, the laughs, and the good memories we\'ve shared.',
  'On your birthday, I wish you nothing but happiness, success, good health, and lots of amazing moments in the year ahead. May you always find reasons to smile and achieve everything you\'re working toward.',
  'But... this isn\'t the end. 👀✨',
  'You\'ve only completed Part 1 of your birthday adventure.',
  'Part 2 unlocks tomorrow, when we meet. 🎁',
  'So keep your curiosity ready... there\'s one more surprise waiting for you.',
  'Until then...',
  'Happy Birthday once again, Shadow Khadija! 🎂🎉🐱',
  'I hope today is filled with laughter, cake, and lots of happy memories. See you tomorrow for the next chapter of your birthday adventure! ✨'
];

export default function FinalMessageScreen({ onComplete }: FinalMessageScreenProps) {
  const [lineIdx, setLineIdx] = useState(0);
  const [allDone, setAllDone]  = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Dynamic reading time based on character count
  useEffect(() => {
    if (lineIdx < MESSAGE_LINES.length - 1) {
      try { playSfx('sparkle'); } catch {}
      const currentLine = MESSAGE_LINES[lineIdx];
      const delayTime = Math.max(1600, currentLine.length * 10 + 700);
      const t = setTimeout(() => setLineIdx((i) => i + 1), delayTime);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setAllDone(true), 2000);
      return () => clearTimeout(t);
    }
  }, [lineIdx]);

  // Auto-scroll to bottom of letter card when new paragraph reveals
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [lineIdx]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden pt-[clamp(4.5rem,11dvh,5.5rem)] pb-[clamp(1rem,4dvh,2rem)] px-6"
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, #F5DDE8 0%, #EDE0F5 50%, #F5EFDB 100%)',
      }}
    >
      {/* Subtle ambient sparkles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${8 + i * 8.5}%`,
            top:  `${8 + (i % 5) * 16}%`,
            fontSize: `${10 + (i % 4) * 3}px`,
            opacity: 0.35,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + (i % 4) * 0.6, repeat: Infinity, delay: i * 0.25 }}
        >
          {['✨', '🌸', '⭐', '🎀', '✦'][i % 5]}
        </motion.div>
      ))}

      {/* Header Spacer */}
      <div className="h-2" />

      {/* Main Content Area (Vertically Centered) */}
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-[clamp(8px,2dvh,16px)] relative z-10 overflow-hidden">
        {/* Kitten */}
        <motion.div
          className="pointer-events-none flex-shrink-0"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springs.gentle }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.8, repeat: Infinity }}
          >
            <CatKitten emotion="happy" size={70} />
          </motion.div>
        </motion.div>

        {/* Letter card */}
        <div className="w-full max-w-[320px] mx-auto overflow-hidden flex-shrink">
          <motion.div
            className="glass rounded-3xl px-5 py-5 w-full shadow-lg border border-white/60 flex flex-col max-h-[clamp(180px,36dvh,350px)]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springs.gentle, delay: 0.2 }}
          >
            {/* Scrollable Letter Content */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5 scrollbar-thin select-text"
              style={{ scrollBehavior: 'smooth' }}
            >
              {MESSAGE_LINES.slice(0, lineIdx + 1).map((line, i) => {
                let textClass = 'font-body text-xs text-[#2C2230]/75 leading-relaxed font-medium';
                
                if (i === 0) {
                  // Congratulations header
                  textClass = 'font-display text-sm font-black text-center text-[#E58CA3] leading-snug';
                } else if (i === 1) {
                  // You did it
                  textClass = 'font-display text-xs font-bold text-center text-[#B296E6] mb-1.5';
                } else if (i === 6) {
                  // But... this isn't the end.
                  textClass = 'font-display text-xs font-black text-center text-[#EFC76E] mt-1.5';
                } else if (i === 7 || i === 8 || i === 9) {
                  // Part 2 notes
                  textClass = 'font-body text-xs font-bold text-center text-[#2C2230]/90 leading-relaxed';
                } else if (i === 11) {
                  // Happy Birthday once again
                  textClass = 'font-display text-[13px] font-black text-center text-[#E58CA3] mt-2';
                } else if (i === 12) {
                  // final closing paragraph
                  textClass = 'font-body text-[11px] font-semibold text-center text-[#2C2230]/70 leading-relaxed mt-1';
                }

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...springs.gentle, delay: 0.05 }}
                    className={textClass}
                  >
                    {i === lineIdx ? (
                      <TypewriterText text={line} delay={0} speed={12} />
                    ) : (
                      line
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Area (Action controls) */}
      <div className="w-full flex flex-col items-center gap-2.5 z-20 pb-2 flex-shrink-0">
        <motion.div
          className="w-full flex flex-col items-center gap-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: allDone ? 1 : 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.button
            id="final-message-continue-btn"
            className="btn-primary w-full max-w-[240px] py-4 text-sm"
            onClick={onComplete}
            whileTap={{ scale: 0.96 }}
            animate={allDone ? { y: [0, -3, 0] } : {}}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            See Your Surprise! 🎁
          </motion.button>
          <p className="text-[10px] text-[#2C2230]/35 font-semibold tracking-wider">A birthday surprise for Shadow Khadija</p>
        </motion.div>
      </div>
    </div>
  );
}
