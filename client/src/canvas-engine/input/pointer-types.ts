// Pointer event types for the canvas engine input pipeline

/** Input device type detected from PointerEvent.pointerType */
export type InputDevice = 'pen' | 'mouse' | 'touch' | 'unknown';

/** Pointer event phase within a gesture */
export type PointerPhase = 'begin' | 'move' | 'end' | 'cancel';

/**
 * Normalized pointer data emitted by PointerManager.
 * All coordinates are in WORLD space (already transformed through Camera).
 */
export interface PointerData {
  /** Unique pointer ID (from PointerEvent.pointerId) */
  pointerId: number;

  /** Gesture phase */
  phase: PointerPhase;

  /** Input device type */
  device: InputDevice;

  /** Position in screen (CSS) pixels relative to canvas */
  screenX: number;
  screenY: number;

  /** Position in world coordinates (after Camera transform) */
  worldX: number;
  worldY: number;

  /** Normalized pressure: 0.0 → 1.0. Mouse always reports 0.5 */
  pressure: number;

  /** Raw pressure value from PointerEvent (before normalization) */
  rawPressure: number;

  /** Pen tilt angles in degrees (-90 to 90). 0 if not a pen. */
  tiltX: number;
  tiltY: number;

  /** Pen barrel rotation in degrees (0-359). 0 if not supported. */
  twist: number;

  /** Timestamp from PointerEvent (DOMHighResTimeStamp via performance.now) */
  timestamp: number;

  /** Whether the pen's eraser tip / button is active */
  isPenEraser: boolean;

  /** Whether any button is pressed (left-click / pen contact) */
  isDown: boolean;

  /** Coalesced intermediate points (for high-frequency pen tablets) */
  coalescedPoints: CoalescedPoint[];
}

/** Lightweight coalesced point from getCoalescedEvents() */
export interface CoalescedPoint {
  screenX: number;
  screenY: number;
  worldX: number;
  worldY: number;
  pressure: number;
  tiltX: number;
  tiltY: number;
  timestamp: number;
}
