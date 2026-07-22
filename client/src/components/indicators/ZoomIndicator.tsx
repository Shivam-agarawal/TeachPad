import React from 'react';

interface ZoomIndicatorProps {
  zoomLevel: number;
}

export const ZoomIndicator: React.FC<ZoomIndicatorProps> = ({ zoomLevel }) => {
  return (
    <div className="rounded-[var(--radius-sm)] bg-[var(--bg-surface-translucent)] px-2 py-1 text-[11px] font-medium text-[var(--text-secondary)] backdrop-blur-md shadow-sm">
      {Math.round(zoomLevel)}%
    </div>
  );
};
