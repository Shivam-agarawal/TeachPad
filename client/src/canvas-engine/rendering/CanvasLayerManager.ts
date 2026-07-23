// Canvas Layer Manager — handles creation, HiDPI scaling, resizing, and stacked 2D contexts
// Implements PRD §28 4-canvas layer architecture

export type LayerId = 'background' | 'committed' | 'active' | 'overlay';

export interface CanvasLayer {
  id: LayerId;
  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  zIndex: number;
}

export class CanvasLayerManager {
  private container: HTMLElement;
  private layers: Map<LayerId, CanvasLayer> = new Map();
  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;

  constructor(container: HTMLElement) {
    this.container = container;
    this.dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    this.initLayers();
  }

  /** Initialize the 4 stacked canvas elements inside the host container */
  private initLayers(): void {
    const layerConfigs: { id: LayerId; zIndex: number; pointerEvents: string }[] = [
      { id: 'background', zIndex: 1, pointerEvents: 'none' },
      { id: 'committed', zIndex: 2, pointerEvents: 'none' },
      { id: 'active', zIndex: 3, pointerEvents: 'auto' },
      { id: 'overlay', zIndex: 4, pointerEvents: 'none' },
    ];

    layerConfigs.forEach(({ id, zIndex, pointerEvents }) => {
      // Find existing canvas in container (e.g. from CanvasHost mount) or create a new one
      let canvas = this.container.querySelector<HTMLCanvasElement>(`#${id}-canvas`);
      if (!canvas && typeof document !== 'undefined') {
        canvas = document.createElement('canvas');
        canvas.id = `${id}-canvas`;
        this.container.appendChild(canvas);
      }
      if (!canvas) return;

      // Configure layer CSS positioning
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = zIndex.toString();
      canvas.style.pointerEvents = pointerEvents;
      canvas.style.touchAction = 'none';

      const ctx = canvas.getContext('2d', {
        alpha: id !== 'background',
        desynchronized: id === 'active', // low-latency hint for in-progress stroke layer
      });

      if (!ctx) {
        throw new Error(`Failed to obtain 2D rendering context for layer: ${id}`);
      }

      this.layers.set(id, { id, element: canvas, ctx, zIndex });
    });
  }

  /** Resize all 4 layer canvases synchronously matching container dimensions and HiDPI scaling */
  public resize(width: number, height: number): void {
    this.width = Math.max(0, width);
    this.height = Math.max(0, height);
    this.dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    const pixelWidth = Math.floor(this.width * this.dpr);
    const pixelHeight = Math.floor(this.height * this.dpr);

    this.layers.forEach((layer) => {
      const { element, ctx } = layer;

      // Only resize physical pixel buffer if dimensions changed
      if (element.width !== pixelWidth || element.height !== pixelHeight) {
        element.width = pixelWidth;
        element.height = pixelHeight;
        element.style.width = `${this.width}px`;
        element.style.height = `${this.height}px`;

        // Reset context matrix and scale for HiDPI
        ctx.resetTransform();
        ctx.scale(this.dpr, this.dpr);
      }
    });
  }

  /** Get specific canvas layer by ID */
  public getLayer(id: LayerId): CanvasLayer | undefined {
    return this.layers.get(id);
  }

  /** Get 2D Rendering Context for a specific layer */
  public getContext(id: LayerId): CanvasRenderingContext2D | undefined {
    return this.layers.get(id)?.ctx;
  }

  /** Clear a specific layer canvas */
  public clearLayer(id: LayerId): void {
    const layer = this.layers.get(id);
    if (!layer) return;
    layer.ctx.save();
    layer.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset to screen physical pixels
    layer.ctx.clearRect(0, 0, layer.element.width, layer.element.height);
    layer.ctx.restore();
  }

  /** Clear all 4 canvas layers */
  public clearAll(): void {
    this.layers.forEach((_, id) => this.clearLayer(id));
  }

  /** Get current container width in CSS pixels */
  public getWidth(): number {
    return this.width;
  }

  /** Get current container height in CSS pixels */
  public getHeight(): number {
    return this.height;
  }

  /** Get active Device Pixel Ratio */
  public getDPR(): number {
    return this.dpr;
  }

  /** Destroy and detach canvas elements */
  public destroy(): void {
    this.layers.clear();
  }
}
