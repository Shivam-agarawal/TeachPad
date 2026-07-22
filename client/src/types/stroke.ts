// Stroke data types

import type { StrokePoint } from './geometry';

export interface BrushParams {
  size: number;
  opacity: number;
  thinning: number;
  smoothing: number;
  streamline: number;
}

export interface StrokeData {
  id: string;
  toolId: 'pen' | 'pencil' | 'highlighter';
  points: StrokePoint[];
  color: string;
  brush: BrushParams;
  layerId: string;
  timestamp: number;
}
