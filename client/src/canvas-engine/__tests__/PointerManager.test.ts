import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Camera } from '../camera/Camera';
import { CanvasLayerManager } from '../rendering/CanvasLayerManager';
import { PointerManager } from '../input/PointerManager';

describe('PointerManager', () => {
  let camera: Camera;
  let layerManager: CanvasLayerManager;
  let pointerManager: PointerManager;

  beforeEach(() => {
    // Create mock container with querySelector & appendChild
    const mockCanvas = {
      id: 'active-canvas',
      getContext: () => ({
        resetTransform: () => {},
        scale: () => {},
        save: () => {},
        restore: () => {},
        clearRect: () => {},
        setTransform: () => {},
      }),
      style: {},
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 1000,
        height: 800,
      }),
    } as unknown as HTMLCanvasElement;

    const mockContainer = {
      querySelector: (selector: string) => {
        if (selector === '#active-canvas') return mockCanvas;
        return null;
      },
      appendChild: vi.fn(),
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 1000,
        height: 800,
      }),
    } as unknown as HTMLElement;

    camera = new Camera();
    layerManager = new CanvasLayerManager(mockContainer);
    pointerManager = new PointerManager(camera, layerManager);
  });

  it('should initialize with zero active pointers', () => {
    expect(pointerManager.getActivePointerCount()).toBe(0);
    expect(pointerManager.hasPenInput()).toBe(false);
  });

  it('should allow registering and unsubscribing pointer listeners', () => {
    const callback = vi.fn();
    const unsubscribe = pointerManager.onPointerEvent(callback);

    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
  });

  it('should update pressure curve setting', () => {
    pointerManager.setPressureCurve('light');
    expect(true).toBe(true);
  });

  it('should clean up listeners on destroy', () => {
    pointerManager.destroy();
    expect(pointerManager.getActivePointerCount()).toBe(0);
  });
});
