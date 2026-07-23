import { describe, it, expect, beforeEach } from 'vitest';
import { Camera } from '../camera/Camera';
import { Viewport } from '../rendering/Viewport';

describe('Viewport Module', () => {
  let camera: Camera;
  let viewport: Viewport;

  beforeEach(() => {
    camera = new Camera();
    viewport = new Viewport(camera, 1920, 1080);
  });

  it('should initialize with correct dimensions', () => {
    expect(viewport.getWidth()).toBe(1920);
    expect(viewport.getHeight()).toBe(1080);
  });

  it('should resize correctly', () => {
    viewport.setSize(1280, 720);
    expect(viewport.getWidth()).toBe(1280);
    expect(viewport.getHeight()).toBe(720);
  });

  it('should return correct screen rect', () => {
    const rect = viewport.getScreenRect();
    expect(rect).toEqual({ x: 0, y: 0, width: 1920, height: 1080 });
  });

  it('should calculate visible world bounds at 1x zoom with no offset', () => {
    const bounds = viewport.getVisibleWorldBounds();
    expect(bounds.minX).toBe(0);
    expect(bounds.minY).toBe(0);
    expect(bounds.maxX).toBe(1920);
    expect(bounds.maxY).toBe(1080);
  });

  it('should calculate visible world bounds when camera is panned', () => {
    camera.panBy(-200, -100);
    const bounds = viewport.getVisibleWorldBounds();
    expect(bounds.minX).toBe(200);
    expect(bounds.minY).toBe(100);
    expect(bounds.maxX).toBe(2120);
    expect(bounds.maxY).toBe(1180);
  });

  it('should calculate visible world bounds when zoomed in (2x)', () => {
    camera.setZoom(2, 0, 0);
    const bounds = viewport.getVisibleWorldBounds();
    expect(bounds.minX).toBe(0);
    expect(bounds.minY).toBe(0);
    expect(bounds.maxX).toBe(960);
    expect(bounds.maxY).toBe(540);
  });

  it('should apply margin to visible world bounds', () => {
    const bounds = viewport.getVisibleWorldBounds(50);
    expect(bounds.minX).toBe(-50);
    expect(bounds.minY).toBe(-50);
    expect(bounds.maxX).toBe(1970);
    expect(bounds.maxY).toBe(1130);
  });

  it('should clamp negative dimensions to zero', () => {
    viewport.setSize(-100, -200);
    expect(viewport.getWidth()).toBe(0);
    expect(viewport.getHeight()).toBe(0);
  });
});
