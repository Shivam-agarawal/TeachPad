import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StrokeManager, type StrokeEvent, type StrokeConfigProvider } from '../strokes/StrokeManager';
import type { PointerData } from '../input/pointer-types';
import type { PointerManager, PointerEventCallback } from '../input/PointerManager';

/** Create a mock PointerManager that lets us manually fire events */
function createMockPointerManager() {
  let registeredCallback: PointerEventCallback | null = null;

  const mock = {
    onPointerEvent: vi.fn((cb: PointerEventCallback) => {
      registeredCallback = cb;
      return () => {
        registeredCallback = null;
      };
    }),
    fire: (data: PointerData) => {
      registeredCallback?.(data);
    },
    destroy: vi.fn(),
  };

  return mock as unknown as PointerManager & { fire: (data: PointerData) => void };
}

function makePointerData(phase: PointerData['phase'], overrides: Partial<PointerData> = {}): PointerData {
  return {
    pointerId: 1,
    phase,
    device: 'pen',
    screenX: 100,
    screenY: 200,
    worldX: 100,
    worldY: 200,
    pressure: 0.5,
    rawPressure: 0.5,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    timestamp: Date.now(),
    isPenEraser: false,
    isDown: phase !== 'end',
    coalescedPoints: [],
    ...overrides,
  };
}

const drawingConfig: StrokeConfigProvider = () => ({
  toolId: 'pen',
  color: '#FF0000',
  brush: { size: 4, opacity: 1, thinning: 0.5, smoothing: 0.5, streamline: 0.5 },
  layerId: 'default',
});

describe('StrokeManager', () => {
  let mockPointer: ReturnType<typeof createMockPointerManager>;
  let strokeManager: StrokeManager;

  beforeEach(() => {
    mockPointer = createMockPointerManager();
    strokeManager = new StrokeManager(mockPointer, drawingConfig);
  });

  it('should start with zero committed strokes', () => {
    expect(strokeManager.getStrokeCount()).toBe(0);
    expect(strokeManager.hasActiveStroke()).toBe(false);
  });

  it('should create an active stroke on pointer begin', () => {
    mockPointer.fire(makePointerData('begin'));
    expect(strokeManager.hasActiveStroke()).toBe(true);
    expect(strokeManager.getActiveStroke(1)).not.toBeNull();
  });

  it('should accumulate points on pointer move', () => {
    mockPointer.fire(makePointerData('begin'));
    mockPointer.fire(makePointerData('move', { worldX: 110, worldY: 210, isDown: true }));
    mockPointer.fire(makePointerData('move', { worldX: 120, worldY: 220, isDown: true }));

    const active = strokeManager.getActiveStroke(1);
    expect(active).not.toBeNull();
    expect(active!.points.length).toBe(3);
  });

  it('should commit a valid stroke on pointer end', () => {
    mockPointer.fire(makePointerData('begin', { worldX: 10, worldY: 10 }));
    mockPointer.fire(makePointerData('move', { worldX: 20, worldY: 20, isDown: true }));
    mockPointer.fire(makePointerData('end', { worldX: 30, worldY: 30 }));

    expect(strokeManager.getStrokeCount()).toBe(1);
    expect(strokeManager.hasActiveStroke()).toBe(false);
    expect(strokeManager.getCommittedStrokes()[0]?.color).toBe('#FF0000');
  });

  it('should cancel single-point strokes (stray taps)', () => {
    const events: StrokeEvent[] = [];
    strokeManager.onStrokeEvent((e) => events.push(e));

    mockPointer.fire(makePointerData('begin', { worldX: 10, worldY: 10 }));
    mockPointer.fire(makePointerData('end', { worldX: 10, worldY: 10 }));

    // Single-point stroke → not committed, cancel event emitted
    expect(strokeManager.getStrokeCount()).toBe(0);
    expect(events.some((e) => e.type === 'stroke:cancel')).toBe(true);
  });

  it('should dispatch stroke lifecycle events', () => {
    const events: StrokeEvent[] = [];
    strokeManager.onStrokeEvent((e) => events.push(e));

    mockPointer.fire(makePointerData('begin'));
    mockPointer.fire(makePointerData('move', { worldX: 120, worldY: 220, isDown: true }));
    mockPointer.fire(makePointerData('end', { worldX: 130, worldY: 230 }));

    expect(events.map((e) => e.type)).toEqual([
      'stroke:begin',
      'stroke:update',
      'stroke:end',
    ]);
  });

  it('should handle pointer cancel', () => {
    mockPointer.fire(makePointerData('begin'));
    mockPointer.fire(makePointerData('cancel'));

    expect(strokeManager.hasActiveStroke()).toBe(false);
    expect(strokeManager.getStrokeCount()).toBe(0);
  });

  it('should not create strokes when configProvider returns null', () => {
    const noDrawManager = new StrokeManager(mockPointer, () => null);
    mockPointer.fire(makePointerData('begin'));
    expect(noDrawManager.hasActiveStroke()).toBe(false);
    noDrawManager.destroy();
  });

  it('should support removeStroke for undo', () => {
    mockPointer.fire(makePointerData('begin', { worldX: 10, worldY: 10 }));
    mockPointer.fire(makePointerData('move', { worldX: 20, worldY: 20, isDown: true }));
    mockPointer.fire(makePointerData('end', { worldX: 30, worldY: 30 }));

    const stroke = strokeManager.getCommittedStrokes()[0]!;
    const removed = strokeManager.removeStroke(stroke.id);
    expect(removed).not.toBeNull();
    expect(strokeManager.getStrokeCount()).toBe(0);
  });

  it('should support addStroke for redo', () => {
    mockPointer.fire(makePointerData('begin', { worldX: 10, worldY: 10 }));
    mockPointer.fire(makePointerData('move', { worldX: 20, worldY: 20, isDown: true }));
    mockPointer.fire(makePointerData('end', { worldX: 30, worldY: 30 }));

    const stroke = strokeManager.getCommittedStrokes()[0]!;
    strokeManager.removeStroke(stroke.id);
    strokeManager.addStroke(stroke);
    expect(strokeManager.getStrokeCount()).toBe(1);
  });

  it('should clean up on destroy', () => {
    strokeManager.destroy();
    expect(strokeManager.hasActiveStroke()).toBe(false);
  });
});
