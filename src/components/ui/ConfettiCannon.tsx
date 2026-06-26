'use client';

import { useEffect, useCallback, useRef } from 'react';

type ConfettiMode = 'burst' | 'fireworks';

interface ConfettiCannonProps {
  mode: ConfettiMode;
  trigger?: boolean;   // flip to true to fire burst
  origin?: { x: number; y: number };
  colors?: string[];
  active?: boolean;    // for fireworks mode
}

export default function ConfettiCannon({
  mode,
  trigger = false,
  origin = { x: 0.5, y: 0.5 },
  colors = ['#FF7EB6', '#FFD166', '#DCC8FF', '#7ED6A7', '#FFC4DD'],
  active = false,
}: ConfettiCannonProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef      = useRef<number | null>(null);

  const fireBurst = useCallback(
    async (orig = origin) => {
      try {
        const confetti = (await import('canvas-confetti')).default;
        const count = 200;
        const fire = (ratio: number, opts: Record<string, unknown>) =>
          confetti({
            particleCount: Math.floor(count * ratio),
            origin: orig,
            colors,
            disableForReducedMotion: true,
            ...opts,
          });
        fire(0.25, { spread: 26,  startVelocity: 55 });
        fire(0.20, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.10, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.10, { spread: 70,  startVelocity: 45 });
      } catch { /* canvas-confetti not loaded */ }
    },
    [origin, colors]
  );

  const startFireworks = useCallback(async () => {
    try {
      const confetti = (await import('canvas-confetti')).default;
      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors,
          disableForReducedMotion: true,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors,
          disableForReducedMotion: true,
        });
        rafRef.current = requestAnimationFrame(frame);
      };
      rafRef.current = requestAnimationFrame(frame);

      // Also do periodic big bursts
      intervalRef.current = setInterval(() => {
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { x: Math.random(), y: 0.3 + Math.random() * 0.3 },
          colors,
          shapes: ['circle', 'star'],
          disableForReducedMotion: true,
        });
      }, 2500);
    } catch { /* silently fail */ }
  }, [colors]);

  const stopFireworks = useCallback(() => {
    if (rafRef.current)      cancelAnimationFrame(rafRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    rafRef.current      = null;
    intervalRef.current = null;
  }, []);

  // Burst mode: fire when trigger flips to true
  useEffect(() => {
    if (mode === 'burst' && trigger) {
      fireBurst(origin);
    }
  }, [mode, trigger, fireBurst, origin]);

  // Fireworks mode: start/stop based on active
  useEffect(() => {
    if (mode !== 'fireworks') return;
    if (active) {
      startFireworks();
    } else {
      stopFireworks();
    }
    return stopFireworks;
  }, [mode, active, startFireworks, stopFireworks]);

  return null; // renders nothing — side effect only
}

/** Imperative helper to fire a confetti burst at a specific screen position */
export async function fireConfettiAt(clientX: number, clientY: number, colors?: string[]) {
  try {
    const confetti = (await import('canvas-confetti')).default;
    confetti({
      particleCount: 60,
      spread: 80,
      origin: {
        x: clientX / window.innerWidth,
        y: clientY / window.innerHeight,
      },
      colors: colors ?? ['#FF7EB6', '#FFD166', '#DCC8FF'],
      disableForReducedMotion: true,
    });
  } catch { /* silently fail */ }
}
