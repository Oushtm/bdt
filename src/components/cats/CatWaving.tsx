'use client';

import { motion } from 'framer-motion';

/** Cute cat waving hello */
export default function CatWaving() {
  return (
    <div className="relative w-52 h-52 mx-auto select-none">
      <svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg">
        {/* Shadow */}
        <ellipse cx="100" cy="200" rx="55" ry="9" fill="rgba(0,0,0,0.06)" />

        {/* Body */}
        <ellipse cx="100" cy="152" rx="55" ry="52" fill="#FFC4DD" />

        {/* Head */}
        <circle cx="100" cy="88" r="44" fill="#FFC4DD" />

        {/* Ears */}
        <polygon points="66,52 52,18 84,46" fill="#FFC4DD" />
        <polygon points="134,52 148,18 116,46" fill="#FFC4DD" />
        <polygon points="68,50 59,28 82,46" fill="#FF9EC8" />
        <polygon points="132,50 141,28 118,46" fill="#FF9EC8" />

        {/* Eyes — happy open */}
        <circle cx="84"  cy="86" r="8" fill="#3D3142" />
        <circle cx="116" cy="86" r="8" fill="#3D3142" />
        <circle cx="87"  cy="83" r="3" fill="white" />
        <circle cx="119" cy="83" r="3" fill="white" />

        {/* Blush */}
        <ellipse cx="74"  cy="98" rx="10" ry="7" fill="#FF7EB6" opacity="0.35" />
        <ellipse cx="126" cy="98" rx="10" ry="7" fill="#FF7EB6" opacity="0.35" />

        {/* Smile */}
        <path d="M88 106 Q100 118 112 106" stroke="#3D3142" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Nose */}
        <polygon points="100,100 96,104 104,104" fill="#FF7EB6" />

        {/* Whiskers */}
        <line x1="55" y1="96"  x2="80"  y2="99"  stroke="#3D3142" strokeWidth="1.2" opacity="0.45" />
        <line x1="55" y1="103" x2="80"  y2="102" stroke="#3D3142" strokeWidth="1.2" opacity="0.45" />
        <line x1="120" y1="99" x2="145" y2="96"  stroke="#3D3142" strokeWidth="1.2" opacity="0.45" />
        <line x1="120" y1="102" x2="145" y2="103" stroke="#3D3142" strokeWidth="1.2" opacity="0.45" />

        {/* Left arm (static) */}
        <path d="M55 150 Q42 165 50 180" stroke="#FFB3D1" strokeWidth="12" fill="none" strokeLinecap="round" />

        {/* Paws */}
        <ellipse cx="52"  cy="183" rx="14" ry="9" fill="#FFB3D1" />
        <ellipse cx="148" cy="183" rx="14" ry="9" fill="#FFB3D1" />

        {/* Tail */}
        <path d="M152 175 Q172 145 158 120 Q148 102 154 88" stroke="#FF9EC8" strokeWidth="9" fill="none" strokeLinecap="round" />
      </svg>

      {/* Right waving arm — animated separately */}
      <motion.div
        className="absolute"
        style={{ top: '52%', right: '10%', transformOrigin: 'bottom left' }}
        animate={{ rotate: [-10, 30, -10] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="38" height="50" viewBox="0 0 38 50">
          <path d="M4 48 Q10 30 30 14" stroke="#FFB3D1" strokeWidth="12" fill="none" strokeLinecap="round" />
          <ellipse cx="30" cy="10" rx="10" ry="8" fill="#FFB3D1" />
        </svg>
      </motion.div>
    </div>
  );
}
