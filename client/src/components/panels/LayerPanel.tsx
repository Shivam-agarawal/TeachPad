import React from 'react';

export const LayerPanel: React.FC = () => {
  return (
    <div className="w-64 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--shadow-float)]">
      <h3 className="mb-3 text-[13px] font-medium text-[var(--text-primary)]">Layers</h3>
      <div className="space-y-1 text-[11px] text-[var(--text-secondary)]">
        <div className="flex items-center justify-between rounded p-2 bg-[var(--bg-surface-translucent)]">
          <span>Ink Layer 1</span>
          <span>Visible</span>
        </div>
        <div className="flex items-center justify-between rounded p-2">
          <span>Background Reference</span>
          <span>Locked</span>
        </div>
      </div>
    </div>
  );
};
