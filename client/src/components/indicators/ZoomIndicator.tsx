import React from 'react';

interface ZoomIndicatorProps {
  zoomLevel: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

export const ZoomIndicator: React.FC<ZoomIndicatorProps> = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  return (
    <div className="glass-panel p-1 rounded-2xl flex items-center gap-0.5">
      {/* Zoom Stack (vertical +/-) */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <button
          onClick={onZoomIn}
          aria-label="Zoom In"
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
        <div className="w-full h-[1px] bg-black/8 dark:bg-white/8" />
        <button
          onClick={onZoomOut}
          aria-label="Zoom Out"
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">remove</span>
        </button>
      </div>

      {/* Zoom Percentage Badge */}
      <button
        onClick={onResetZoom}
        aria-label="Reset Zoom"
        className="px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[12px] font-semibold text-[var(--text-primary)] transition-all min-w-[44px] text-center"
      >
        {zoomLevel}%
      </button>
    </div>
  );
};
