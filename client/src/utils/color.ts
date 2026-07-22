// Utility: HSB/RGB/Hex color conversions

/** Convert hex color string to RGB tuple */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

/** Convert RGB tuple to hex string */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

/** Convert HSB to RGB */
export function hsbToRgb(
  h: number,
  s: number,
  b: number,
): [number, number, number] {
  const sNorm = s / 100;
  const bNorm = b / 100;
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) =>
    bNorm * (1 - sNorm * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [
    Math.round(f(5) * 255),
    Math.round(f(3) * 255),
    Math.round(f(1) * 255),
  ];
}
