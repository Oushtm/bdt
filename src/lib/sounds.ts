export type SfxName =
  | 'tap'
  | 'balloon_pop'
  | 'heart_collect'
  | 'sparkle'
  | 'success'
  | 'gift_open'
  | 'meow'
  | 'correct'
  | 'wrong';

export type MusicLayer = 'calm' | 'playful' | 'emotional' | 'celebration';

/**
 * Sound sprite map — offsets in [startMs, durationMs]
 * Replace src URLs with real audio files.
 * If no files are provided the hook silently no-ops.
 */
export const SFX_SPRITE: Record<SfxName, [number, number]> = {
  tap:          [   0,  150],
  balloon_pop:  [ 200,  400],
  heart_collect:[ 700,  300],
  sparkle:      [1100,  500],
  success:      [1700, 1000],
  gift_open:    [2800, 2000],
  meow:         [4900,  600],
  correct:      [5600,  400],
  wrong:        [6100,  350],
};

/** Placeholder URLs — swap for real files */
export const MUSIC_URLS: Record<MusicLayer, string[]> = {
  calm:        ['/audio/bgm_calm.mp3'],
  playful:     ['/audio/bgm_playful.mp3'],
  emotional:   ['/audio/bgm_emotional.mp3'],
  celebration: ['/audio/bgm_celebration.mp3'],
};

export const SFX_URL = '/audio/sfx.mp3';
