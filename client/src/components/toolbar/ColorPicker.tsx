import React, { useState, useRef, useEffect } from 'react';
import { useToolStore } from '@/state/toolStore';

const PRESET_COLORS = [
  '#3D7FFF', // Accent Blue
  '#1A1B1E', // Ink Dark
  '#E5484D', // Danger Red
  '#22C55E', // Vivid Green
  '#F59E0B', // Amber
  '#A855F7', // Purple
  '#EC4899', // Pink
  '#FFFFFF', // White
];

export const ColorPicker: React.FC = () => {
  const { color, setColor } = useToolStore();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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
        aria-label="Color Picker"
        className="group relative flex items-center justify-center p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all"
      >
        <span
          className="w-6 h-6 rounded-full border-2 border-white/80 dark:border-black/50 shadow-sm transition-transform active:scale-95"
          style={{ backgroundColor: color }}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 glass-panel rounded-2xl shadow-xl z-50 flex flex-col gap-2 min-w-[180px] animate-entry">
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] tracking-wider uppercase">
            Color Swatches
          </span>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setColor(preset);
                  setIsOpen(false);
                }}
                className={`w-7 h-7 rounded-full border transition-all hover:scale-110 active:scale-95 ${
                  color.toLowerCase() === preset.toLowerCase()
                    ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/30 scale-105'
                    : 'border-black/10 dark:border-white/10'
                }`}
                style={{ backgroundColor: preset }}
              />
            ))}
          </div>
          <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center gap-2">
            <span className="text-[11px] font-medium text-[var(--text-secondary)]">Custom:</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-[11px] font-mono text-[var(--text-primary)] uppercase">
              {color}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
