import { describe, it, expect, beforeEach } from 'vitest';
import { Camera } from '../camera/Camera';

describe('Camera Module', () => {
  let camera: Camera;

  beforeEach(() => {
    camera = new Camera();
  });

  it('should initialize with default offset (0,0) and zoom 1.0', () => {
    const transform = camera.getTransform();
    expect(transform.offsetX).toBe(0);
    expect(transform.offsetY).toBe(0);
    expect(transform.zoom).toBe(1);
  });

  it('should pan correctly with panBy', () => {
    camera.panBy(100, -50);
    const transform = camera.getTransform();
    expect(transform.offsetX).toBe(100);
    expect(transform.offsetY).toBe(-50);
  });

  it('should convert screen to world coordinates at 1.0 zoom', () => {
    camera.setPosition(100, 200);
    const world = camera.screenToWorld(150, 250);
    expect(world.x).toBe(50);
    expect(world.y).toBe(50);
  });

  it('should convert screen to world coordinates when zoomed in (2x)', () => {
    camera.setZoom(2.0, 0, 0); // zoom 2x centered at screen (0,0)
    const world = camera.screenToWorld(200, 400);
    expect(world.x).toBe(100);
    expect(world.y).toBe(200);
  });

  it('should clamp zoom within limits (0.1x to 20x)', () => {
    camera.setZoom(0.01, 0, 0);
    expect(camera.getTransform().zoom).toBe(0.1);

    camera.setZoom(100, 0, 0);
    expect(camera.getTransform().zoom).toBe(20);
  });
});
