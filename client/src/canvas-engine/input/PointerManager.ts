// Pointer Manager — Central input pipeline for the canvas engine
// Attaches to the active canvas layer, normalizes PointerEvents, dispatches to subscribers
// Handles pointer capture, coalesced events, and gesture prevention

import type { Camera } from '../camera/Camera';
import type { CanvasLayerManager } from '../rendering/CanvasLayerManager';
import type {
  PointerData,
  PointerPhase,
  InputDevice,
  CoalescedPoint,
} from './pointer-types';
import { PressureNormalizer, type PressureCurve } from './PressureNormalizer';
import { logger } from '@/utils/logger';

export type PointerEventCallback = (data: PointerData) => void;

/**
 * PointerManager responsibilities:
 * 1. Attach pointer* event listeners to the active-canvas element
 * 2. Prevent default browser gestures (scroll, pinch-zoom, text selection)
 * 3. Use setPointerCapture for reliable move/up tracking
 * 4. Extract coalesced events for high-frequency pen tablets
 * 5. Normalize raw PointerEvent into PointerData (screen → world coords via Camera)
 * 6. Normalize pressure via PressureNormalizer
 * 7. Dispatch to registered subscribers
 * 8. Detect pen eraser tip (button === 5)
 */
export class PointerManager {
  private camera: Camera;
  private layerManager: CanvasLayerManager;
  private pressureNormalizer: PressureNormalizer;
  private listeners: Set<PointerEventCallback> = new Set();
  private activeElement: HTMLCanvasElement | null = null;
  private activePointers: Map<number, InputDevice> = new Map();
  private isDestroyed: boolean = false;

  // Bound event handler references for clean removal
  private handlePointerDownBound: (e: PointerEvent) => void;
  private handlePointerMoveBound: (e: PointerEvent) => void;
  private handlePointerUpBound: (e: PointerEvent) => void;
  private handlePointerCancelBound: (e: PointerEvent) => void;
  private handleContextMenuBound: (e: Event) => void;
  private handleTouchStartBound: (e: TouchEvent) => void;

  constructor(
    camera: Camera,
    layerManager: CanvasLayerManager,
    pressureCurve: PressureCurve = 'default',
  ) {
    this.camera = camera;
    this.layerManager = layerManager;
    this.pressureNormalizer = new PressureNormalizer(pressureCurve);

    // Bind handlers once
    this.handlePointerDownBound = this.handlePointerDown.bind(this);
    this.handlePointerMoveBound = this.handlePointerMove.bind(this);
    this.handlePointerUpBound = this.handlePointerUp.bind(this);
    this.handlePointerCancelBound = this.handlePointerCancel.bind(this);
    this.handleContextMenuBound = (e: Event) => e.preventDefault();
    this.handleTouchStartBound = (e: TouchEvent) => {
      // Prevent iOS/Android default gestures (scroll, zoom) on canvas
      if (e.touches.length === 1) e.preventDefault();
    };

    this.attach();
  }

  // ─── Lifecycle ───────────────────────────────────────────────

  /** Attach listeners to the active canvas layer element */
  private attach(): void {
    const activeLayer = this.layerManager.getLayer('active');
    if (!activeLayer) {
      logger.warn('PointerManager: active canvas layer not found');
      return;
    }

    this.activeElement = activeLayer.element;
    const el = this.activeElement;

    // Pointer events (primary input pipeline)
    el.addEventListener('pointerdown', this.handlePointerDownBound);
    el.addEventListener('pointermove', this.handlePointerMoveBound);
    el.addEventListener('pointerup', this.handlePointerUpBound);
    el.addEventListener('pointercancel', this.handlePointerCancelBound);

    // Prevent browser default gestures
    el.addEventListener('contextmenu', this.handleContextMenuBound);
    el.addEventListener('touchstart', this.handleTouchStartBound, { passive: false });

    // CSS touch-action is already set to 'none' by CanvasLayerManager,
    // but ensure it for safety
    el.style.touchAction = 'none';

    logger.info('PointerManager attached to active canvas layer');
  }

  /** Detach all listeners */
  public destroy(): void {
    this.isDestroyed = true;
    const el = this.activeElement;
    if (el) {
      el.removeEventListener('pointerdown', this.handlePointerDownBound);
      el.removeEventListener('pointermove', this.handlePointerMoveBound);
      el.removeEventListener('pointerup', this.handlePointerUpBound);
      el.removeEventListener('pointercancel', this.handlePointerCancelBound);
      el.removeEventListener('contextmenu', this.handleContextMenuBound);
      el.removeEventListener('touchstart', this.handleTouchStartBound);
    }
    this.listeners.clear();
    this.activePointers.clear();
    this.activeElement = null;
    logger.info('PointerManager destroyed');
  }

  // ─── Subscription ────────────────────────────────────────────

