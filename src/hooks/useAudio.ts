'use client';

import { useRef, useCallback } from 'react';
import { MusicLayer, SfxName } from '@/lib/sounds';

/**
 * useAudio — Howler.js manager
 *
 * Lazy-initialises on first audioUnlock() call (after a user gesture).
 * Silently no-ops if audio files are not present or browser blocks audio.
 */
export function useAudio() {
  const howlRef = useRef<{
    sfx: import('howler').Howl | null;
    music: Partial<Record<MusicLayer, import('howler').Howl>>;
    current: MusicLayer | null;
    unlocked: boolean;
  }>({ sfx: null, music: {}, current: null, unlocked: false });

  const initHowler = useCallback(async () => {
    if (howlRef.current.unlocked) return;
    try {
      const { Howl, Howler } = await import('howler');

      // Resume AudioContext on mobile (browser autoplay policy)
      if (Howler.ctx?.state === 'suspended') {
        await Howler.ctx.resume();
      }

      const { SFX_SPRITE, MUSIC_URLS, SFX_URL } = await import('@/lib/sounds');

      // SFX sprite
      howlRef.current.sfx = new Howl({
        src: [SFX_URL],
        sprite: SFX_SPRITE as Record<string, [number, number]>,
        volume: 0.6,
        onloaderror: () => { /* silently fail */ },
      });

      // Music layers
      (Object.keys(MUSIC_URLS) as MusicLayer[]).forEach((layer) => {
        howlRef.current.music[layer] = new Howl({
          src: MUSIC_URLS[layer],
          loop: true,
          volume: 0,
          preload: false,
          onloaderror: () => { /* silently fail */ },
        });
      });

      howlRef.current.unlocked = true;
    } catch {
      // Howler not available or blocked — no-op
    }
  }, []);

  const audioUnlock = useCallback(async () => {
    await initHowler();
  }, [initHowler]);

  const playSfx = useCallback((name: SfxName) => {
    try {
      howlRef.current.sfx?.play(name);
    } catch { /* silently fail */ }
  }, []);

  const playMusic = useCallback((layer: MusicLayer) => {
    const { music, current } = howlRef.current;
    if (current === layer) return;

    const next = music[layer];
    if (!next) return;

    // Fade out current
    if (current && music[current]) {
      const prev = music[current]!;
      prev.fade(prev.volume(), 0, 1500);
      prev.once('fade', () => prev.stop());
    }

    // Fade in next
    if (!next.playing()) next.play();
    next.volume(0);
    next.fade(0, 0.5, 1500);
    howlRef.current.current = layer;
  }, []);

  const stopMusic = useCallback(() => {
    const { music, current } = howlRef.current;
    if (current && music[current]) {
      const layer = music[current]!;
      layer.fade(layer.volume(), 0, 800);
      layer.once('fade', () => layer.stop());
      howlRef.current.current = null;
    }
  }, []);

  return { audioUnlock, playSfx, playMusic, stopMusic };
}
