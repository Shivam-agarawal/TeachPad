// Stroke Builder — accumulates PointerData events into a single StrokeData during a gesture
// Immutable after finalization. No rendering logic.

import type { StrokePoint, BoundingBox } from '@/types/geometry';
import type { StrokeData, BrushParams } from '@/types/stroke';
import type { PointerData } from '../input/pointer-types';
import { uid } from '@/utils/uid';

export type StrokeToolId = 'pen' | 'pencil' | 'highlighter';

/** Configuration snapshot taken at stroke begin */
export interface StrokeConfig {
  toolId: StrokeToolId;
  color: string;
  brush: BrushParams;
  layerId: string;
}

/**
 * StrokeBuilder accumulates pointer events into a growing StrokeData object.
 *
 * Lifecycle:
 *   1. Construct with config snapshot → addPoint(begin)
 *   2. addPoint(move) × N  (may include coalesced sub-points)
 *   3. addPoint(end) → finalize()
 *
 * After finalize(), the builder is sealed and getStrokeData() returns the immutable result.
 */
export class StrokeBuilder {
  private id: string;
  private config: StrokeConfig;
  private points: StrokePoint[] = [];
  private bounds: BoundingBox = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  };
  private createdAt: number;
  private finalized: boolean = false;

  constructor(config: StrokeConfig) {
    this.id = uid('stroke-');
    this.config = config;
    this.createdAt = Date.now();
  }

  /** Add a primary pointer data point */
  public addPoint(data: PointerData): void {
    if (this.finalized) return;

    // If there are coalesced sub-frame points, add them first for smoothness
    if (data.coalescedPoints.length > 1) {
      for (const cp of data.coalescedPoints) {
        this.pushPoint(cp.worldX, cp.worldY, cp.pressure, cp.tiltX, cp.tiltY, cp.timestamp);
      }
    } else {
      // Single point (mouse or low-frequency pen)
      this.pushPoint(data.worldX, data.worldY, data.pressure, data.tiltX, data.tiltY, data.timestamp);
    }
  }

  /** Push a single point and update bounding box */
  private pushPoint(
    x: number,
    y: number,
    pressure: number,
    tiltX: number,
    tiltY: number,
    timestamp: number,
  ): void {
    // Skip duplicate zero-distance points (e.g. pointerup at exact same pixel as pointerdown)
    const last = this.points[this.points.length - 1];
    if (last && last.x === x && last.y === y) return;

    this.points.push({ x, y, pressure, tiltX, tiltY, timestamp });

    // Expand bounding box (include brush radius for accurate spatial queries)
    const radius = this.config.brush.size / 2;
    if (x - radius < this.bounds.minX) this.bounds.minX = x - radius;
    if (y - radius < this.bounds.minY) this.bounds.minY = y - radius;
    if (x + radius > this.bounds.maxX) this.bounds.maxX = x + radius;
    if (y + radius > this.bounds.maxY) this.bounds.maxY = y + radius;
  }

  /** Seal the builder — no more points can be added */
  public finalize(): StrokeData {
    this.finalized = true;
    return this.getStrokeData();
  }

  /** Get the stroke data (may still be in-progress if not finalized) */
  public getStrokeData(): StrokeData {
    return {
      id: this.id,
      toolId: this.config.toolId,
      points: this.points,
      color: this.config.color,
      brush: { ...this.config.brush },
      layerId: this.config.layerId,
      timestamp: this.createdAt,
    };
  }

  /** Get the current point count */
  public getPointCount(): number {
    return this.points.length;
  }

  /** Get the accumulated bounding box in world coordinates */
  public getBounds(): BoundingBox {
    return { ...this.bounds };
  }

  /** Get the stroke ID */
  public getId(): string {
    return this.id;
  }

  /** Whether this builder has been finalized */
  public isFinalized(): boolean {
    return this.finalized;
  }

  /** Whether this stroke has enough points to be considered valid (not a stray tap) */
  public isValid(): boolean {
    return this.points.length >= 2;
  }
}
