// Per-tool perfect-freehand parameter presets

export interface BrushDefaults {
  size: number;
  opacity: number;
  thinning: number;
  smoothing: number;
  streamline: number;
}

/** Default brush settings per tool, tuned for natural feel */
export const BRUSH_DEFAULTS: Record<string, BrushDefaults> = {
  pen: {
    size: 4,
    opacity: 1,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  },
  pencil: {
    size: 3,
    opacity: 0.7,
    thinning: 0.6,
    smoothing: 0.4,
    streamline: 0.4,
  },
  highlighter: {
    size: 24,
    opacity: 0.35,
    thinning: 0,
    smoothing: 0.5,
    streamline: 0.5,
  },
} as const;
