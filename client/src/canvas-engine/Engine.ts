// TeachPad Canvas Engine — Framework-agnostic Orchestrator
// Coordinates CanvasLayerManager, Camera, Viewport, BackgroundRenderer, PointerManager, and StrokeManager

import { Camera } from './camera/Camera';
import { Viewport } from './rendering/Viewport';
import { ViewportCuller } from './rendering/ViewportCuller';
import { CanvasLayerManager } from './rendering/CanvasLayerManager';
import { BackgroundRenderer } from './rendering/BackgroundRenderer';
import { RenderPipeline } from './rendering/RenderPipeline';
import { PointerManager } from './input/PointerManager';
import { StrokeManager, type StrokeConfigProvider } from './strokes/StrokeManager';
import { logger } from '@/utils/logger';

export class Engine {
  private container: HTMLElement;
  private camera: Camera;
  private viewport: Viewport;
  private culler: ViewportCuller;
  private layerManager: CanvasLayerManager;
  private backgroundRenderer: BackgroundRenderer;
  private pointerManager: PointerManager;
  private strokeManager: StrokeManager;
  private renderPipeline: RenderPipeline;
  private resizeObserver: ResizeObserver | null = null;
  private isDestroyed: boolean = false;

  constructor(container: HTMLElement, strokeConfigProvider?: StrokeConfigProvider) {
    this.container = container;

    // 1. Initialize core components
    this.camera = new Camera();
    this.viewport = new Viewport(this.camera);
    this.culler = new ViewportCuller(this.viewport);
    this.layerManager = new CanvasLayerManager(this.container);
    this.backgroundRenderer = new BackgroundRenderer(
      this.layerManager,
      this.camera,
      this.viewport,
    );
    this.pointerManager = new PointerManager(this.camera, this.layerManager);
    this.strokeManager = new StrokeManager(
      this.pointerManager,
      strokeConfigProvider ?? (() => null),
    );
    this.renderPipeline = new RenderPipeline(
      this.camera,
      this.layerManager,
      this.strokeManager,
    );

    // 2. Initial size sync
    this.syncDimensions();

    // 3. Set up listeners
    this.setupResizeObserver();
    this.setupCameraListener();

    logger.info('TeachPad Canvas Engine initialized successfully');
  }

  /** Sync engine dimensions matching container bounding rect */
  private syncDimensions(): void {
    const rect = this.container.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    this.layerManager.resize(width, height);
    this.viewport.setSize(width, height);
    this.backgroundRenderer.render();
  }

  /** Attach ResizeObserver to host container for seamless auto-resize */
  private setupResizeObserver(): void {
    if (typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver((entries) => {
      if (this.isDestroyed) return;
      for (const entry of entries) {
        if (entry.target === this.container) {
          const contentRect = entry.contentRect;
          this.resize(contentRect.width, contentRect.height);
        }
      }
    });

    this.resizeObserver.observe(this.container);
  }

  /** Subscribe to camera updates to re-render background */
  private setupCameraListener(): void {
    this.camera.onChange(() => {
      if (this.isDestroyed) return;
      this.backgroundRenderer.render();
    });
  }

  /** Explicit manual resize entry point */
  public resize(width: number, height: number): void {
    const w = Math.floor(width);
    const h = Math.floor(height);

    this.layerManager.resize(w, h);
    this.viewport.setSize(w, h);
    this.backgroundRenderer.render();
  }

  /** Getters */
  public getCamera(): Camera {
    return this.camera;
  }

  public getViewport(): Viewport {
    return this.viewport;
  }

  public getCuller(): ViewportCuller {
    return this.culler;
  }

  public getLayerManager(): CanvasLayerManager {
    return this.layerManager;
  }

  public getBackgroundRenderer(): BackgroundRenderer {
    return this.backgroundRenderer;
  }

  public getPointerManager(): PointerManager {
    return this.pointerManager;
  }

  public getStrokeManager(): StrokeManager {
    return this.strokeManager;
  }

  public getRenderPipeline(): RenderPipeline {
    return this.renderPipeline;
  }

  /** Cleanup and destroy engine instance */
  public destroy(): void {
    this.isDestroyed = true;
    this.renderPipeline.destroy();
    this.strokeManager.destroy();
    this.pointerManager.destroy();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.layerManager.destroy();
    logger.info('TeachPad Canvas Engine destroyed');
  }
}
