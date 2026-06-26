'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { springs } from '@/lib/animations';

export type KittenEmotion =
  | 'sleeping'
  | 'hungry'
  | 'noticing'
  | 'happy'
  | 'excited'
  | 'purring'
  | 'love';

interface CatKittenProps {
  emotion: KittenEmotion;
  size?: number; // width/height in px, default 176 (w-44)
}

const EMOTION_COLORS: Record<KittenEmotion, string> = {
  sleeping: '#E8D0F0',
  hungry:   '#FFD4A8',
  noticing: '#C8F0E8',
  happy:    '#FFC4DD',
  excited:  '#FFE566',
  purring:  '#DCC8FF',
  love:     '#FFB8DC',
};

const eyeVariants: Record<KittenEmotion, React.ReactNode> = {
  sleeping: (
    <>
      <path d="M74 78 Q82 72 90 78" stroke="#3D3142" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M110 78 Q118 72 126 78" stroke="#3D3142" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  ),
  hungry: (
    <>
      <circle cx="82" cy="78" r="7" fill="#3D3142" />
      <circle cx="118" cy="78" r="7" fill="#3D3142" />
      <circle cx="84" cy="75" r="2.5" fill="white" />
      <circle cx="120" cy="75" r="2.5" fill="white" />
      {/* Sad brows */}
      <path d="M72 68 Q82 74 90 70" stroke="#3D3142" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M110 70 Q118 74 128 68" stroke="#3D3142" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),
  noticing: (
    <>
      <circle cx="82"  cy="78" r="9" fill="#3D3142" />
      <circle cx="118" cy="78" r="9" fill="#3D3142" />
      <circle cx="86"  cy="74" r="3" fill="white" />
      <circle cx="122" cy="74" r="3" fill="white" />
    </>
  ),
  happy: (
    <>
      {/* Squint happy */}
      <path d="M73 78 Q82 70 90 78" stroke="#3D3142" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M110 78 Q118 70 126 78" stroke="#3D3142" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Sparkles at corners */}
      <text x="65" y="74" fontSize="8" fill="#FFD166">✦</text>
      <text x="125" y="74" fontSize="8" fill="#FFD166">✦</text>
    </>
  ),
  excited: (
    <>
      <circle cx="82"  cy="76" r="10" fill="#3D3142" />
      <circle cx="118" cy="76" r="10" fill="#3D3142" />
      <circle cx="86"  cy="71" r="4"  fill="white" />
      <circle cx="122" cy="71" r="4"  fill="white" />
      {/* Star pupils */}
      <text x="78"  y="80" fontSize="9" fill="#FFD166">★</text>
      <text x="114" y="80" fontSize="9" fill="#FFD166">★</text>
    </>
  ),
  purring: (
    <>
      {/* Blissful closed */}
      <path d="M73 80 Q82 74 90 80" stroke="#3D3142" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M110 80 Q118 74 126 80" stroke="#3D3142" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Little flowers */}
      <text x="74"  y="73" fontSize="9" fill="#FF7EB6">✿</text>
      <text x="114" y="73" fontSize="9" fill="#FF7EB6">✿</text>
    </>
  ),
  love: (
    <>
      {/* UwU eyes — star-shaped squint */}
      <path d="M68 78 Q82 66 90 78" stroke="#FF7EB6" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M110 78 Q118 66 132 78" stroke="#FF7EB6" strokeWidth="3" fill="none" strokeLinecap="round" />
      <text x="68"  y="74" fontSize="10" fill="#FF7EB6">✦</text>
      <text x="118" y="74" fontSize="10" fill="#FF7EB6">✦</text>
    </>
  ),
};

const mouthVariants: Record<KittenEmotion, React.ReactNode> = {
  sleeping: <path d="M94 96 Q100 100 106 96" stroke="#3D3142" strokeWidth="2" fill="none" strokeLinecap="round" />,
  hungry:   <path d="M90 98 Q100 93 110 98" stroke="#3D3142" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
  noticing: <circle cx="100" cy="96" r="4" fill="#3D3142" opacity="0.7" />,
  happy:    <path d="M88 96 Q100 108 112 96" stroke="#3D3142" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
  excited:  <path d="M86 94 Q100 110 114 94" stroke="#3D3142" strokeWidth="3" fill="none" strokeLinecap="round" />,
  purring:  <path d="M88 96 Q100 108 112 96" stroke="#3D3142" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
  love:     <path d="M87 94 Q100 110 113 94" stroke="#FF7EB6" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
};

export default function CatKitten({ emotion, size = 176 }: CatKittenProps) {
  const bodyColor = EMOTION_COLORS[emotion];
  const isExcited = emotion === 'excited';
  const isPurring = emotion === 'purring';
  const isLove    = emotion === 'love';

  return (
    <div className="relative mx-auto select-none" style={{ width: size, height: size }}>
      {/* Floating sparkle above head when purring */}
      <AnimatePresence>
        {isPurring && (
          <motion.div
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-xl"
            initial={{ opacity: 0, y: 10, scale: 0 }}
            animate={{ opacity: [0, 1, 1, 0], y: [-10, -30], scale: [0.5, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cat body */}
      <motion.div
        animate={
          isExcited
            ? { y: [0, -8, 0] }
            : isPurring
            ? { scale: [1, 1.03, 1] }
            : { y: [0, -2, 0] }
        }
        transition={{ duration: isExcited ? 0.5 : 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Body */}
          <ellipse cx="100" cy="155" rx="48" ry="42" fill={bodyColor} />

          {/* Head */}
          <circle cx="100" cy="88" r="40" fill={bodyColor} />

          {/* Ears */}
          <polygon points="68,54 56,22 84,48" fill={bodyColor} />
          <polygon points="132,54 144,22 116,48" fill={bodyColor} />
          <polygon points="70,52 62,32 82,48" fill="#FF9EC8" />
          <polygon points="130,52 138,32 118,48" fill="#FF9EC8" />

          {/* Eyes (variant) */}
          <AnimatePresence mode="wait">
            <motion.g
              key={emotion}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {eyeVariants[emotion]}
            </motion.g>
          </AnimatePresence>

          {/* Blush */}
          <ellipse cx="73"  cy="94" rx="9" ry="6" fill="#FF7EB6" opacity="0.3" />
          <ellipse cx="127" cy="94" rx="9" ry="6" fill="#FF7EB6" opacity="0.3" />

          {/* Nose */}
          <polygon points="100,90 96,94 104,94" fill="#FF7EB6" />

          {/* Mouth */}
          <AnimatePresence mode="wait">
            <motion.g
              key={emotion}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {mouthVariants[emotion]}
            </motion.g>
          </AnimatePresence>

          {/* Whiskers */}
          <line x1="58" y1="90" x2="80" y2="92" stroke="#3D3142" strokeWidth="1" opacity="0.4" />
          <line x1="58" y1="96" x2="80" y2="95" stroke="#3D3142" strokeWidth="1" opacity="0.4" />
          <line x1="120" y1="92" x2="142" y2="90" stroke="#3D3142" strokeWidth="1" opacity="0.4" />
          <line x1="120" y1="95" x2="142" y2="96" stroke="#3D3142" strokeWidth="1" opacity="0.4" />

          {/* Paws */}
          <ellipse cx="72"  cy="188" rx="16" ry="9" fill="#FFB3D1" opacity="0.9" />
          <ellipse cx="128" cy="188" rx="16" ry="9" fill="#FFB3D1" opacity="0.9" />
        </svg>
      </motion.div>

      {/* Tail — animated */}
      <motion.div
        className="absolute"
        animate={
          isExcited
            ? { rotate: [0, 40, -10, 40, -10, 0] }
            : isLove
            ? { rotate: [0, 15, -5, 15, 0] }
            : { rotate: [0, 20, 0, -10, 0] }
        }
        transition={{ duration: isExcited ? 0.6 : 3, repeat: Infinity }}
        style={{ transformOrigin: 'bottom left', bottom: '8%', right: '-6%' }}
      >
        <svg width="40" height="60" viewBox="0 0 40 60">
          <path d="M5 58 Q12 40 28 20 Q36 8 30 2" stroke="#FF9EC8" strokeWidth="8" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
}
