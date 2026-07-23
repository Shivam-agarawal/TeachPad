import { describe, it, expect, beforeEach } from 'vitest';
import { Camera } from '../camera/Camera';
import { Viewport } from '../rendering/Viewport';
import { ViewportCuller } from '../rendering/ViewportCuller';

describe('ViewportCuller Module', () => {
  let camera: Camera;
  let viewport: Viewport;
  let culler: ViewportCuller;

  beforeEach(() => {
    camera = new Camera();
    viewport = new Viewport(camera, 1000, 800);
    culler = new ViewportCuller(viewport);
  });

  it('should report a point inside viewport as visible', () => {
    expect(culler.isPointVisible({ x: 500, y: 400 })).toBe(true);
  });

  it('should report a point outside viewport as not visible', () => {
    expect(culler.isPointVisible({ x: 1500, y: 400 })).toBe(false);
  });

  it('should report overlapping bounds as visible', () => {
    expect(
      culler.isBoundsVisible({ minX: 900, minY: 700, maxX: 1100, maxY: 900 }),
    ).toBe(true);
  });

  it('should report non-overlapping bounds as not visible', () => {
    expect(
      culler.isBoundsVisible({ minX: 1100, minY: 900, maxX: 1200, maxY: 1000 }),
    ).toBe(false);
  });

  it('should include margin in visibility check', () => {
    // Point at (1050, 400) is outside 1000-wide viewport, but within 100-unit margin
    expect(culler.isPointVisible({ x: 1050, y: 400 }, 100)).toBe(true);
  });
});
