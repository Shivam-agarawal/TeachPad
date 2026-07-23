// Framework-agnostic Camera module for TeachPad canvas engine
// Manages infinite canvas pan offset (X, Y) and zoom level

import type { Point, Transform } from '@/types/geometry';
import { ZOOM_MIN, ZOOM_MAX, ZOOM_DEFAULT } from '@/constants/limits';
import { clamp } from '@/utils/math';

export type CameraChangeListener = (transform: Transform) => void;

export class Camera {
  private offsetX: number = 0;
  private offsetY: number = 0;
  private zoom: number = ZOOM_DEFAULT;
  private listeners: Set<CameraChangeListener> = new Set();

  constructor(initialOffset: Point = { x: 0, y: 0 }, initialZoom: number = ZOOM_DEFAULT) {
    this.offsetX = initialOffset.x;
    this.offsetY = initialOffset.y;
    this.zoom = clamp(initialZoom, ZOOM_MIN, ZOOM_MAX);
  }

  /** Get current camera transform state */
  public getTransform(): Transform {
    return {
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      zoom: this.zoom,
    };
  }

  /** Set camera position directly */
  public setPosition(x: number, y: number): void {
    if (this.offsetX === x && this.offsetY === y) return;
    this.offsetX = x;
    this.offsetY = y;
    this.notifyListeners();
  }

  /** Pan camera by relative delta in screen pixels */
  public panBy(deltaX: number, deltaY: number): void {
    if (deltaX === 0 && deltaY === 0) return;
    this.offsetX += deltaX;
    this.offsetY += deltaY;
    this.notifyListeners();
  }

  /** Set zoom centered at screen position (screenX, screenY) */
  public setZoom(newZoom: number, centerScreenX: number, centerScreenY: number): void {
    const clampedZoom = clamp(newZoom, ZOOM_MIN, ZOOM_MAX);
    if (clampedZoom === this.zoom) return;

    // Convert screen center point to world coordinates before zoom
    const worldCenterBefore = this.screenToWorld(centerScreenX, centerScreenY);

    this.zoom = clampedZoom;

    // Adjust offset so worldCenterBefore remains under screenCenterAfter
    this.offsetX = centerScreenX - worldCenterBefore.x * this.zoom;
    this.offsetY = centerScreenY - worldCenterBefore.y * this.zoom;

    this.notifyListeners();
  }

  /** Zoom in/out by factor centered at screen position */
  public zoomByFactor(factor: number, centerScreenX: number, centerScreenY: number): void {
    this.setZoom(this.zoom * factor, centerScreenX, centerScreenY);
  }

  /** Reset camera to 100% zoom and (0,0) offset */
  public reset(): void {
    this.offsetX = 0;
    this.offsetY = 0;
    this.zoom = ZOOM_DEFAULT;
    this.notifyListeners();
  }

  /** Convert screen pixel coordinates (e.g. pointer events) to world coordinates */
  public screenToWorld(screenX: number, screenY: number): Point {
    return {
      x: (screenX - this.offsetX) / this.zoom,
      y: (screenY - this.offsetY) / this.zoom,
    };
  }

  /** Convert world coordinates to screen pixel coordinates */
  public worldToScreen(worldX: number, worldY: number): Point {
    return {
      x: worldX * this.zoom + this.offsetX,
      y: worldY * this.zoom + this.offsetY,
    };
  }

  /** Apply current camera transform to a Canvas 2D Rendering Context */
  public applyToContext(ctx: CanvasRenderingContext2D): void {
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.zoom, this.zoom);
  }

  /** Subscribe to camera change events */
  public onChange(listener: CameraChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const state = this.getTransform();
    this.listeners.forEach((listener) => listener(state));
  }
}
