// ── Utility helpers ────────────────────────────────────────────────────────

export const rand = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const randInt = (min: number, max: number) =>
  Math.floor(rand(min, max + 1));

export const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

export const lerp = (a: number, b: number, t: number) =>
  a + (b - a) * t;

/** Check if a point is within `threshold` pixels of a rect's center */
export const isNearRect = (
  px: number,
  py: number,
  rect: DOMRect,
  threshold = 60
): boolean => {
  const cx = rect.left + rect.width  / 2;
  const cy = rect.top  + rect.height / 2;
  const dx = px - cx;
  const dy = py - cy;
  return Math.sqrt(dx * dx + dy * dy) < threshold;
};

/** Generate a CSS box-shadow string of N random dots */
export const generateStarShadows = (
  n: number,
  spread = 2000,
  color = 'rgba(255,255,255,0.7)'
): string =>
  Array.from({ length: n }, () =>
    `${Math.random() * spread}px ${Math.random() * spread}px 0 ${color}`
  ).join(', ');

/** Shuffle an array (Fisher-Yates) */
export const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
