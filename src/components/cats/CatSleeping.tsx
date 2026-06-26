'use client';

import { motion } from 'framer-motion';

/** Cute sleeping cat with breathing animation and Zzz bubbles */
export default function CatSleeping() {
  return (
    <div className="relative w-52 h-52 mx-auto select-none">
      {/* Zzz bubbles */}
      {['Z', 'Z', 'z'].map((z, i) => (
        <motion.span
          key={i}
          className="absolute font-bold text-[#DCC8FF]"
          style={{
            fontSize: 18 - i * 3,
            right: 28 + i * 14,
            top: 20 - i * 12,
          }}
          animate={{ y: [0, -20], opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            delay: i * 0.7,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          {z}
        </motion.span>
      ))}

      {/* Cat body — breathing */}
      <motion.div
        animate={{ scaleY: [1, 1.04, 1], scaleX: [1, 0.98, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'bottom center' }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Shadow */}
          <ellipse cx="100" cy="185" rx="55" ry="10" fill="rgba(0,0,0,0.07)" />

          {/* Body */}
          <ellipse cx="100" cy="145" rx="58" ry="50" fill="#FFC4DD" />

          {/* Head */}
          <circle cx="100" cy="88" r="42" fill="#FFC4DD" />

          {/* Ears */}
          <polygon points="68,55 55,22 85,48" fill="#FFC4DD" />
          <polygon points="132,55 145,22 115,48" fill="#FFC4DD" />
          <polygon points="70,52 61,32 82,48" fill="#FF9EC8" />
          <polygon points="130,52 139,32 118,48" fill="#FF9EC8" />

          {/* Face — sleeping */}
          {/* Closed eyes */}
          <path d="M80 88 Q88 82 96 88" stroke="#3D3142" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M104 88 Q112 82 120 88" stroke="#3D3142" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Blush */}
          <ellipse cx="76" cy="96" rx="9" ry="6" fill="#FF7EB6" opacity="0.3" />
          <ellipse cx="124" cy="96" rx="9" ry="6" fill="#FF7EB6" opacity="0.3" />

          {/* Tiny smile */}
          <path d="M94 104 Q100 110 106 104" stroke="#3D3142" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Whiskers */}
          <line x1="58" y1="98" x2="82" y2="100" stroke="#3D3142" strokeWidth="1.2" opacity="0.5" />
          <line x1="58" y1="104" x2="82" y2="103" stroke="#3D3142" strokeWidth="1.2" opacity="0.5" />
          <line x1="118" y1="100" x2="142" y2="98" stroke="#3D3142" strokeWidth="1.2" opacity="0.5" />
          <line x1="118" y1="103" x2="142" y2="104" stroke="#3D3142" strokeWidth="1.2" opacity="0.5" />

          {/* Tail */}
          <path d="M155 160 Q175 130 160 110 Q148 95 155 80" stroke="#FF9EC8" strokeWidth="10" fill="none" strokeLinecap="round" />

          {/* Paws */}
          <ellipse cx="70"  cy="185" rx="18" ry="10" fill="#FFB3D1" />
          <ellipse cx="130" cy="185" rx="18" ry="10" fill="#FFB3D1" />
        </svg>
      </motion.div>
    </div>
  );
}
