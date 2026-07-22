import React, { useEffect, useRef } from 'react';
import { createEngine, type EngineInstance } from '@/canvas-engine';

export const CanvasHost: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<EngineInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Instantiate framework-agnostic canvas engine
    engineRef.current = createEngine(containerRef.current);

    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[var(--bg-canvas)]"
    >
      {/* The 4 layer canvas elements will be imperative mounted by CanvasLayerManager in Phase 2 */}
      <canvas className="pointer-events-none absolute inset-0 h-full w-full" id="bg-canvas" />
      <canvas className="pointer-events-none absolute inset-0 h-full w-full" id="committed-canvas" />
      <canvas className="absolute inset-0 h-full w-full touch-none" id="active-canvas" />
      <canvas className="pointer-events-none absolute inset-0 h-full w-full" id="overlay-canvas" />
    </div>
  );
};