  /** Register a callback for normalized pointer events */
  public onPointerEvent(callback: PointerEventCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /** Dispatch normalized PointerData to all subscribers */
  private dispatch(data: PointerData): void {
    this.listeners.forEach((cb) => cb(data));
  }

  // ─── Configuration ───────────────────────────────────────────

  /** Update the pressure curve */
  public setPressureCurve(curve: PressureCurve): void {
    this.pressureNormalizer.setCurve(curve);
  }

  /** Check if a real pen/stylus has been used */
  public hasPenInput(): boolean {
    return this.pressureNormalizer.hasPenBeenDetected();
  }

  /** Get the number of currently active pointers */
  public getActivePointerCount(): number {
    return this.activePointers.size;
  }

  // ─── Event Handlers ──────────────────────────────────────────

  private handlePointerDown(e: PointerEvent): void {
    if (this.isDestroyed) return;
    e.preventDefault();

    // Capture this pointer for reliable tracking even if it leaves the element
    this.activeElement?.setPointerCapture(e.pointerId);

    const device = this.resolveDevice(e);
    this.activePointers.set(e.pointerId, device);

    const data = this.buildPointerData(e, 'begin');
    this.dispatch(data);
  }

  private handlePointerMove(e: PointerEvent): void {
    if (this.isDestroyed) return;
    e.preventDefault();

    // Only process moves for tracked pointers (captured)
    const isTracked = this.activePointers.has(e.pointerId);

    // Build primary event data
    const phase: PointerPhase = isTracked ? 'move' : 'move';
    const data = this.buildPointerData(e, phase);

    // Extract coalesced events for high-frequency pen input
    if (isTracked && typeof e.getCoalescedEvents === 'function') {
      const coalescedEvents = e.getCoalescedEvents();
      if (coalescedEvents.length > 1) {
        data.coalescedPoints = this.buildCoalescedPoints(coalescedEvents);
      }
    }

    this.dispatch(data);
  }

  private handlePointerUp(e: PointerEvent): void {
    if (this.isDestroyed) return;
    e.preventDefault();

    this.activeElement?.releasePointerCapture(e.pointerId);
    this.activePointers.delete(e.pointerId);

    const data = this.buildPointerData(e, 'end');
    this.dispatch(data);
  }

  private handlePointerCancel(e: PointerEvent): void {
    if (this.isDestroyed) return;

    this.activePointers.delete(e.pointerId);

    const data = this.buildPointerData(e, 'cancel');
    this.dispatch(data);
  }

  // ─── Normalization ───────────────────────────────────────────

  /** Build a normalized PointerData from a raw PointerEvent */
  private buildPointerData(e: PointerEvent, phase: PointerPhase): PointerData {
    const el = this.activeElement;
    const rect = el?.getBoundingClientRect();

    // Screen position relative to the canvas element
    const screenX = rect ? e.clientX - rect.left : e.clientX;
    const screenY = rect ? e.clientY - rect.top : e.clientY;

    // Transform to world coordinates via Camera
    const worldPos = this.camera.screenToWorld(screenX, screenY);

    // Normalize pressure
    const rawPressure = e.pressure;
    const normalizedPressure = this.pressureNormalizer.normalize(
      rawPressure,
      e.pointerType,
      e.buttons,
    );

    const device = this.resolveDevice(e);
    const isPenEraser = this.detectPenEraser(e);

    return {
      pointerId: e.pointerId,
      phase,
      device,
      screenX,
      screenY,
      worldX: worldPos.x,
      worldY: worldPos.y,
      pressure: normalizedPressure,
      rawPressure,
      tiltX: e.tiltX || 0,
      tiltY: e.tiltY || 0,
      twist: e.twist || 0,
      timestamp: e.timeStamp,
      isPenEraser,
      isDown: phase === 'begin' || (phase === 'move' && e.buttons > 0),
      coalescedPoints: [],
    };
  }

  /** Build coalesced points from getCoalescedEvents() for high-frequency pen data */
  private buildCoalescedPoints(events: PointerEvent[]): CoalescedPoint[] {
    const el = this.activeElement;
    const rect = el?.getBoundingClientRect();

    return events.map((ce) => {
      const screenX = rect ? ce.clientX - rect.left : ce.clientX;
      const screenY = rect ? ce.clientY - rect.top : ce.clientY;
      const worldPos = this.camera.screenToWorld(screenX, screenY);

      return {
        screenX,
        screenY,
        worldX: worldPos.x,
        worldY: worldPos.y,
        pressure: this.pressureNormalizer.normalize(
          ce.pressure,
          ce.pointerType,
          ce.buttons,
        ),
        tiltX: ce.tiltX || 0,
        tiltY: ce.tiltY || 0,
        timestamp: ce.timeStamp,
      };
    });
  }

  /** Resolve InputDevice from PointerEvent.pointerType */
  private resolveDevice(e: PointerEvent): InputDevice {
    switch (e.pointerType) {
      case 'pen':
        return 'pen';
      case 'touch':
        return 'touch';
      case 'mouse':
        return 'mouse';
      default:
        return 'unknown';
    }
  }

  /**
   * Detect pen eraser tip.
   * - Wacom/Windows Ink: button === 5 (eraser end)
   * - Some tablets: e.buttons bitmask bit 5 (32)
   */
  private detectPenEraser(e: PointerEvent): boolean {
    if (e.pointerType !== 'pen') return false;
    // Button 5 = eraser tip on most Wacom/Windows Ink tablets
    return e.button === 5 || (e.buttons & 32) !== 0;
  }
}
