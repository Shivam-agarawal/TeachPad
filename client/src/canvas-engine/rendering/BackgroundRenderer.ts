// Background Renderer — renders dot-grid, line-grid, or solid canvas background

import type { CanvasLayerManager } from './CanvasLayerManager';
import type { Camera } from '../camera/Camera';
import type { Viewport } from './Viewport';

export type GridStyle = 'none' | 'dot' | 'line';

export interface BackgroundOptions {
  theme: 'light' | 'dark';
  gridStyle: GridStyle;
  gridSize: number; // in world pixels
}

export class BackgroundRenderer {
  private layerManager: CanvasLayerManager;
  private camera: Camera;
  private viewport: Viewport;
  private options: BackgroundOptions = {
    theme: 'dark',
    gridStyle: 'none',
    gridSize: 24,
  };

  constructor(layerManager: CanvasLayerManager, camera: Camera, viewport: Viewport) {
    this.layerManager = layerManager;
    this.camera = camera;
    this.viewport = viewport;
  }

  /** Update background rendering options */
  public setOptions(options: Partial<BackgroundOptions>): void {
    this.options = { ...this.options, ...options };
    this.render();
  }

  /** Render background canvas layer */
  public render(): void {
    const layer = this.layerManager.getLayer('background');
    if (!layer) return;

    const { ctx } = layer;
    const width = this.layerManager.getWidth();
    const height = this.layerManager.getHeight();
    const transform = this.camera.getTransform();

    // 1. Fill background canvas color according to theme
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // physical CSS pixels
    ctx.fillStyle = this.options.theme === 'dark' ? '#0E0F11' : '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // 2. Render grid overlay if enabled
    if (this.options.gridStyle === 'none') return;

    ctx.save();
    this.camera.applyToContext(ctx);

    const bounds = this.viewport.getVisibleWorldBounds();
    const gridSize = this.options.gridSize;
    const gridColor =
      this.options.theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';

    const startX = Math.floor(bounds.minX / gridSize) * gridSize;
    const endX = Math.ceil(bounds.maxX / gridSize) * gridSize;
    const startY = Math.floor(bounds.minY / gridSize) * gridSize;
    const endY = Math.ceil(bounds.maxY / gridSize) * gridSize;

    if (this.options.gridStyle === 'dot') {
      ctx.fillStyle = gridColor;
      const dotRadius = Math.max(1, 1.5 / transform.zoom);
      for (let x = startX; x <= endX; x += gridSize) {
        for (let y = startY; y <= endY; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (this.options.gridStyle === 'line') {
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1 / transform.zoom;
      ctx.beginPath();
      for (let x = startX; x <= endX; x += gridSize) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
      }
      for (let y = startY; y <= endY; y += gridSize) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
      }
      ctx.stroke();
    }

    ctx.restore();
  }
}
