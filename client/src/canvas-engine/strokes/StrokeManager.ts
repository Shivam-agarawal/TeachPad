// Stroke Manager — orchestrates stroke lifecycle from pointer events
// Listens to PointerManager, creates StrokeBuilders, manages active vs committed strokes
// No rendering logic — purely data pipeline

import type { PointerManager } from '../input/PointerManager';
import type { PointerData } from '../input/pointer-types';
import type { StrokeData } from '@/types/stroke';
import type { BoundingBox } from '@/types/geometry';
import { StrokeBuilder, type StrokeConfig } from './StrokeBuilder';
import { logger } from '@/utils/logger';

/** Callback for stroke lifecycle events */
export type StrokeEventType = 'stroke:begin' | 'stroke:update' | 'stroke:end' | 'stroke:cancel';

export interface StrokeEvent {
  type: StrokeEventType;
  stroke: StrokeData;
  bounds: BoundingBox;
  pointCount: number;
}

export type StrokeEventCallback = (event: StrokeEvent) => void;

/** Function to provide current tool configuration snapshot (injected by the React layer) */
export type StrokeConfigProvider = () => StrokeConfig | null;

/**
 * StrokeManager responsibilities:
 * 1. Subscribe to PointerManager events
 * 2. On pointer begin: create a StrokeBuilder with current tool config
 * 3. On pointer move: feed points into the active StrokeBuilder
 * 4. On pointer end: finalize the StrokeBuilder, emit committed stroke
 * 5. On pointer cancel: discard the in-progress stroke
 * 6. Maintain committed strokes list
 * 7. Dispatch stroke lifecycle events to subscribers
 */
export class StrokeManager {
  private pointerManager: PointerManager;
  private configProvider: StrokeConfigProvider;
  private activeBuilders: Map<number, StrokeBuilder> = new Map(); // keyed by pointerId
  private committedStrokes: StrokeData[] = [];
  private listeners: Set<StrokeEventCallback> = new Set();
  private unsubPointer: (() => void) | null = null;

  constructor(pointerManager: PointerManager, configProvider: StrokeConfigProvider) {
    this.pointerManager = pointerManager;
    this.configProvider = configProvider;

    // Subscribe to pointer events
    this.unsubPointer = this.pointerManager.onPointerEvent(this.handlePointerEvent.bind(this));

    logger.info('StrokeManager initialized');
  }

  // ─── Subscription ────────────────────────────────────────

  /** Register a callback for stroke lifecycle events */
  public onStrokeEvent(callback: StrokeEventCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private dispatch(event: StrokeEvent): void {
    this.listeners.forEach((cb) => cb(event));
  }

  // ─── Pointer Event Handler ───────────────────────────────

  private handlePointerEvent(data: PointerData): void {
    switch (data.phase) {
      case 'begin':
        this.handleBegin(data);
        break;
      case 'move':
        this.handleMove(data);
        break;
      case 'end':
        this.handleEnd(data);
        break;
      case 'cancel':
        this.handleCancel(data);
        break;
    }
  }

  private handleBegin(data: PointerData): void {
    // Get current tool configuration from the React UI layer
    const config = this.configProvider();
    if (!config) return; // Non-drawing tool active (e.g. select, pan)

    // Create a new StrokeBuilder for this pointer
    const builder = new StrokeBuilder(config);
    builder.addPoint(data);
    this.activeBuilders.set(data.pointerId, builder);

    this.dispatch({
      type: 'stroke:begin',
      stroke: builder.getStrokeData(),
      bounds: builder.getBounds(),
      pointCount: builder.getPointCount(),
    });
  }

  private handleMove(data: PointerData): void {
    const builder = this.activeBuilders.get(data.pointerId);
    if (!builder) return;

    // Only accumulate points when the pointer is actively pressed
    if (!data.isDown) return;

    builder.addPoint(data);

    this.dispatch({
      type: 'stroke:update',
      stroke: builder.getStrokeData(),
      bounds: builder.getBounds(),
      pointCount: builder.getPointCount(),
    });
  }

  private handleEnd(data: PointerData): void {
    const builder = this.activeBuilders.get(data.pointerId);
    if (!builder) return;

    // Add the final point
    builder.addPoint(data);

    // Finalize the stroke
    const strokeData = builder.finalize();

    // Only commit valid strokes (2+ points — ignore stray taps)
    if (builder.isValid()) {
      this.committedStrokes.push(strokeData);

      this.dispatch({
        type: 'stroke:end',
        stroke: strokeData,
        bounds: builder.getBounds(),
        pointCount: builder.getPointCount(),
      });

      logger.debug(
        `Stroke committed: ${strokeData.id} (${builder.getPointCount()} points, tool=${strokeData.toolId})`,
      );
    } else {
      this.dispatch({
        type: 'stroke:cancel',
        stroke: strokeData,
        bounds: builder.getBounds(),
        pointCount: builder.getPointCount(),
      });
    }

    this.activeBuilders.delete(data.pointerId);
  }

  private handleCancel(data: PointerData): void {
    const builder = this.activeBuilders.get(data.pointerId);
    if (!builder) return;

    this.dispatch({
      type: 'stroke:cancel',
      stroke: builder.getStrokeData(),
      bounds: builder.getBounds(),
      pointCount: builder.getPointCount(),
    });

    this.activeBuilders.delete(data.pointerId);
  }

  // ─── Queries ─────────────────────────────────────────────

  /** Get all committed strokes */
  public getCommittedStrokes(): readonly StrokeData[] {
    return this.committedStrokes;
  }

  /** Get the number of committed strokes */
  public getStrokeCount(): number {
    return this.committedStrokes.length;
  }

  /** Get the active (in-progress) stroke for a given pointer, if any */
  public getActiveStroke(pointerId: number): StrokeData | null {
    const builder = this.activeBuilders.get(pointerId);
    return builder ? builder.getStrokeData() : null;
  }

  /** Get all active builder IDs */
  public getActivePointerIds(): number[] {
    return Array.from(this.activeBuilders.keys());
  }

  /** Check if any stroke is currently in progress */
  public hasActiveStroke(): boolean {
    return this.activeBuilders.size > 0;
  }

  /** Remove a committed stroke by ID (for undo) */
  public removeStroke(strokeId: string): StrokeData | null {
    const idx = this.committedStrokes.findIndex((s) => s.id === strokeId);
    if (idx === -1) return null;
    const removed = this.committedStrokes.splice(idx, 1);
    return removed[0] ?? null;
  }

  /** Add a stroke back to the committed list (for redo) */
  public addStroke(stroke: StrokeData): void {
    this.committedStrokes.push(stroke);
  }

  /** Clear all committed strokes */
  public clearAll(): void {
    this.committedStrokes = [];
  }

  /** Replace the entire committed strokes array (for project load) */
  public setStrokes(strokes: StrokeData[]): void {
    this.committedStrokes = [...strokes];
  }

  // ─── Lifecycle ───────────────────────────────────────────

  /** Destroy the StrokeManager */
  public destroy(): void {
    if (this.unsubPointer) {
      this.unsubPointer();
      this.unsubPointer = null;
    }
    this.activeBuilders.clear();
    this.listeners.clear();
    logger.info('StrokeManager destroyed');
  }
}
