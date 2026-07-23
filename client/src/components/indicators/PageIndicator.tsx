import React from 'react';

interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
  onPrevPage?: () => void;
  onNextPage?: () => void;
}

export const PageIndicator: React.FC<PageIndicatorProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}) => {
  return (
    <div className="glass-panel px-3 py-1.5 rounded-full flex items-center gap-2">
      <button
        onClick={onPrevPage}
        disabled={currentPage <= 1}
        aria-label="Previous Page"
        className="hover:text-[var(--accent)] text-[var(--text-secondary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center"
      >
        <span className="material-symbols-outlined text-[16px]">chevron_left</span>
      </button>
      <span className="text-[12px] font-semibold text-[var(--text-primary)] min-w-[30px] text-center">
        {currentPage}/{totalPages}
      </span>
      <button
        onClick={onNextPage}
        disabled={currentPage >= totalPages}
        aria-label="Next Page"
        className="hover:text-[var(--accent)] text-[var(--text-secondary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center"
      >
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
      </button>
      <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10" />
      <button
        aria-label="Toggle Grid"
        className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors flex items-center"
      >
        <span className="material-symbols-outlined text-[16px]">grid_on</span>
      </button>
    </div>
  );
};
