'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SfxName } from '@/lib/audioSynth';

/**
 * useSynth — React hook for the Web Audio synth engine.
 * Safe for SSR: imports audioSynth lazily, client-side only.
 */
export function useSynth() {
  const [muted, setMutedState] = useState(false);
  const initialized = useRef(false);

  const playSfx = useCallback((name: SfxName) => {
    if (typeof window === 'undefined') return;
    import('@/lib/audioSynth').then(({ playSfx: play }) => play(name)).catch(() => {});
  }, []);

  const startMusic = useCallback(() => {
    if (typeof window === 'undefined') return;
    import('@/lib/audioSynth').then(({ startBGM, resumeCtx }) => {
      resumeCtx();
      startBGM();
    }).catch(() => {});
  }, []);

  const stopMusic = useCallback(() => {
    if (typeof window === 'undefined') return;
    import('@/lib/audioSynth').then(({ stopBGM }) => stopBGM()).catch(() => {});
  }, []);

  const toggleMute = useCallback(() => {
    setMutedState(prev => {
      const next = !prev;
      import('@/lib/audioSynth').then(({ setMuted }) => setMuted(next)).catch(() => {});
      return next;
    });
  }, []);

  const setBgmTheme = useCallback((theme: 'pentatonic' | 'birthday') => {
    if (typeof window === 'undefined') return;
    import('@/lib/audioSynth').then(({ setBGMTheme }) => setBGMTheme(theme)).catch(() => {});
  }, []);

  return { playSfx, startMusic, stopMusic, toggleMute, setBgmTheme, muted };
}
