/**
 * audioSynth.ts — Web Audio API synthesizer
 *
 * Provides:
 *  - Synthesized SFX: tap, balloon_pop, collect, success, sparkle, gift_open, meow, magic
 *  - Procedural looping BGM: soft pentatonic music-box melody
 *
 * No external audio files needed. Works immediately in all modern browsers.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return ctx;
}

// ── Master gain (for mute/volume) ────────────────────────────────────────────
let masterGain: GainNode | null = null;
let _muted = false;
let _bgmScheduled = false;
let _bgmStop: (() => void) | null = null;

function getMaster(): GainNode {
  const c = getCtx();
  if (!masterGain) {
    masterGain = c.createGain();
    masterGain.gain.value = 0.6;
    masterGain.connect(c.destination);
  }
  return masterGain;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function osc(
  freq: number,
  type: OscillatorType,
  startTime: number,
  duration: number,
  gainVal: number,
  destination?: AudioNode,
): void {
  const c = getCtx();
  const gain = c.createGain();
  gain.connect(destination ?? getMaster());
  gain.gain.setValueAtTime(gainVal, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  const o = c.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, startTime);
  o.connect(gain);
  o.start(startTime);
  o.stop(startTime + duration + 0.05);
}

function sweep(
  freqFrom: number,
  freqTo: number,
  type: OscillatorType,
  startTime: number,
  duration: number,
  gainVal: number,
): void {
  const c = getCtx();
  const gain = c.createGain();
  gain.connect(getMaster());
  gain.gain.setValueAtTime(gainVal, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  const o = c.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freqFrom, startTime);
  o.frequency.exponentialRampToValueAtTime(freqTo, startTime + duration);
  o.connect(gain);
  o.start(startTime);
  o.stop(startTime + duration + 0.05);
}

function noise(startTime: number, duration: number, gainVal: number): void {
  const c = getCtx();
  const bufSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

  const source = c.createBufferSource();
  source.buffer = buffer;

  // Band-pass filter for colour
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 400;
  filter.Q.value = 0.5;

  const gain = c.createGain();
  gain.gain.setValueAtTime(gainVal, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(getMaster());
  source.start(startTime);
  source.stop(startTime + duration);
}

// ── SFX definitions ───────────────────────────────────────────────────────────
export type SfxName =
  | 'tap'
  | 'balloon_pop'
  | 'collect'
  | 'success'
  | 'sparkle'
  | 'gift_open'
  | 'meow'
  | 'magic';

export function playSfx(name: SfxName): void {
  if (_muted) return;
  try {
    const c = getCtx();
    if (c.state === 'suspended') c.resume();
    const t = c.currentTime;

    switch (name) {
      case 'tap': {
        osc(880, 'sine', t, 0.08, 0.15);
        break;
      }
      case 'balloon_pop': {
        // Noise burst + descending sweep
        noise(t, 0.12, 0.4);
        sweep(320, 60, 'sawtooth', t, 0.18, 0.25);
        break;
      }
      case 'collect': {
        // Ascending arpeggio C5-E5-G5-C6
        const notes = [523, 659, 784, 1047];
        notes.forEach((f, i) => osc(f, 'triangle', t + i * 0.07, 0.15, 0.2));
        break;
      }
      case 'success': {
        // Joyful major chord fanfare
        const chord = [523, 659, 784, 1047, 1319];
        chord.forEach((f, i) => {
          osc(f, 'sine', t + i * 0.06, 0.4, 0.18);
          osc(f * 2, 'sine', t + i * 0.06 + 0.3, 0.25, 0.08);
        });
        break;
      }
      case 'sparkle': {
        // Random high-frequency pings
        for (let i = 0; i < 6; i++) {
          const freq = 1200 + Math.random() * 1800;
          osc(freq, 'sine', t + i * 0.05, 0.1, 0.12);
        }
        break;
      }
      case 'gift_open': {
        // Low-to-high sweep + sparkle cascade
        sweep(80, 2000, 'sine', t, 0.6, 0.3);
        for (let i = 0; i < 8; i++) {
          osc(800 + i * 200, 'sine', t + 0.5 + i * 0.07, 0.15, 0.15);
        }
        break;
      }
      case 'meow': {
        // Frequency-modulated sine sweep: "mew"
        sweep(400, 700, 'sine', t, 0.15, 0.22);
        sweep(700, 450, 'sine', t + 0.15, 0.2, 0.18);
        break;
      }
      case 'magic': {
        // Shimmer: quick pentatonic burst
        const penta = [523, 587, 698, 784, 880, 1047];
        penta.forEach((f, i) => osc(f, 'sine', t + i * 0.04, 0.12, 0.14));
        break;
      }
    }
  } catch {
    // Silently fail
  }
}

// ── Background Music ───────────────────────────────────────────────────────────
// Soft pentatonic melody — C major pentatonic: C D E G A
const PENTATONIC = [523, 587, 659, 784, 880, 1047, 1175, 1319];
const BASS_NOTES = [130.8, 146.8, 164.8, 196, 220, 261.6];

const MELODY: [number, number, number][] = [
  // [freqIndex, beatOffset, duration]
  [0, 0, 0.5], [2, 0.5, 0.5], [4, 1.0, 0.5], [3, 1.5, 0.5],
  [2, 2.0, 1.0], [4, 3.0, 0.5], [6, 3.5, 0.5],
  [5, 4.0, 0.5], [4, 4.5, 0.5], [3, 5.0, 0.5], [2, 5.5, 0.5],
  [1, 6.0, 0.5], [0, 6.5, 0.5], [2, 7.0, 1.0],
];

// Happy Birthday melody notes: [freq, beatOffset, duration]
const HAPPY_BIRTHDAY_MELODY: [number, number, number][] = [
  // C4, C4, D4, C4, F4, E4
  [261.63, 0.0, 0.5],
  [261.63, 0.5, 0.5],
  [293.66, 1.0, 1.0],
  [261.63, 2.0, 1.0],
  [349.23, 3.0, 1.0],
  [329.63, 4.0, 2.0],

  // C4, C4, D4, C4, G4, F4
  [261.63, 6.0, 0.5],
  [261.63, 6.5, 0.5],
  [293.66, 7.0, 1.0],
  [261.63, 8.0, 1.0],
  [392.00, 9.0, 1.0],
  [349.23, 10.0, 2.0],

  // C4, C4, C5, A4, F4, E4, D4
  [261.63, 12.0, 0.5],
  [261.63, 12.5, 0.5],
  [523.25, 13.0, 1.0],
  [440.00, 14.0, 1.0],
  [349.23, 15.0, 1.0],
  [329.63, 16.0, 1.0],
  [293.66, 17.0, 1.0],

  // Bb4, Bb4, A4, F4, G4, F4
  [466.16, 18.0, 0.5],
  [466.16, 18.5, 0.5],
  [440.00, 19.0, 1.0],
  [349.23, 20.0, 1.0],
  [392.00, 21.0, 1.0],
  [349.23, 22.0, 2.0],
];

// Happy Birthday bass notes
const BIRTHDAY_BASS = [
  130.81, 130.81, 130.81, // C
  130.81, 130.81, 130.81, // C
  196.00, 196.00, 196.00, // G
  130.81, 130.81, 130.81, // C
  174.61, 174.61, 174.61, // F
  130.81, 130.81, 130.81, // C
  196.00, 196.00, 196.00, // G
  130.81, 130.81, 130.81  // C
];

const BEAT_DURATION = 0.55; // seconds per beat (slightly slower for music-box feel)
const BAR_BEATS = 8;
const BAR_DURATION = BAR_BEATS * BEAT_DURATION;
const PATTERN_BARS = 2;
const LOOP_DURATION = PATTERN_BARS * BAR_DURATION; // 8.8 seconds total loop

let _currentTheme: 'pentatonic' | 'birthday' = 'pentatonic';

export function setBGMTheme(theme: 'pentatonic' | 'birthday'): void {
  if (_currentTheme === theme) return;
  _currentTheme = theme;
  if (_bgmScheduled) {
    stopBGM();
    setTimeout(() => {
      startBGM();
    }, 150);
  }
}

export function startBGM(): void {
  if (_bgmScheduled || _muted) return;
  _bgmScheduled = true;

  const c = getCtx();
  if (c.state === 'suspended') c.resume();

  let stopped = false;
  let loopStart = c.currentTime + 0.1;

  // Low-pass filter for warmth
  const lpf = c.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.value = 2000;
  lpf.connect(getMaster());

  // Reverb-like delay for depth
  const delay = c.createDelay(0.5);
  delay.delayTime.value = 0.3;
  const delayGain = c.createGain();
  delayGain.gain.value = 0.15;
  delay.connect(delayGain);
  delayGain.connect(lpf);

  function scheduleLoop(startAt: number) {
    if (stopped) return;

    const isBirthday = _currentTheme === 'birthday';
    const melodyToPlay = isBirthday ? HAPPY_BIRTHDAY_MELODY : MELODY;
    const currentLoopDuration = isBirthday ? (24 * BEAT_DURATION) : LOOP_DURATION;

    // Schedule melody notes
    melodyToPlay.forEach((note) => {
      // For pentatonic, note[0] is frequency index. For birthday, note[0] is frequency directly.
      const freq = isBirthday ? note[0] : PENTATONIC[note[0]];
      const beatOff = note[1];
      const dur = note[2];

      const t = startAt + beatOff * BEAT_DURATION;
      const d = dur * BEAT_DURATION;

      // Main melody — soft triangle
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d * 0.9);
      g.connect(lpf);
      g.connect(delay);

      const o = c.createOscillator();
      o.type = 'triangle';
      o.frequency.value = freq;
      o.connect(g);
      o.start(t);
      o.stop(t + d + 0.1);

      // Add upper harmonic for chime-like quality
      const g2 = c.createGain();
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.linearRampToValueAtTime(0.04, t + 0.01);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + d * 0.5);
      g2.connect(lpf);
      const o2 = c.createOscillator();
      o2.type = 'sine';
      o2.frequency.value = freq * 2;
      o2.connect(g2);
      o2.start(t);
      o2.stop(t + d);
    });

    // Bass pad
    const totalBeats = isBirthday ? 24 : (BAR_BEATS * PATTERN_BARS);
    for (let beat = 0; beat < totalBeats; beat++) {
      const bassFreq = isBirthday
        ? BIRTHDAY_BASS[beat % BIRTHDAY_BASS.length]
        : BASS_NOTES[beat % BASS_NOTES.length];
      const t = startAt + beat * BEAT_DURATION;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.15);
      g.gain.exponentialRampToValueAtTime(0.0001, t + BEAT_DURATION * 0.85);
      g.connect(lpf);
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.value = bassFreq;
      o.connect(g);
      o.start(t);
      o.stop(t + BEAT_DURATION);
    }

    // Schedule next loop a little before this one ends
    const nextLoop = startAt + currentLoopDuration;
    const scheduleDelay = (nextLoop - c.currentTime - 0.5) * 1000;
    setTimeout(() => scheduleLoop(nextLoop), Math.max(0, scheduleDelay));
  }

  scheduleLoop(loopStart);

  _bgmStop = () => {
    stopped = true;
    _bgmScheduled = false;
    // Fade out master gain gracefully
    const m = getMaster();
    const now = c.currentTime;
    m.gain.setValueAtTime(m.gain.value, now);
    m.gain.linearRampToValueAtTime(0.0001, now + 0.5);
    setTimeout(() => {
      m.gain.setValueAtTime(0.6, c.currentTime);
    }, 600);
  };
}

export function stopBGM(): void {
  if (_bgmStop) {
    _bgmStop();
    _bgmStop = null;
  }
}

export function setMuted(muted: boolean): void {
  _muted = muted;
  const m = getMaster();
  const c = getCtx();
  if (muted) {
    m.gain.setValueAtTime(m.gain.value, c.currentTime);
    m.gain.linearRampToValueAtTime(0.0001, c.currentTime + 0.3);
    _bgmScheduled = false;
  } else {
    m.gain.setValueAtTime(0.0001, c.currentTime);
    m.gain.linearRampToValueAtTime(0.6, c.currentTime + 0.3);
    // Restart BGM if it was playing
    startBGM();
  }
}

export function isMuted(): boolean {
  return _muted;
}

export function resumeCtx(): void {
  try {
    const c = getCtx();
    if (c.state === 'suspended') c.resume();
  } catch {
    // ignore
  }
}
