import React from 'react';
import { ToolSelector } from './ToolSelector';
import { ColorPicker } from './ColorPicker';
import { BrushSettings } from './BrushSettings';
import { OverflowMenu } from './OverflowMenu';

export const Toolbar: React.FC = () => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-translucent)] px-4 py-1.5 backdrop-blur-md shadow-[var(--shadow-float)]">
        <ToolSelector />
        <ColorPicker />
        <BrushSettings />
        <OverflowMenu />
      </div>
    </div>
  );
};
