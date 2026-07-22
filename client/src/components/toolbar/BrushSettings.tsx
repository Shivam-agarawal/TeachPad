import React from 'react';
import { useToolStore } from '@/state/toolStore';

export const BrushSettings: React.FC = () => {
  const brushSize = useToolStore((s) => s.brushSize);
  const setBrushSize = useToolStore((s) => s.setBrushSize);

  return (
    <div className="flex items-center gap-2 border-l border-[var(--border-subtle)] pl-2">
      <span className="text-[11px] text-[var(--text-secondary)]">{brushSize}px</span>
      <input
        type="range"
        min="1"
        max="48"
        value={brushSize}
        aria-label="Brush size"
        onChange={(e) => setBrushSize(Number(e.target.value))}
        className="h-1 w-16 cursor-pointer accent-[var(--accent)]"
      />
    </div>
  );
};
