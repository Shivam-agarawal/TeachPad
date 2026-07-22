import React from 'react';
import { INK_PALETTE } from '@/constants/design-tokens';
import { useToolStore } from '@/state/toolStore';

export const ColorPicker: React.FC = () => {
  const activeColor = useToolStore((s) => s.color);
  const setColor = useToolStore((s) => s.setColor);

  return (
    <div className="flex items-center gap-1.5 border-l border-[var(--border-subtle)] pl-2">
      {INK_PALETTE.slice(0, 5).map((colorHex) => {
        const isSelected = activeColor === colorHex;
        return (
          <button
            key={colorHex}
            onClick={() => setColor(colorHex)}
            aria-label={`Select color ${colorHex}`}
            style={{ backgroundColor: colorHex }}
            className={`h-4 w-4 rounded-full transition-transform ${
              isSelected ? 'ring-2 ring-[var(--accent)] ring-offset-1 scale-110' : 'hover:scale-105'
            }`}
          />
        );
      })}
    </div>
  );
};
