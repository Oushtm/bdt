'use client';

import { useCallback } from 'react';

type VibrationPattern = 'tap' | 'success' | 'epic';

const PATTERNS: Record<VibrationPattern, number | number[]> = {
  tap:     10,
  success: [30, 20, 30],
  epic:    [50, 30, 80],
};

export function useVibration() {
  const vibrate = useCallback((pattern: VibrationPattern = 'tap') => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(PATTERNS[pattern]);
      }
    } catch { /* not supported */ }
  }, []);

  return { vibrate };
}
