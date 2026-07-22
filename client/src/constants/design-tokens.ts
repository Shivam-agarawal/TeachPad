// Design tokens as TypeScript constants
// Mirrors the CSS custom properties in index.css for use in canvas rendering

export const COLORS = {
  light: {
    bgCanvas: '#FFFFFF',
    bgSurface: '#F7F7F8',
    bgSurfaceTranslucent: 'rgba(255,255,255,0.72)',
    textPrimary: '#111214',
    textSecondary: '#6B6D73',
    accent: '#3D7FFF',
    inkBlack: '#1A1B1E',
    danger: '#E5484D',
    borderSubtle: 'rgba(0,0,0,0.08)',
  },
  dark: {
    bgCanvas: '#0E0F11',
    bgSurface: '#17181B',
    bgSurfaceTranslucent: 'rgba(23,24,27,0.72)',
    textPrimary: '#F2F2F3',
    textSecondary: '#9A9CA3',
    accent: '#5B93FF',
    inkBlack: '#EDEDEE',
    danger: '#F16468',
    borderSubtle: 'rgba(255,255,255,0.08)',
  },
} as const;

/** Default ink palette — common whiteboard-marker colors */
export const INK_PALETTE = [
  '#1A1B1E', // Black
  '#E5484D', // Red
  '#3D7FFF', // Blue
  '#46A758', // Green
  '#F76B15', // Orange
  '#8E4EC6', // Purple
  '#FFB224', // Yellow
] as const;

export const SPACING = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
} as const;

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
} as const;

export const FONT_SIZES = {
  micro: 11,
  body: 13,
  heading: 15,
  title: 20,
  display: 24,
} as const;
