// Framework-agnostic Canvas Engine public API exports

import { Engine } from './Engine';
import type { Camera } from './camera/Camera';
import type { Viewport } from './rendering/Viewport';
import type { CanvasLayerManager } from './rendering/CanvasLayerManager';
import type { BackgroundRenderer } from './rendering/BackgroundRenderer';
import type { RenderPipeline } from './rendering/RenderPipeline';
import type { PointerManager } from './input/PointerManager';
import type { StrokeManager, StrokeConfigProvider } from './strokes/StrokeManager';

export interface EngineInstance {
  engine: Engine;
  camera: Camera;
  viewport: Viewport;
  layerManager: CanvasLayerManager;
  backgroundRenderer: BackgroundRenderer;
  pointerManager: PointerManager;
  strokeManager: StrokeManager;
  renderPipeline: RenderPipeline;
  resize: (width: number, height: number) => void;
  destroy: () => void;
}

/** Factory function to create and mount a new Canvas Engine instance */
export function createEngine(
  container: HTMLElement,
  strokeConfigProvider?: StrokeConfigProvider,
): EngineInstance {
  const engine = new Engine(container, strokeConfigProvider);

  return {
    engine,
    camera: engine.getCamera(),
    viewport: engine.getViewport(),
    layerManager: engine.getLayerManager(),
    backgroundRenderer: engine.getBackgroundRenderer(),
    pointerManager: engine.getPointerManager(),
    strokeManager: engine.getStrokeManager(),
    renderPipeline: engine.getRenderPipeline(),
    resize: (w: number, h: number) => engine.resize(w, h),
    destroy: () => engine.destroy(),
  };
}

// Module re-exports
export { Engine } from './Engine';
export { Camera } from './camera/Camera';
export { Viewport } from './rendering/Viewport';
export { ViewportCuller } from './rendering/ViewportCuller';
export { CanvasLayerManager } from './rendering/CanvasLayerManager';
export { BackgroundRenderer } from './rendering/BackgroundRenderer';
export { PointerManager } from './input/PointerManager';
export { PressureNormalizer } from './input/PressureNormalizer';
export { StrokeBuilder } from './strokes/StrokeBuilder';
export { StrokeManager } from './strokes/StrokeManager';
export { RenderPipeline } from './rendering/RenderPipeline';
export { renderStroke, renderActiveStroke, renderCommittedStrokes } from './rendering/StrokeRenderer';
export type { PointerData, PointerPhase, InputDevice, CoalescedPoint } from './input/pointer-types';
export type { StrokeConfig, StrokeToolId } from './strokes/StrokeBuilder';
export type { StrokeConfigProvider, StrokeEvent, StrokeEventType, StrokeEventCallback } from './strokes/StrokeManager';
