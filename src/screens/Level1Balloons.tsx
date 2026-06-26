'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useRef, useEffect } from 'react';
import { springs } from '@/lib/animations';
import { playSfx } from '@/lib/audioSynth';
import HuntPopup from '@/components/ui/HuntPopup';

interface Level1BalloonsProps {
  onComplete: () => void;
  onProgress: (current: number, target: number, suffix: string) => void;
}

const BALLOON_COLORS = [
  ['#FF7EB6', '#FF4499'],
  ['#FFD166', '#FFB800'],
  ['#C8A8FF', '#9B59B6'],
  ['#7ED6A7', '#27AE60'],
  ['#FF9AA2', '#FF6B6B'],
  ['#B5EAD7', '#6BCB77'],
  ['#FFDAC1', '#F4A261'],
  ['#E2F0CB', '#8BC34A'],
];

const BALLOON_GOAL = 12;

interface BalloonState {
  id: number;
  x: number;
  color: string[];
  popped: boolean;
  floatSpeed: number;
  size: number;
  delay: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  dist: number;
  shape: 'circle' | 'square';
}

interface MagicText {
  id: number;
  x: number;
  y: number;
}

function createBalloons(count: number): BalloonState[] {
  return Array.from({ length: count }, (_, i) => ({
    id:         i,
    x:          10 + (i % 8) * 10 + Math.random() * 5,
    color:      BALLOON_COLORS[i % BALLOON_COLORS.length],
    popped:     false,
    floatSpeed: 8 + Math.random() * 8,
    size:       52 + Math.random() * 24,
    delay:      Math.random() * 2,
  }));
}

