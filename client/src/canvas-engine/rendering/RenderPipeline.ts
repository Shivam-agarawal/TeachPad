// Render Pipeline — orchestrates stroke rendering across canvas layers
// Listens to StrokeManager events and drives the rAF render loop
// Per PRD §28: active stroke on active-canvas, committed strokes on committed-canvas

import type { Camera } from '../camera/Camera';
import type { CanvasLayerManager } from './CanvasLayerManager';
import type { StrokeManager } from '../strokes/StrokeManager';
import type { StrokeEvent } from '../strokes/StrokeManager';
import { renderActiveStroke, renderStroke, renderCommittedStrokes } from './StrokeRenderer';
import { logger } from '@/utils/logger';

/**
 * RenderPipeline responsibilities:
 * 1. Subscribe to StrokeManager lifecycle events
 * 2. On stroke:begin/update → clear active layer → render in-progress stroke
 * 3. On stroke:end → commit stroke to committed layer → clear active layer
 * 4. On stroke:cancel → clear active layer
 * 5. Provide full repaint for camera changes / resize
 * 6. Use requestAnimationFrame for smooth 60/120 FPS rendering
 */
export class RenderPipeline {
  private camera: Camera;
  private layerManager: CanvasLayerManager;
  private strokeManager: StrokeManager;
  private unsubStroke: (() => void) | null = null;
  private unsubCamera: (() => void) | null = null;
  private activeRafId: number | null = null;
  private needsActiveRedraw: boolean = false;
  private needsCommittedRedraw: boolean = false;
  private isDestroyed: boolean = false;

  constructor(
    camera: Camera,
    layerManager: CanvasLayerManager,
    strokeManager: StrokeManager,
  ) {
    this.camera = camera;
    this.layerManager = layerManager;
    this.strokeManager = strokeManager;

    this.setupStrokeListener();
    this.setupCameraListener();

    logger.info('RenderPipeline initialized');
  }

  // ─── Event Wiring ────────────────────────────────────────

  private setupStrokeListener(): void {
    this.unsubStroke = this.strokeManager.onStrokeEvent(
      this.handleStrokeEvent.bind(this),
    );
  }

  private setupCameraListener(): void {
    this.unsubCamera = this.camera.onChange(() => {
      if (this.isDestroyed) return;
      // Camera moved — need full repaint of committed strokes
      this.scheduleCommittedRedraw();
      // Also redraw active stroke if one is in progress
      if (this.strokeManager.hasActiveStroke()) {
        this.scheduleActiveRedraw();
      }
    });
  }

  private handleStrokeEvent(event: StrokeEvent): void {
    if (this.isDestroyed) return;

    switch (event.type) {
      case 'stroke:begin':
      case 'stroke:update':
        this.scheduleActiveRedraw();
        break;

      case 'stroke:end':
        // Render the finalized stroke onto committed layer synchronously
        this.commitStroke(event);
        // Clear active layer
        this.clearActiveLayer();
        // Schedule a committed layer repaint on the next frame for clean composition
        this.scheduleCommittedRedraw();
        break;

      case 'stroke:cancel':
        this.clearActiveLayer();
        break;
    }
  }

  // ─── Active Layer Rendering (rAF-driven) ─────────────────

  /** Schedule an active layer redraw on the next animation frame */
  private scheduleActiveRedraw(): void {
    if (this.needsActiveRedraw) return; // already scheduled
    this.needsActiveRedraw = true;

    if (this.activeRafId === null) {
      this.activeRafId = requestAnimationFrame(this.renderFrame.bind(this));
    }
  }

  /** Schedule a full committed layer repaint */
  private scheduleCommittedRedraw(): void {
    this.needsCommittedRedraw = true;

    if (this.activeRafId === null) {
      this.activeRafId = requestAnimationFrame(this.renderFrame.bind(this));
    }
  }

  /** Main render frame — called via rAF */
  private renderFrame(): void {
    this.activeRafId = null;
    if (this.isDestroyed) return;

    // 1. Repaint committed strokes if needed (camera change, resize, undo/redo)
    if (this.needsCommittedRedraw) {
      this.needsCommittedRedraw = false;
      this.repaintCommittedLayer();
    }

    // 2. Repaint active stroke if drawing is in progress
    if (this.needsActiveRedraw) {
      this.needsActiveRedraw = false;
      this.repaintActiveLayer();
    }
  }

  /** Render all active (in-progress) strokes onto the active canvas */
  private repaintActiveLayer(): void {
    const ctx = this.layerManager.getContext('active');
    if (!ctx) return;

    // Clear the active layer (it only ever holds the in-progress stroke)
    this.layerManager.clearLayer('active');

    // Render each active stroke (usually just one, but supports multi-touch)
    const pointerIds = this.strokeManager.getActivePointerIds();
    for (const pointerId of pointerIds) {
      const strokeData = this.strokeManager.getActiveStroke(pointerId);
      if (strokeData && strokeData.points.length > 0) {
        renderActiveStroke(ctx, strokeData, this.camera);
      }
    }
  }

  /** Render a single newly committed stroke incrementally onto the committed layer */
  private commitStroke(event: StrokeEvent): void {
    const ctx = this.layerManager.getContext('committed');
    if (!ctx) return;

    // Incremental: just draw the new stroke on top of existing content
    renderStroke(ctx, event.stroke, this.camera);
  }

  /** Full repaint of the committed layer (used after camera change, resize, undo/redo) */
  private repaintCommittedLayer(): void {
    const ctx = this.layerManager.getContext('committed');
    if (!ctx) return;

    this.layerManager.clearLayer('committed');
    const strokes = this.strokeManager.getCommittedStrokes();
    renderCommittedStrokes(ctx, strokes, this.camera);
  }

  /** Clear just the active-stroke layer */
  private clearActiveLayer(): void {
    this.layerManager.clearLayer('active');
  }

  // ─── Public API ──────────────────────────────────────────

  /** Force a full repaint of all stroke layers (e.g. after project load, undo/redo) */
  public requestFullRepaint(): void {
    this.scheduleCommittedRedraw();
  }

  /** Force immediate synchronous repaint (used for export/screenshot) */
  public repaintSync(): void {
    this.repaintCommittedLayer();
    this.repaintActiveLayer();
  }

  // ─── Lifecycle ───────────────────────────────────────────

  public destroy(): void {
    this.isDestroyed = true;
    if (this.activeRafId !== null) {
      cancelAnimationFrame(this.activeRafId);
      this.activeRafId = null;
    }
    if (this.unsubStroke) {
      this.unsubStroke();
      this.unsubStroke = null;
    }
    if (this.unsubCamera) {
      this.unsubCamera();
      this.unsubCamera = null;
    }
    logger.info('RenderPipeline destroyed');
  }
}
