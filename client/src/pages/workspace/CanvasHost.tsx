import React, { useEffect, useRef, useCallback } from 'react';
import { createEngine, type EngineInstance, type StrokeConfig } from '@/canvas-engine';
import { useToolStore } from '@/state/toolStore';
import { BRUSH_DEFAULTS } from '@/constants/brush-defaults';

const DRAWING_TOOLS = new Set(['pen', 'pencil', 'highlighter']);

export const CanvasHost: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<EngineInstance | null>(null);

  // Read current tool state (closure captured by the config provider)
  const toolStoreRef = useRef(useToolStore.getState());
  useEffect(() => {
    return useToolStore.subscribe((state) => {
      toolStoreRef.current = state;
    });
  }, []);

  // Stroke config provider — called by StrokeManager on each pointer-begin
  const strokeConfigProvider = useCallback((): StrokeConfig | null => {
    const { activeToolId, color, brushSize, brushOpacity } = toolStoreRef.current;

    // Only produce config for drawing tools
    if (!DRAWING_TOOLS.has(activeToolId)) return null;

    const toolId = activeToolId as 'pen' | 'pencil' | 'highlighter';
    const defaults = BRUSH_DEFAULTS[toolId];

    return {
      toolId,
      color,
      brush: {
        size: brushSize,
        opacity: brushOpacity,
        thinning: defaults?.thinning ?? 0.5,
        smoothing: defaults?.smoothing ?? 0.5,
        streamline: defaults?.streamline ?? 0.5,
      },
      layerId: 'default',
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = createEngine(containerRef.current, strokeConfigProvider);
    engineRef.current = instance;

    return () => {
      instance.destroy();
      engineRef.current = null;
    };
  }, [strokeConfigProvider]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden canvas-bg"
    >
      {/* 4 stacked layer canvases are dynamically managed by CanvasLayerManager */}
    </div>
  );
};