function Balloon({
  balloon,
  onPop,
}: {
  balloon: BalloonState;
  onPop: (id: number, x: number, y: number) => void;
}) {
  const [phase, setPhase] = useState<'idle' | 'inflate' | 'popping'>('idle');
  const ref = useRef<HTMLDivElement>(null);

  const handlePop = useCallback(() => {
    if (balloon.popped || phase !== 'idle') return;
    setPhase('inflate');

    // Step 1: inflate for 80ms
    setTimeout(() => {
      setPhase('popping');
      // Get position for particles
      const rect = ref.current?.getBoundingClientRect();
      const el = ref.current?.closest('.balloon-container') as HTMLElement;
      const containerRect = el?.getBoundingClientRect();
      const px = rect && containerRect
        ? ((rect.left + rect.width / 2 - containerRect.left) / containerRect.width) * 100
        : balloon.x;
      const py = rect && containerRect
        ? ((rect.top + rect.height / 2 - containerRect.top) / containerRect.height) * 100
        : 50;
      onPop(balloon.id, px, py);
    }, 80);
  }, [balloon, phase, onPop]);

  return (
    <div
      ref={ref}
      className="absolute"
      style={{ left: `${balloon.x}%`, bottom: '-10%' }}
    >
      <AnimatePresence>
        {!balloon.popped && (
          <motion.div
            key="balloon"
            className="cursor-pointer select-none"
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{
              y: '-110vh',
              scale: phase === 'inflate' ? 1.18 : 1,
            }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
            transition={{
              y: { duration: balloon.floatSpeed, ease: 'linear', delay: balloon.delay },
              scale: { duration: phase === 'inflate' ? 0.08 : 0.06, ease: 'easeOut' },
            }}
            onClick={handlePop}
            whileTap={phase === 'idle' ? { scale: 1.05 } : {}}
          >
            <svg
              width={balloon.size}
              height={balloon.size * 1.3}
              viewBox="0 0 60 78"
              style={{
                filter: `drop-shadow(0 4px 12px ${balloon.color[0]}60)`,
              }}
            >
              {/* Balloon gradient body */}
              <defs>
                <radialGradient id={`bg-${balloon.id}`} cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                  <stop offset="100%" stopColor={balloon.color[0]} />
                </radialGradient>
              </defs>
              <ellipse cx="30" cy="30" rx="26" ry="28" fill={`url(#bg-${balloon.id})`} />
              {/* Shine */}
              <ellipse cx="20" cy="18" rx="8" ry="10" fill="rgba(255,255,255,0.35)" />
              {/* Knot */}
              <path d="M28 58 Q30 62 32 58" stroke={balloon.color[1]} strokeWidth="2" fill="none" />
              {/* String */}
              <path d="M30 60 Q25 68 30 76" stroke={balloon.color[1]} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Level1Balloons({ onComplete, onProgress }: Level1BalloonsProps) {
  const [balloons, setBalloons] = useState<BalloonState[]>(() => createBalloons(BALLOON_GOAL + 4));
  const [popped, setPopped]     = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [magicTexts, setMagicTexts] = useState<MagicText[]>([]);
  const poppedRef = useRef(0);
  let particleIdCounter = 0;

  useEffect(() => {
    onProgress(popped, BALLOON_GOAL, '🎈');
  }, [popped, onProgress]);

  const handlePop = useCallback((id: number, px: number, py: number) => {
    setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));

    // Sound + haptic
    try { playSfx('balloon_pop'); } catch {}
    if (navigator.vibrate) navigator.vibrate(15);

    const next = poppedRef.current + 1;
    poppedRef.current = next;
    setPopped(next);

    // Spawn particles
    const balloonColor = BALLOON_COLORS[id % BALLOON_COLORS.length][0];
    const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() * 100 + i,
      x: px,
      y: py,
      color: [balloonColor, '#FFD166', '#C8A8FF', '#7ED6A7'][i % 4],
      angle: (i / 12) * 360,
      dist: 60 + Math.random() * 80,
      shape: i % 3 === 0 ? 'square' : 'circle',
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 800);

    // Every 3 pops: show "+1 Magic ✨"
    if (next % 3 === 0) {
      const magicId = Date.now();
      setMagicTexts(prev => [...prev, { id: magicId, x: px, y: py }]);
      setTimeout(() => setMagicTexts(prev => prev.filter(m => m.id !== magicId)), 1000);
      try { playSfx('magic'); } catch {}
    }

    if (next >= BALLOON_GOAL) {
      try { playSfx('success'); } catch {}
      setTimeout(onComplete, 800);
    }
  }, [onComplete]);

  return (
    <div
      className="balloon-container absolute inset-0 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #C8A8FF 0%, #FFB8E0 50%, #FFE8F5 100%)',
      }}
    >
      {/* ── Hunt Popup ──────────────────────────────────────────── */}
      <HuntPopup
        emoji="🎈"
        title="Pop all the balloons!"
        description="Tap each balloon before it floats away. Pop 12 to win!"
        duration={3500}
      />

      {/* ── Balloons ────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        {balloons.map(b => (
          <Balloon key={b.id} balloon={b} onPop={handlePop} />
        ))}
      </div>

      {/* ── Burst particles ─────────────────────────────────────── */}
      {particles.map(p => {
        const rad = (p.angle * Math.PI) / 180;
        const dx = Math.cos(rad) * p.dist;
        const dy = Math.sin(rad) * p.dist;
        return (
          <motion.div
            key={p.id}
            className="absolute pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.shape === 'square' ? 8 : 7,
              height: p.shape === 'square' ? 8 : 7,
              borderRadius: p.shape === 'circle' ? '50%' : 2,
              background: p.color,
              boxShadow: `0 0 6px ${p.color}80`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: dx, y: dy, opacity: 0, scale: 0.2, rotate: 360 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          />
        );
      })}

      {/* ── +1 Magic text ───────────────────────────────────────── */}
      <AnimatePresence>
        {magicTexts.map(m => (
          <motion.div
            key={m.id}
            className="absolute pointer-events-none font-bold"
            style={{
              left: `${m.x}%`,
              top: `${m.y}%`,
              color: '#FFD166',
              fontSize: 18,
              textShadow: '0 0 10px rgba(255,209,102,0.9)',
              zIndex: 30,
            }}
            initial={{ opacity: 1, y: 0, scale: 0.7 }}
            animate={{ opacity: 0, y: -55, scale: 1.2 }}
            exit={{}}
            transition={{ duration: 0.95, ease: 'easeOut' }}
          >
            +1 Magic ✨
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── Clouds ──────────────────────────────────────────────── */}
      {[15, 55].map((y, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: `${y}%`, right: '-120px' }}
          animate={{ x: [0, -520] }}
          transition={{ duration: 35 + i * 10, repeat: Infinity, ease: 'linear', delay: i * 8 }}
        >
          <svg width="120" height="60" viewBox="0 0 120 60" fill="white" opacity="0.35">
            <ellipse cx="60" cy="40" rx="50" ry="22" />
            <ellipse cx="40" cy="32" rx="28" ry="22" />
            <ellipse cx="76" cy="30" rx="24" ry="20" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
