// Viewport module — tracks container size and visible world bounds

import type { BoundingBox, Rect } from '@/types/geometry';
import type { Camera } from '../camera/Camera';

export class Viewport {
  private width: number = 0;
  private height: number = 0;
  private camera: Camera;

  constructor(camera: Camera, initialWidth: number = 0, initialHeight: number = 0) {
    this.camera = camera;
    this.width = initialWidth;
    this.height = initialHeight;
  }

  /** Set viewport dimension in screen pixels */
  public setSize(width: number, height: number): void {
    this.width = Math.max(0, width);
    this.height = Math.max(0, height);
  }

  /** Get viewport width in screen pixels */
  public getWidth(): number {
    return this.width;
  }

  /** Get viewport height in screen pixels */
  public getHeight(): number {
    return this.height;
  }

  /** Get viewport screen rectangle */
  public getScreenRect(): Rect {
    return { x: 0, y: 0, width: this.width, height: this.height };
  }

  /**
   * Get the current visible bounding box in world coordinates,
   * including optional margin in world units.
   */
  public getVisibleWorldBounds(marginWorldUnits: number = 0): BoundingBox {
    const topLeft = this.camera.screenToWorld(0, 0);
    const bottomRight = this.camera.screenToWorld(this.width, this.height);

    return {
      minX: Math.min(topLeft.x, bottomRight.x) - marginWorldUnits,
      minY: Math.min(topLeft.y, bottomRight.y) - marginWorldUnits,
      maxX: Math.max(topLeft.x, bottomRight.x) + marginWorldUnits,
      maxY: Math.max(topLeft.y, bottomRight.y) + marginWorldUnits,
    };
  }
}
