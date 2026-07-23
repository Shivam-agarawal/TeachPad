import React, { useState, useRef, useEffect } from 'react';
import { useToolStore } from '@/state/toolStore';

export const BrushSettings: React.FC = () => {
  const { brushSize, setBrushSize, brushOpacity, setBrushOpacity, color } = useToolStore();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={popoverRef} className="relative flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Brush Settings"
        className="px-2 py-1 flex items-center gap-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        <span
          className="rounded-full bg-current transition-all"
          style={{ width: Math.max(4, Math.min(14, brushSize)), height: Math.max(4, Math.min(14, brushSize)) }}
        />
        <span>{brushSize}px</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-4 glass-panel rounded-2xl shadow-xl z-50 flex flex-col gap-3 w-56 animate-entry">
          {/* Live Brush Size Dot Preview */}
          <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
            <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Brush Size
            </span>
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/5 dark:bg-white/5">
              <span
                className="rounded-full transition-all"
                style={{
                  width: Math.min(24, Math.max(2, brushSize)),
                  height: Math.min(24, Math.max(2, brushSize)),
                  backgroundColor: color,
                }}
              />
            </div>
          </div>

          {/* Size Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-medium">
              <span>Thickness</span>
              <span>{brushSize} px</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full accent-[var(--accent)] cursor-pointer h-1.5 rounded-lg bg-black/10 dark:bg-white/15"
            />
          </div>

          {/* Opacity Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-medium">
              <span>Opacity</span>
              <span>{Math.round(brushOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={brushOpacity}
              onChange={(e) => setBrushOpacity(Number(e.target.value))}
              className="w-full accent-[var(--accent)] cursor-pointer h-1.5 rounded-lg bg-black/10 dark:bg-white/15"
            />
          </div>
        </div>
      )}
    </div>
  );
};
