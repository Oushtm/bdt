'use client';

import { useEffect, useCallback, useRef } from 'react';

interface ConfettiCannonProps {
  trigger?: boolean;   // flip to true to fire a burst
  loop?: boolean;      // if true, continuously fires fireworks while trigger is true
  origin?: { x: number; y: number };
  colors?: string[];
}

/**
 * ConfettiCannon — side-effect only, renders nothing.
 *
 * Usage:
 *   <ConfettiCannon trigger={true} />           → one-time burst
 *   <ConfettiCannon trigger={active} loop />    → continuous fireworks while active
 */
export default function ConfettiCannon({
  trigger = false,
  loop    = false,
  origin  = { x: 0.5, y: 0.5 },
  colors  = ['#FF7EB6', '#FFD166', '#DCC8FF', '#7ED6A7', '#FFC4DD'],
}: ConfettiCannonProps) {
  const rafRef      = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const firedRef    = useRef(false);

  const fireBurst = useCallback(
    async () => {
      try {
        const confetti = (await import('canvas-confetti')).default;
        const count = 200;
        const fire = (ratio: number, opts: Record<string, unknown>) =>
          confetti({
            particleCount: Math.floor(count * ratio),
            origin,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const startFireworks = useCallback(async () => {
    try {
      const confetti = (await import('canvas-confetti')).default;
      const frame = () => {
        confetti({ particleCount: 4, angle: 60,  spread: 55, origin: { x: 0, y: 0.6 }, colors, disableForReducedMotion: true });
        confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors, disableForReducedMotion: true });
        rafRef.current = requestAnimationFrame(frame);
      };
      rafRef.current = requestAnimationFrame(frame);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopFireworks = useCallback(() => {
    if (rafRef.current)      cancelAnimationFrame(rafRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    rafRef.current      = null;
    intervalRef.current = null;
  }, []);

  // One-time burst
  useEffect(() => {
    if (!loop && trigger && !firedRef.current) {
      firedRef.current = true;
      fireBurst();
    }
    if (!trigger) firedRef.current = false;
  }, [trigger, loop, fireBurst]);

  // Continuous fireworks
  useEffect(() => {
    if (!loop) return;
    if (trigger) {
      startFireworks();
    } else {
      stopFireworks();
    }
    return stopFireworks;
  }, [trigger, loop, startFireworks, stopFireworks]);

  return null;
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
