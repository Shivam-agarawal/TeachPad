// Spatial Viewport Culler — determines if objects/bounds intersect the visible viewport

import type { BoundingBox, Point } from '@/types/geometry';
import type { Viewport } from './Viewport';

export class ViewportCuller {
  private viewport: Viewport;

  constructor(viewport: Viewport) {
    this.viewport = viewport;
  }

  /** Check if a world point is within the current visible viewport */
  public isPointVisible(point: Point, marginWorldUnits = 0): boolean {
    const bounds = this.viewport.getVisibleWorldBounds(marginWorldUnits);
    return (
      point.x >= bounds.minX &&
      point.x <= bounds.maxX &&
      point.y >= bounds.minY &&
      point.y <= bounds.maxY
    );
  }

  /** Check if a world bounding box intersects the current visible viewport */
  public isBoundsVisible(box: BoundingBox, marginWorldUnits = 0): boolean {
    const viewBounds = this.viewport.getVisibleWorldBounds(marginWorldUnits);
    return !(
      box.maxX < viewBounds.minX ||
      box.minX > viewBounds.maxX ||
      box.maxY < viewBounds.minY ||
      box.minY > viewBounds.maxY
    );
  }
}
