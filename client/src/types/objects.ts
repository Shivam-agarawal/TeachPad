// Canvas object union type

import type { BoundingBox, Point } from './geometry';
import type { StrokeData } from './stroke';

export type ObjectType = 'stroke' | 'shape' | 'text' | 'image';
export type ShapeKind = 'line' | 'arrow' | 'rectangle' | 'ellipse';

export interface BaseObject {
  id: string;
  type: ObjectType;
  layerId: string;
  bounds: BoundingBox;
  zOrder: number;
}

export interface StrokeObject extends BaseObject {
  type: 'stroke';
  data: StrokeData;
}

export interface ShapeObject extends BaseObject {
  type: 'shape';
  shapeKind: ShapeKind;
  start: Point;
  end: Point;
  color: string;
  strokeWidth: number;
}

export interface TextObject extends BaseObject {
  type: 'text';
  content: string;
  position: Point;
  fontSize: number;
  fontFamily: string;
  color: string;
}

export interface ImageObject extends BaseObject {
  type: 'image';
  src: string;
  position: Point;
  width: number;
  height: number;
}

export type CanvasObject = StrokeObject | ShapeObject | TextObject | ImageObject;
