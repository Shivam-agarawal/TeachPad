// Geometry types used across the canvas engine

export interface Point {
  x: number;
  y: number;
}

export interface StrokePoint extends Point {
  pressure: number;
  tiltX: number;
  tiltY: number;
  timestamp: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface Transform {
  offsetX: number;
  offsetY: number;
  zoom: number;
}
